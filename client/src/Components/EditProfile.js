import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { getUser, updateProfile } from "./ApiRequestHandler";
import Container from "@material-ui/core/Container";
import CustomizedDialogs from "./PhotoPopUp";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { useHistory } from "react-router-dom";
import TopAppBar from "./AppBar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  image: {
    position: "relative",
    margin: theme.spacing(1, 1, 1),
    textAlign: "center",
    height: 250,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 150,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function EditProfile() {
  const history = useHistory();
  const [firstName, setfirstName] = React.useState("");
  const [firstNameValid, setfirstNameValid] = React.useState(true);
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const [lastName, setlastName] = React.useState("");
  const [lastNameValid, setlastNameValid] = React.useState(true);
  const [lastNameErrorMessage, setlastNameErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [emailValidMessage, setEmailValidMessage] = React.useState("");
  const [image, setImage] = React.useState(undefined);
  const [previewImage, setPreviewImage] = React.useState(undefined);
  const [errorDisplay, setErrorDisplay] = React.useState("none");
  const [loading, setLoding] = React.useState(true);
  const [accountType, setAccountType] = React.useState("");
  const [hasData, setHasData] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorMessageDisplay, setErrorMessageDisplay] = React.useState(false);
  const classes = useStyles();
  const webcamRef = React.useRef(null);

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        console.log(response.data.user.first_name);
        setfirstName(response.data.user.first_name);
        setlastName(response.data.user.last_name);
        setImage(response.data.user.user_image);
        setPreviewImage(response.data.user.user_image);
        setAccountType(response.data.user.account_type);
        setHasData(true);
        setLoding(false);
      })
      .catch(function (error) {
        setLoding(false);
        setHasData(false);
        setErrorMessage("Failed to get user info. Please try again.");
        setErrorMessageDisplay(true);
      });
  }, []);

  const capture = React.useCallback(() => {
    const previewImage = webcamRef.current.getScreenshot();
    setPreviewImage(previewImage);
    setImage(dataURLtoFile(previewImage, Date.now() + ".jpeg"));
    console.log(dataURLtoFile(previewImage, Date.now() + ".jpeg"));
  }, [webcamRef, setPreviewImage]);

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

  const handleCapture = (event) => {
    setImage(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    console.log(event.target.files[0]);
  };

  const onFastNameChanged = (event) => {
    setfirstName(event.target.value);
    setfirstNameValid(event.target.value.match(/^[a-zA-Z ]{2,30}$/));
    if (event.target.value.match(/^[a-zA-Z ]{2,30}$/))
      setfirstNameErrorMessage("");
    else setfirstNameErrorMessage("Invalid name");
  };

  const onLastNameChanged = (event) => {
    setlastName(event.target.value);
    setlastNameValid(event.target.value.match(/^[a-zA-Z ]{2,30}$/));
    if (event.target.value.match(/^[a-zA-Z ]{2,30}$/))
      setlastNameErrorMessage("");
    else setlastNameErrorMessage("Invalid name");
  };

  const removeImage = (event) => {
    setImage(null);
    setPreviewImage(null);
  };

  const onSubmit = () => {
    console.log(accountType);
    if (
      (accountType === "student" && image != null) ||
      accountType === "teacher"
    ) {
      if (firstNameValid && lastNameValid) {
        console.log("vaid for submission");
        setErrorDisplay("none");
        setLoding(false);
        console.log(firstName);
        console.log(lastName);
        console.log(typeof image);
        updateProfile({
          firstName: firstName,
          lastName: lastName,
          accountType: accountType,
          image: image,
          token: window.localStorage.getItem("token"),
        })
          .then(function (response) {
            history.goBack();
          })
          .catch(function (error) {
            setLoding(false);
            setErrorMessage("Failed to update user.");
            setErrorMessageDisplay(true);
            console.log(error);
          });
      } else {
        setErrorDisplay("block");
        console.log("error in field");
        setLoding(false);
      }
    } else {
      setErrorDisplay("block");
      console.log("error in field");
      setLoding(false);
    }
  };

  return (
    <div>
      <TopAppBar title={"Edit Profile"} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {errorMessageDisplay ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            {errorMessage}
          </Box>
        ) : (
          hasData && (
            <div className={classes.paper}>
              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!firstNameValid}
                      onChange={onFastNameChanged}
                      helperText={firstNameErrorMessage}
                      autoComplete="fname"
                      variant="outlined"
                      required
                      fullWidth
                      label="First Name"
                      defaultValue={firstName}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!lastNameValid}
                      onChange={onLastNameChanged}
                      helperText={lastNameErrorMessage}
                      variant="outlined"
                      required
                      fullWidth
                      label="Last Name"
                      autoComplete="lname"
                      defaultValue={lastName}
                    />
                  </Grid>
                  <Grid container justify="center">
                    {previewImage && (
                      <div style={{ position: "relative" }}>
                        <img
                          className={classes.image}
                          src={previewImage}
                          alt="Recent photograph"
                        />
                        {accountType == "teacher" && (
                          <div
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 3,
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              onClick={removeImage}
                            >
                              <ClearIcon style={{ color: "#FF0000" }} />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <CustomizedDialogs
                      handleCapture={handleCapture}
                      webcamRef={webcamRef}
                      capture={capture}
                    />
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onSubmit}
                >
                  Update profile
                </Button>
                <Grid container justify="center">
                  <Box display={errorDisplay} mb={1}>
                    <Typography variant="caption" display="block" color="error">
                      Invalid input.
                    </Typography>
                  </Box>
                </Grid>
              </form>
            </div>
          )
        )}
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </div>
  );
}
