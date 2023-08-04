import React, { useEffect } from "react";
import { getStudents } from "./ApiRequestHandler";
import { useHistory, useParams } from "react-router-dom";
import TopAppBar from "./AppBar";
import ErrorDisplay from "./ErrorDisplay";
import LoadingPage from "./LoadingPage";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

export default function StudentList() {
  const [studentList, setStudentList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasError, setHasError] = React.useState(false);
  const { assignment_id } = useParams();
  const history = useHistory();

  const closeError = () => {
    setOpenError(false);
  };

  const confirmError = () => {
    setOpenError(false);
  };

  useEffect(() => {
    getStudents({
      assignment_id: assignment_id.split(":")[1],
      token: window.localStorage.getItem("token"),
    })
      .then(function (response) {
        setStudentList(response.data.students_info);
        setHasError(false);
        setLoading(false);
      })
      .catch(function (error) {
        setErrorMessage(
          "Getting error while getting students from databse please try again."
        );
        setHasError(true);
        openError(true);
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopAppBar
        title={"Students"}
        button={false}
        button_text={""}
        onButtonPress={null}
      />

      {hasError ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            Something went wrong...
          </Typography>
        </Box>
      ) : loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <LoadingPage />
        </Box>
      ) : studentList === null ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            No student joined yet
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <List
            sx={{
              marginTop: 1,
              width: "40%",
              bgcolor: "background.paper",
            }}
          >
            {studentList.map((student, i) => {
              return (
                <>
                  <ListItem key={i}>
                    <ListItemButton
                      sx={{
                        padding: "5px",
                      }}
                      onClick={() => {
                        history.push("/student/identification/result", {
                          assignment_id: assignment_id.split(":")[1],
                          student_id: student.user_id,
                          student_name: student.first_name+" "+student.last_name,
                        });
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={student.first_name}
                          src={student.user_image}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        id={i}
                        primary={student.first_name + " " + student.last_name}
                        secondary={
                          <div>
                            <div>{student.email}</div>
                          </div>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })}
          </List>
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
