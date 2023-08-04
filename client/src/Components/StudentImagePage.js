import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { getStudentImage } from "./ApiRequestHandler";
import { useHistory } from "react-router-dom";
import { Carousel } from "../lib";
import TopAppBar from "./AppBar";

export default function StudentImagePage() {
  const history = useHistory();
  const { assignment_id, student_id, student_name } = history.location.state;
  const [itemData, setItemData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const myRef = useRef();
  const captionStyle = {
    fontSize: ".8em",
    fontWeight: "bold",
  };
  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };
  useEffect(() => {
    getStudentImage({
      assignment_id: assignment_id,
      student_id: student_id,
      token: window.localStorage.getItem("token"),
    })
      .then(function (response) {
        console.log(response);
        const data = response.data.map(function (value) {
          return {
            image: value.image_link,
            caption: `<div>
                  ${"Page: " + value.page_number}
                  <br/>
                  ${
                    "Date: " +
                    new Date(parseInt(value.post_date)).toLocaleString()
                  }<br/>
                  ${"User: " + value.is_user}
                </div>`,
            user: value.is_user,
          };
        });
        setItemData(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <TopAppBar
        title={student_name}
        button={false}
        button_text={""}
        onButtonPress={null}
      />
      {loading ? (
        <div>loading</div>
      ) : itemData && itemData.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Carousel
            data={itemData}
            time={2000}
            width="850px"
            height="500px"
            captionStyle={captionStyle}
            radius="10px"
            slideNumber={true}
            slideNumberStyle={slideNumberStyle}
            captionPosition="bottom"
            automatic={false}
            dots={false}
            pauseIconColor="white"
            pauseIconSize="40px"
            slideBackgroundColor="darkgrey"
            slideImageFit="cover"
            thumbnails={true}
            thumbnailWidth="100px"
            style={{
              textAlign: "center",
              maxWidth: "850px",
              maxHeight: "500px",
              margin: "40px auto",
            }}
          />
        </Box>
      ) : (
        <div>Nothing to display</div>
      )}
    </div>
  );
}
