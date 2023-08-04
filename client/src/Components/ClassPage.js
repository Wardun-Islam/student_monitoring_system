import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import TopAppBar from "./AppBar";
import LoadingPage from "./LoadingPage";
import ErrorDisplay from "./ErrorDisplay";
import {
  getClassInfo,
  getUser,
  postAssignment,
  getAssignments,
} from "./ApiRequestHandler";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

export default function ClassPage() {
  const history = useHistory();
  const { class_id } = useParams();
  const [classInfo, setClassInfo] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [assignments, setAssignments] = React.useState(null);
  const [createOption, setCreateOption] = React.useState(false);
  useEffect(() => {
    getClassInfo({
      token: window.localStorage.getItem("token"),
      class_id: class_id.split(":")[1],
    })
      .then(function (response) {
        console.log(response.data.class_info);
        setClassInfo(response.data.class_info[0]);
        getUser({ token: window.localStorage.getItem("token") })
          .then(function (response) {
            if (response.data.user.account_type === "teacher")
              setCreateOption(true);
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            window.localStorage.removeItem("token");
            history.push("/signin");
          });
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMessage("Getting classroom from database is failed.");
        setOpenError(true);
      });

    console.log("getting assignments");
    getAssignments({
      token: window.localStorage.getItem("token"),
      class_id: class_id.split(":")[1],
    })
      .then(function (response) {
        console.log(response.data);
        setAssignments(response.data.assignments);
      })
      .catch(function (error) {
        setAssignments(null);
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
        title={"Classroom"}
        button={createOption}
        button_text={"Post new assignment"}
        onButtonPress={()=>{
          history.push("/postassignment:" + classInfo.class_room_id);
        }}
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
      ) : (
        <Box
          sx={{
            width: "80%",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.dark",
              padding: 5,
            }}
          >
            <Typography
              sx={{ mt: 2, color: "white" }}
              variant="h2"
              component="div"
            >
              {classInfo.name}
            </Typography>
            {classInfo.section && (
              <Typography
                sx={{ mt: 2, color: "white" }}
                variant="h5"
                component="div"
              >
                {"Section: " + classInfo.section}
              </Typography>
            )}
            <Typography sx={{ color: "white" }} variant="h6" component="div">
              {"Class code: " + classInfo.class_room_id}
            </Typography>
          </Box>
          {assignments !== null && assignments.length !== 0 ? (
            <Box>
              <Typography
                sx={{ mt: 2, textAlign: "center", color: "primary.dark" }}
                variant="h4"
                component="div"
              >
                Assignments
              </Typography>
              <List
                sx={{
                  marginTop: 1,
                  width: "100%",
                  bgcolor: "background.paper",
                  padding: 0,
                }}
              >
                {assignments.map((assignment, i) => {
                  return (
                    <>
                      <ListItem key={i}>
                        <ListItemButton
                          sx={{
                            padding: "5px",
                          }}
                          onClick={() => {
                            history.push(
                              "/assignment:" + assignment.assignment_id
                            );
                          }}
                        >
                          <ListItemIcon>
                            <AssignmentIcon />
                          </ListItemIcon>
                          <ListItemText
                            id={i}
                            primary={assignment.post_description}
                            secondary={new Date(
                              assignment.post_date
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}
              </List>
            </Box>
          ) : (
            <Box
              display="flex"
              p={3}
              flexDirection="column"
              alignItems="center"
            >
              No assignments posted yet.
            </Box>
          )}
          <ErrorDisplay
            onClose={closeError}
            open={openError}
            handleConfirm={confirmError}
            message={errorMessage}
          />
        </Box>
      )}
    </Box>
  );
}

// <React.Fragment>
//   <CssBaseline />
//   <Container maxWidth="md">
//     <Box
//       display="flex"
//       alignItems="center"
//       flexDirection="column"
//       mt={1}
//     >
//       <Box width="100%">
//         <Card className={classes.root}>
//           <CardContent
//             style={{ backgroundColor: "#3482F2", padding: "20px" }}
//           >
//             <Typography variant="h3" style={{ color: "#ffffff" }}>
//               {classInfo.name}
//             </Typography>
//             <Typography variant="h4" style={{ color: "#ffffff" }}>
//               {classInfo.section}
//             </Typography>
//             <Typography variant="h6" style={{ color: "#ffffff" }}>
//               {"Class code: " + classInfo.class_room_id}
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//       <Box width="100%" pt={1}>
//         {userType === "teacher" && (
//           <Card className={classes.root}>
//             <CardContent>
//               <TextField
//                 fullWidth
//                 label="Announce a new class Assignment"
//                 multiline
//                 rows={5}
//                 variant="outlined"
//                 onChange={onPostDecriptionChange}
//               />
//               {pdf && (
//                 <Box
//                   display="flex"
//                   p={1}
//                   mt={1}
//                   border={1}
//                   width="100%"
//                 >
//                   <Box flexGrow={1}>{pdf.name}</Box>
//                   <Box alignSelf="flex-end">
//                     <IconButton
//                       onClick={handlePdfCloseClick}
//                       size="small"
//                       style={{
//                         padding: "0px",
//                         margin: "0px",
//                       }}
//                     >
//                       <CloseIcon />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               )}
//               {inputError && (
//                 <Typography
//                   variant="caption"
//                   display="block"
//                   color="error"
//                   style={{
//                     padding: "3px 0px 0px 0px",
//                     textAlign: "center",
//                     margin: "0px",
//                   }}
//                 >
//                   Invalid input.
//                 </Typography>
//               )}
//             </CardContent>
//             <CardActions disableSpacing>
//               <input
//                 style={{
//                   display: "none",
//                 }}
//                 id="icon-button-file"
//                 type="file"
//                 accept=".pdf"
//                 onChange={onFileChange}
//               />
//               <label htmlFor="icon-button-file">
//                 <Button
//                   style={{ marginLeft: "10px" }}
//                   variant="contained"
//                   color="primary"
//                   component="span"
//                   startIcon={<CloudUploadIcon />}
//                 >
//                   Attach Pdf
//                 </Button>
//               </label>

//               <Button
//                 onClick={onPostClicked}
//                 variant="contained"
//                 size="small"
//                 color="primary"
//                 style={{
//                   marginLeft: "auto",
//                   marginRight: "10px",
//                 }}
//               >
//                 POST
//               </Button>
//             </CardActions>
//           </Card>
//         )}
//       </Box>
//     </Box>
