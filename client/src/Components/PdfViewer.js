import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import WebViewer from "@pdftron/webviewer";
import { SocketContext } from "../service/socket";
import {
  getUser,
  postAssignmentStudentImage,
  getStudents,
  getAnnotations,
} from "./ApiRequestHandler";
import Webcam from "react-webcam";

export default function PdfViewer({ assignment, userType }) {
  const socket = useContext(SocketContext);
  const [pageNo, setPageNo] = useState(0);
  const pageNumberRef = useRef(1);
  const webcamRef = React.useRef(null);
  const viewer = useRef(null);
  const serializer = new XMLSerializer();
  let annotManager = null;

  useEffect(() => {
    pageNumberRef.current = pageNo;
  }, [pageNo]);

  useEffect(() => {
    socket.emit("join_annotation_room", assignment.assignment_id);
    getUser({ token: window.localStorage.getItem("token") }).then(function (
      user_respond
    ) {
      getStudents({
        assignment_id: assignment.assignment_id,
        token: window.localStorage.getItem("token"),
      }).then(function (studentListRespond) {
        WebViewer(
          {
            annotationUser: user_respond.data.user.user_id,
            path: "/webviewer/lib",
            initialDoc: assignment.pdf_link,
            documentXFDFRetriever: async () => {
              const rows = await loadXfdfStrings(assignment.assignment_id);
              console.log(rows);
              return rows.map((row) => row.xfdfString);
            },
          },
          viewer.current
        ).then((instance) => {
          const { documentViewer, CoreControls } = instance.Core;

          annotManager = instance.docViewer.getAnnotationManager();
          // you can now call WebViewer APIs here...

          instance.UI.disableElements(["searchButton"]);
          instance.UI.disableElements(["menuButton"]);
          instance.UI.disableElements(["panToolButton"]);
          instance.UI.disableElements(["selectToolButton"]);
          instance.UI.disableElements(["leftPanelButton"]);
          instance.UI.disableElements(["viewControlsButton"]);

          instance.UI.disableElements(["underlineToolGroupButton"]);
          instance.UI.disableElements(["strikeoutToolGroupButton"]);
          instance.UI.disableElements(["squigglyToolGroupButton"]);
          instance.UI.disableElements(["stickyToolGroupButton"]);
          instance.UI.disableElements(["freeTextToolGroupButton"]);
          instance.UI.disableElements(["freeHandToolGroupButton"]);
          instance.UI.disableElements(["eraserToolButton"]);
          instance.UI.disableElements(["freeHandHighlightToolGroupButton"]);
          instance.UI.disableElements(["contextMenuPopup"]);

          instance.UI.setToolbarGroup("toolbarGroup-View");
          instance.UI.disableElements(["toolbarGroup-Shapes"]);
          instance.UI.disableElements(["toolbarGroup-Edit"]);
          instance.UI.disableElements(["toolbarGroup-Insert"]);
          instance.UI.disableElements(["toolbarGroup-Forms"]);
          instance.UI.disableElements(["toolbarGroup-FillAndSign"]);

          instance.UI.enableElements(["singleLayout"]);
          documentViewer
            .getDisplayModeManager()
            .setDisplayMode(
              new CoreControls.DisplayMode(
                documentViewer,
                CoreControls.DisplayModes.Single
              )
            );

          documentViewer.addEventListener(
            "pageComplete",
            (pageNumber, canvas) => {
              setPageNo(pageNumber);
            }
          );

          console.log(studentListRespond.data);
          annotManager.setAnnotationDisplayAuthorMap((userId) => {
            console.log("userId", userId);
            if (userId === studentListRespond.data.teacher_info.user_id) {
              return studentListRespond.data.teacher_info.first_name;
            } else {
              const student = studentListRespond.data.students_info.find(
                (o) => o.user_id === userId
              );
              return student.first_name;
            }
          });

          annotManager.on("annotationChanged", async (e) => {
            // If annotation change is from import, return
            if (e.imported) {
              return;
            }

            const xfdfString = await annotManager.exportAnnotCommand();

            // Parse xfdfString to separate multiple annotation changes to individual annotation change
            const parser = new DOMParser();
            const commandData = parser.parseFromString(xfdfString, "text/xml");

            const addedAnnots = commandData.getElementsByTagName("add")[0];
            const modifiedAnnots =
              commandData.getElementsByTagName("modify")[0];
            const deletedAnnots = commandData.getElementsByTagName("delete")[0];

            // List of added annotations
            addedAnnots.childNodes.forEach((child) => {
              sendAnnotationChange(child, "add");
            });

            // List of modified annotations
            modifiedAnnots.childNodes.forEach((child) => {
              sendAnnotationChange(child, "modify");
            });

            // List of deleted annotations
            deletedAnnots.childNodes.forEach((child) => {
              sendAnnotationChange(child, "delete");
            });
          });

          socket.on("get_annotation_changed", async (data) => {
            const annotation = JSON.parse(data);
            const annotations = await annotManager.importAnnotCommand(
              annotation.xfdfString
            );
            annotManager.drawAnnotationsFromList(annotations);
          });
        });
      });
    });
  }, []);

  const loadXfdfStrings = (documentId) => {
    return getAnnotations({
      documentId: documentId,
      token: window.localStorage.getItem("token"),
    })
      .then((data) => {
        console.log(data);
        return data.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  // wrapper function to convert xfdf fragments to full xfdf strings
  const convertToXfdf = (changedAnnotation, action) => {
    let xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields />`;
    if (action === "add") {
      xfdfString += `<add>${changedAnnotation}</add><modify /><delete />`;
    } else if (action === "modify") {
      xfdfString += `<add /><modify>${changedAnnotation}</modify><delete />`;
    } else if (action === "delete") {
      xfdfString += `<add /><modify /><delete>${changedAnnotation}</delete>`;
    }
    xfdfString += `</xfdf>`;
    return xfdfString;
  };

  // helper function to send annotation changes to WebSocket server
  const sendAnnotationChange = (annotation, action) => {
    if (annotation.nodeType !== annotation.TEXT_NODE) {
      const annotationString = serializer.serializeToString(annotation);
      socket.emit(
        "annotation_changed",
        JSON.stringify({
          documentId: assignment.assignment_id,
          annotationId: annotation.getAttribute("name"),
          xfdfString: convertToXfdf(annotationString, action),
        })
      );
    }
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const capture = React.useCallback(() => {
    const previewImage = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    if (assignment && previewImage && pageNumberRef.current) {
      postAssignmentStudentImage({
        assignmentId: assignment.assignment_id,
        image: dataURLtoFile(previewImage, Date.now() + ".jpeg"),
        page_number: pageNumberRef.current,
        token: window.localStorage.getItem("token"),
      })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [webcamRef]);

  useEffect(() => {
    var interval;

    if (userType === "student") {
      interval = setInterval(() => {
        capture();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [pageNo]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        marginTop: 8,
      }}
    >
      {userType === "student" && (
        <Box
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            padding: 0,
            paddingRight: "10px",
            margin: 0,
          }}
          zIndex="tooltip"
        >
          <Webcam
            width={240}
            height={200}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
        </Box>
      )}
      <div ref={viewer} style={{ height: "89vh", width: "100%" }}></div>
    </Box>
  );
}
