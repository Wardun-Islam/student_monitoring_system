import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorDisplay from "./ErrorDisplay";
import { getUser, getAssignment } from "./ApiRequestHandler";
import PdfViewer from "./PdfViewer";
import Box from "@mui/material/Box";
import TopAppBar from "./AppBar";

export default function AssignmentPage() {
  const history = useHistory();
  const { assignment_id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [userType, setUserType] = React.useState("");
  const [assignment, setAssignment] = React.useState(null);

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        setUserType(response.data.user.account_type);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        window.localStorage.removeItem("token");
        history.push("/signin");
      });

    console.log("getting assignments");
    getAssignment({
      token: window.localStorage.getItem("token"),
      assignment_id: assignment_id.split(":")[1],
    })
      .then(function (response) {
        setAssignment(response.data.assignment);
      })
      .catch(function (error) {
        console.log(error);
        setAssignment(null);
      });
  }, []);

  const closeError = () => {
    setOpenError(false);
  };

  const confirmError = () => {
    setOpenError(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopAppBar
        title={"Assignments"}
        button={userType === "teacher"}
        button_text={userType === "teacher" ? "Students" : null}
        onButtonPress={
          userType === "teacher"
            ? () => {
                history.push("/students:" + assignment_id.split(":")[1]);
              }
            : null
        }
      />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <LoadingPage />
        </Box>
      ) : assignment !== null ? (
        <PdfViewer assignment={assignment} userType={userType} />
      ) : (
        <Box display="flex" p={3} flexDirection="column" alignItems="center">
          Nothing found to shown.
        </Box>
      )}
      <ErrorDisplay
        onClose={closeError}
        open={openError}
        handleConfirm={confirmError}
        message={errorMessage}
      />
    </Box>
  );
}
