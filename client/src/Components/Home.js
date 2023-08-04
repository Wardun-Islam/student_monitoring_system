import React, { useEffect } from "react";
import ClassTile from "./ClassTile";
import Profile from "./Profile";
import LoadingPage from "./LoadingPage";
import {
  getUser,
  createClassroom,
  getClassroom,
  joinClassroom,
  getUserAssignments,
} from "./ApiRequestHandler";
import { useHistory } from "react-router-dom";
import ErrorDisplay from "./ErrorDisplay";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import JoinClass from "./JoinClass";
import CreateClass from "./CreateClass";
import ListItem from "@mui/material/ListItem";
import AssignmentIcon from "@mui/icons-material/Assignment";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Home() {
  const history = useHistory();
  const [hasData, setHasData] = React.useState(false);
  const [classList, setClassList] = React.useState([]);
  const [userType, setUserType] = React.useState(null);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [selected, setSelected] = React.useState(1);
  const [assignments, setAssignments] = React.useState(null);

  const handleStudentConfirm = ({ classCode }) => {
    setHasData(false);
    joinClassroom({
      classCode: classCode,
      token: window.localStorage.getItem("token"),
    })
      .then(function (response) {
        setHasData(true);
        setErrorMessage("");
        setOpenError(false);
        history.push("/signin");
      })
      .catch(function (error) {
        console.log(error);
        setHasData(true);
        setErrorMessage("Class join failed.");
        setOpenError(true);
      });
  };

  const handleTeacherConfirm = ({ classroomName: className, section }) => {
    setHasData(false);
    createClassroom({
      classroomName: className,
      section: section,
      token: window.localStorage.getItem("token"),
    })
      .then(function (response) {
        setHasData(true);
        setErrorMessage("");
        setOpenError(false);
        history.push("/signin");
      })
      .catch(function (error) {
        console.log(error);
        setHasData(true);
        setErrorMessage("Class creation failed.");
        setOpenError(true);
      });
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        setUserType(response.data.user.account_type);
        getClassroom({ token: window.localStorage.getItem("token") })
          .then(function (response) {
            console.log(response);
            setClassList(response.data.classroom);
            setHasData(true);
          })
          .catch(function (error) {
            console.log(error);
            setHasData(true);
            setErrorMessage("Getting classroom from database is failed.");
            setOpenError(true);
          });
      })
      .catch(function (error) {
        console.log(error);
        window.localStorage.removeItem("token");
        history.push("/signin");
      });
  }, []);

  useEffect(() => {
    if (selected === 1) {
      getUser({ token: window.localStorage.getItem("token") })
        .then(function (response) {
          setUserType(response.data.user.account_type);
          getClassroom({ token: window.localStorage.getItem("token") })
            .then(function (response) {
              console.log(response);
              setClassList(response.data.classroom);
              setHasData(true);
            })
            .catch(function (error) {
              console.log(error);
              setHasData(true);
              setErrorMessage("Getting classroom from database is failed.");
              setOpenError(true);
            });
        })
        .catch(function (error) {
          console.log(error);
          window.localStorage.removeItem("token");
          history.push("/signin");
        });
    } else if (selected === 2) {
      getUser({ token: window.localStorage.getItem("token") })
        .then(function (response) {
          setUserType(response.data.user.account_type);
          getUserAssignments({
            token: window.localStorage.getItem("token"),
          })
            .then(function (response) {
              console.log(response);
              setAssignments(response.data.assignments);
              setHasData(true);
            })
            .catch(function (error) {
              console.log(error);
              setHasData(true);
              setErrorMessage("Getting assignments from database is failed.");
              setOpenError(true);
            });
        })
        .catch(function (error) {
          console.log(error);
          window.localStorage.removeItem("token");
          history.push("/signin");
        });
    }
  }, [selected]);

  const closeError = () => {
    setOpenError(false);
  };

  const confirmError = () => {
    setOpenError(false);
  };

  const handleClick = (key) => {
    setSelected(key);
  };

  const getBody = () => {
    switch (selected) {
      case 1:
        return !hasData ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <LoadingPage />
          </Box>
        ) : (
          <Box display="flex" flexWrap="wrap" width="100%" pl={2.5}>
            {classList.length ? (
              classList.map((c, index) => <ClassTile classInfo={c} />)
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                You are not enlisted in any class.
              </Box>
            )}
          </Box>
        );
      case 2:
        return assignments !== null && assignments.length !== 0 ? (
          <Box sx={{
            width:"100%",
          }}>
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
                          primary={
                            "Description: " + assignment.post_description
                          }
                          secondary={
                            <div>
                              <div>
                                {"Class: "}
                                {assignment.name}
                              </div>
                              {assignment.section && (
                                <div>
                                  {"Section: "}
                                  {assignment.section}
                                </div>
                              )}
                              <div>
                                {"Post on: "}
                                {new Date(
                                  assignment.post_date
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
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
        ) : (
          <Box display="flex" p={3} flexDirection="column" alignItems="center">
            No assignments posted yet.
          </Box>
        );
      case 3:
        return !hasData ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <LoadingPage />
          </Box>
        ) : userType === "teacher" ? (
          <CreateClass handleConfirm={handleTeacherConfirm} />
        ) : (
          <JoinClass handleConfirm={handleStudentConfirm} />
        );
      case 4:
        return <Profile />;
      default:
        return;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(openDrawer && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selected === 1
              ? "Classroom"
              : selected === 2
              ? "Assignments"
              : selected === 3
              ? !hasData
                ? "Add Class"
                : userType === "student"
                ? "Join Classroom"
                : "Create Classroom"
              : "Profile"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={openDrawer}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List>
          <ListItemButton
            button
            key={1}
            selected={selected === 1}
            onClick={() => {
              handleClick(1);
            }}
          >
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary={"Classroom"} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            button
            key={2}
            selected={selected === 2}
            onClick={() => {
              handleClick(2);
            }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={"Assignment"} />
          </ListItemButton>
          <Divider />

          <ListItemButton
            button
            key={3}
            selected={selected === 3}
            onClick={() => {
              handleClick(3);
            }}
          >
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                !hasData
                  ? "Add Class"
                  : userType === "student"
                  ? "Join Classroom"
                  : "Create Classroom"
              }
            />
          </ListItemButton>
          <Divider />

          <ListItemButton
            button
            key={4}
            selected={selected === 4}
            onClick={() => {
              handleClick(4);
            }}
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItemButton>
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getBody()}
          <ErrorDisplay
            onClose={closeError}
            open={openError}
            handleConfirm={confirmError}
            message={errorMessage}
          />
        </Box>
      </Box>
    </Box>
  );
}
