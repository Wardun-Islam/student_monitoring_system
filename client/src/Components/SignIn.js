import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import InputAdornments from "./CustomPasswordField";
import SimpleDialog from "./AcountTypePopUp";
import GoogleLogin from "react-google-login";
import { useGoogleLogout } from "react-google-login";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  signIn,
  isUser,
  googleRegister,
  googleSignIn,
} from "./ApiRequestHandler";
import signInBackground from "../images/signInBackground.jpg";
import logo from "../images/logo.png";

export default function SignIn() {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [passwordValid, setPasswordValid] = React.useState(true);
  const [formValid, setFormValid] = React.useState(true);
  const [emailValidMessage, setEmailValidMessage] = React.useState("");
  const [passwordValidMessage, setPasswordValidMessage] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("student");
  const [isSignedIn, setSignedIn] = React.useState(false);
  const [errorDisplay, setErrorDisplay] = React.useState("none");
  const [loading, setLoding] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const clientId =
    "1012449316406-tjqn7al8amip1o54og2ircnqh9ed6cch.apps.googleusercontent.com";
  const onLogoutSuccess = (res) => {
    console.log(res);
  };
  const onFailure = (err) => {
    console.log(err);
  };
  const { signOut } = useGoogleLogout({
    onFailure,
    clientId,
    onLogoutSuccess,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirm = (value) => {
    setSelectedValue(value);
    setOpen(false);
    googleRegister({ token: token, account_type: value })
      .then(function (response) {
        console.log(response);
        window.localStorage.setItem("token", response.data.token);
        console.log(window.localStorage.getItem("token"));
        setErrorDisplay("none");
        setLoding(false);
        history.push("/home");
      })
      .catch(function (error) {
        console.log(error);
        setErrorDisplay("block");
        setLoding(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
    if (user) {
      signOut();
      setSignedIn(false);
    }
  };

  const responseGoogle = (response) => {
    console.log("responseGoogle");
    if (response.tokenId) {
      const tokenID = response.tokenId;
      setToken(response.tokenId);
      setSignedIn(true);
      setLoding(true);
      isUser({ token: tokenID })
        .then(function (response) {
          if (response.data.isUser) {
            console.log("google");
            setLoding(false);
            setErrorDisplay("none");
            googleSignIn({ token: token })
              .then(function (response) {
                console.log(response);
                window.localStorage.setItem("token", response.data.token);
                console.log(window.localStorage.getItem("token"));
                setErrorDisplay("none");
                setLoding(false);
                history.push("/home");
              })
              .catch(function (error) {
                console.log(error);
                setLoding(false);
              });
          } else {
            handleClickOpen();
          }
        })
        .catch(function (error) {
          console.log(error);
          setErrorDisplay("block");
          setLoding(false);
        });
    }
  };

  const checkEmail = (email) => {
    setEmailValid(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
    if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      setEmailValidMessage("");
    else setEmailValidMessage("Invalid email!");
  };
  const onEmailChanged = (event) => {
    setEmail(event.target.value);
    checkEmail(event.target.value);
  };

  const checkPassword = (password) => {
    setPasswordValid(
      password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/i)
    );
    if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/i))
      setPasswordValidMessage("");
    else
      setPasswordValidMessage(
        "at least 8 characters must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
  };

  const onPasswordChanged = (event) => {
    setPassword(event.target.value);
    checkPassword(event.target.value);
  };

  const onSubmit = () => {
    checkEmail(email);
    checkPassword(password);
    if (passwordValid && emailValid) {
      setLoding(true);
      signIn({ email: email, password: password })
        .then(function (response) {
          window.localStorage.setItem("token", response.data.token);
          console.log(window.localStorage.getItem("token"));
          setErrorDisplay("none");
          setLoding(false);
          history.push("/home");
        })
        .catch(function (error) {
          console.log(error);
          setErrorDisplay("block");
          setLoding(false);
        });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#6A706E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "80%",
          display: "flex",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "60%",
            backgroundImage: `url(${signInBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: `rgba(0,0,0,0.6)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              p={5}
              align="center"
              color="#F9F9F9"
              sx={{
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              Cameras in classrooms are no substitute for greater authority by
              parents and teachers
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "40%",
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "30%",
              backgroundColor: "white",
            }}
          >
            <img src={logo} alt="logo" height="80%" />
            <Typography
              component="div"
              align="center"
              color="#656565"
              sx={{
                userSelect: "none",
              }}
            >
              Welcome to classroom
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
              height: "45%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              error={!emailValid}
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onEmailChanged}
              helperText={emailValidMessage}
            />
            <InputAdornments
              password={password}
              onPasswordChanged={onPasswordChanged}
              passwordValidMessage={passwordValidMessage}
              passwordValid={passwordValid}
            />
            <SimpleDialog
              open={open}
              onClose={handleClose}
              handleConfirm={handleConfirm}
            />

            <Box display={errorDisplay}>
              <Typography variant="caption" display="block" color="error">
                Invalid email or password.
              </Typography>
            </Box>
            <Box sx={{ paddingTop: 1, width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Sign In
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{
                width: "60px",
                height: "1px",
                backgroundColor: "#656565",
              }}
            ></Box>
            <Typography
              component="div"
              align="center"
              color="#656565"
              sx={{
                userSelect: "none",
                margin: "10px",
              }}
            >
              or
            </Typography>
            <Box
              sx={{
                width: "60px",
                height: "1px",
                backgroundColor: "#656565",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="block">
              <GoogleLogin
                clientId="1012449316406-tjqn7al8amip1o54og2ircnqh9ed6cch.apps.googleusercontent.com"
                buttonText="Sign In with Google"
                onSuccess={responseGoogle}
                isSignedIn={isSignedIn}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              component="div"
              align="center"
              color="#656565"
              sx={{
                userSelect: "none",
                marginRight: "5px",
              }}
            >
              New in Classroom?
            </Typography>
            <Link to="/signup">
              {" "}
              <Typography
                component="div"
                align="center"
                color="#656565"
                sx={{
                  userSelect: "none",
                }}
              >
                Create account
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
