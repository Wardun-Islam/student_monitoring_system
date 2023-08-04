import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { signUp } from "./ApiRequestHandler";
import InputAdornments from "./CustomPasswordField";
import SimpleSelect from "./CustomSelector";
import CustomizedDialogs from "./PhotoPopUp";
import { useHistory } from "react-router-dom";
import logo from "../images/logo.png";
import { Box } from "@mui/system";


export default function SignUp() {
  const history = useHistory();
  const [firstName, setfirstName] = React.useState("");
  const [firstNameValid, setfirstNameValid] = React.useState(true);
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const [lastName, setlastName] = React.useState("");
  const [lastNameValid, setlastNameValid] = React.useState(true);
  const [lastNameErrorMessage, setlastNameErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [passwordValid, setPasswordValid] = React.useState(true);
  const [passwordValid2, setPasswordValid2] = React.useState(true);
  const [emailValidMessage, setEmailValidMessage] = React.useState("");
  const [passwordValidMessage, setPasswordValidMessage] = React.useState("");
  const [passwordValidMessage2, setPasswordValidMessage2] = React.useState("");
  const [accountType, setAccountType] = React.useState("");
  const [accountError, setAccountError] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [previewImage, setPreviewImage] = React.useState(undefined);
  const [errorDisplay, setErrorDisplay] = React.useState("none");
  const [loading, setLoding] = React.useState(false);

  const webcamRef = React.useRef(null);
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

  const handleSelectChange = (event) => {
    setAccountType(event.target.value);
  };
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

  const onEmailChanged = (event) => {
    setEmail(event.target.value);
    setEmailValid(
      event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    );
    if (event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      setEmailValidMessage("");
    else setEmailValidMessage("Invalid email!");
  };

  const onPasswordChanged = (event) => {
    setPassword(event.target.value);
    setPasswordValid(
      event.target.value.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/i
      )
    );
    if (
      event.target.value.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/i
      )
    )
      setPasswordValidMessage("");
    else
      setPasswordValidMessage(
        "at least 8 characters must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
    if (event.target.value === password2) {
      setPasswordValid2(true);
      setPasswordValidMessage2("");
    } else {
      setPasswordValid2(false);
      setPasswordValidMessage2("password not matched.");
    }
  };

  const onPasswordChanged2 = (event) => {
    setPassword2(event.target.value);
    setPasswordValid2(event.target.value === password);
    if (event.target.value === password) {
      setPasswordValid2(true);
      setPasswordValidMessage2("");
    } else {
      setPasswordValid2(true);
      setPasswordValidMessage2("password not matched.");
    }
  };

  const onSubmit = () => {
    console.log(accountType);
    if (
      (accountType === "student" && image != null) ||
      accountType === "teacher"
    ) {
      if (
        firstNameValid &&
        lastNameValid &&
        emailValid &&
        passwordValid &&
        passwordValid2 &&
        !accountError
      ) {
        console.log(image);
        setLoding(true);
        signUp({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          password2: password2,
          accountType: accountType,
          image: image,
        })
          .then(function (response) {
            window.localStorage.setItem("token", response.data.session.token);
            console.log(window.localStorage.getItem("token"));
            setErrorDisplay("none");
            setLoding(false);
            console.log(response);
            history.push("/home");
          })
          .catch(function (error) {
            console.log(error);
            setErrorDisplay("block");
            setLoding(false);
          });
      } else {
        setErrorDisplay("block");
        console.log("error in field");
      }
    } else {
      setErrorDisplay("block");
      console.log("error in field");
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
          height: "90%",
          display: "flex",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "40%",
            backgroundColor: "#88E0EF",
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
              backgroundColor: `rgba(0,0,0,0.3)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={previewImage ? previewImage : logo}
                alt="logo"
                height="80%"
              />
            </Box>
            <Typography
              variant="h4"
              component="div"
              p={5}
              align="center"
              color="#FFFFFF"
              sx={{
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              Welcome Back!
            </Typography>
            <Typography
              component="div"
              p={5}
              align="center"
              color="#FFFFFF"
              sx={{
                userSelect: "none",
              }}
            >
              To keep connected with classroom please login with your
              information.
            </Typography>
            <Button variant="contained">
              <Link
                to="/signin"
                style={{ textDecoration: "none", color: "white" }}
              >
                Sign in
              </Link>
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "60%",
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Box sx={{ p: 1 }}>
              {" "}
              <Typography
                variant="h4"
                component="div"
                align="center"
                color="#5F9CA7"
                sx={{
                  userSelect: "none",
                }}
              >
                Create Account
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ p: 1 }}>
                <TextField
                  error={!firstNameValid}
                  onChange={onFastNameChanged}
                  helperText={firstNameErrorMessage}
                  autoComplete="fname"
                  name="firstName"
                  variant="standard"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Box>

              <Box sx={{ p: 1 }}>
                <TextField
                  error={!lastNameValid}
                  onChange={onLastNameChanged}
                  helperText={lastNameErrorMessage}
                  variant="standard"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <TextField
                error={!emailValid}
                onChange={onEmailChanged}
                helperText={emailValidMessage}
                variant="standard"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Box>

            <Box sx={{ p: 1 }}>
              <InputAdornments
                password={password}
                onPasswordChanged={onPasswordChanged}
                passwordValidMessage={passwordValidMessage}
                passwordValid={passwordValid}
              />
            </Box>

            <Box sx={{ p: 1 }}>
              <InputAdornments
                password={password2}
                onPasswordChanged={onPasswordChanged2}
                passwordValidMessage={passwordValidMessage2}
                passwordValid={passwordValid2}
              />
            </Box>

            <Box sx={{ p: 1 }}>
              <SimpleSelect
                handleSelectChange={handleSelectChange}
                accountType={accountType}
                accountError={accountError}
              />
            </Box>
            <Box sx={{ p: 1 }}>
              <CustomizedDialogs
                handleCapture={handleCapture}
                webcamRef={webcamRef}
                capture={capture}
              />
            </Box>

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Sign Up
              </Button>
            </Box>

            <Box sx={{ p: 1 }}>
              <Box display={errorDisplay} mb={1}>
                <Typography variant="caption" display="block" color="error">
                  Invalid input.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
