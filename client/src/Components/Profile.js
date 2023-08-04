import React, { useEffect } from "react";
import profileImage from "../images/profile_image.png";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LoadingPage from "./LoadingPage";
import { useHistory } from "react-router-dom";
import { getUser, updateProfile } from "./ApiRequestHandler";
import CustomizedDialogs from "./PhotoPopUp";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TextField from "@mui/material/TextField";

function Profile() {
  const [user, setUser] = React.useState(null);
  const [editProfile, setEditProfile] = React.useState(false);
  const [hasUser, setHasUser] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [imageDeleted, setImageDeleted] = React.useState(false);
  const history = useHistory();
  const [firstName, setfirstName] = React.useState("");
  const [firstNameValid, setfirstNameValid] = React.useState(true);
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const [lastName, setlastName] = React.useState("");
  const [lastNameValid, setlastNameValid] = React.useState(true);
  const [lastNameErrorMessage, setlastNameErrorMessage] = React.useState("");
  const [image, setImage] = React.useState(undefined);
  const [previewImage, setPreviewImage] = React.useState(undefined);
  const [errorDisplay, setErrorDisplay] = React.useState("none");
  const [loading, setLoding] = React.useState(true);
  const [accountType, setAccountType] = React.useState("");
  const [hasData, setHasData] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorMessageDisplay, setErrorMessageDisplay] = React.useState(false);
  const webcamRef = React.useRef(null);

  const textRef = React.useRef(null);
  const textRef2 = React.useRef(null);
  const capture = React.useCallback(() => {
    const previewImage = webcamRef.current.getScreenshot();
    setPreviewImage(previewImage);
    setImage(dataURLtoFile(previewImage, Date.now() + ".jpeg"));
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
    setImageDeleted(true);
  };

  const onSubmit = () => {
    setImageDeleted(false);
    setLoding(true);
    if (
      (user.account_type === "student" && image != null) ||
      user.account_type === "teacher"
    ) {
      console.log("image", image);
      if (firstNameValid && lastNameValid) {
        console.log("vaid for submission");
        setErrorDisplay("none");
        updateProfile({
          firstName: firstName,
          lastName: lastName,
          accountType: accountType,
          image: image,
          token: window.localStorage.getItem("token"),
        })
          .then(function (response) {
            getUser({ token: window.localStorage.getItem("token") })
              .then(function (response) {
                setUser(response.data.user);
                setHasUser(true);
                setfirstName(response.data.user.first_name);
                setlastName(response.data.user.last_name);
                setImage(response.data.user.user_image);
                setPreviewImage(response.data.user.user_image);
                setAccountType(response.data.user.account_type);
                setHasData(true);
                setLoding(false);
              })
              .catch(function (error) {
                setHasUser(false);
                setHasError(true);
              });
            setEditProfile(false);
            setLoding(false);
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

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        console.log(response.data.user);
        setUser(response.data.user);
        setHasUser(true);
        setfirstName(response.data.user.first_name);
        setlastName(response.data.user.last_name);
        setImage(response.data.user.user_image);
        setPreviewImage(response.data.user.user_image);
        setAccountType(response.data.user.account_type);
        setHasData(true);
        setLoding(false);
      })
      .catch(function (error) {
        setHasUser(false);
        setHasError(true);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        console.log(response.data.user);
        setUser(response.data.user);
        setHasUser(true);
        setfirstName(response.data.user.first_name);
        setlastName(response.data.user.last_name);
        setImage(response.data.user.user_image);
        setPreviewImage(response.data.user.user_image);
        setAccountType(response.data.user.account_type);
        setHasData(true);
        setLoding(false);
      })
      .catch(function (error) {
        setHasUser(false);
        setHasError(true);
        console.log(error);
      });
  }, [editProfile]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {hasUser ? (
        <Box
          sx={{
            display: "flex",
            padding: 3,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              padding: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Avatar
                alt={user.first_name}
                src={
                  editProfile
                    ? imageDeleted
                      ? previewImage
                      : previewImage
                      ? previewImage
                      : user.user_image
                    : user.user_image
                    ? user.user_image
                    : profileImage
                }
                sx={{ width: 240, height: 240, margin: 3 }}
              />
              {editProfile &&
                user.account_type === "teacher" &&
                !imageDeleted &&
                user.user_image !== null && (
                  <IconButton aria-label="delete" onClick={removeImage}>
                    <HighlightOffIcon />
                  </IconButton>
                )}
            </Box>

            {editProfile ? (
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <CustomizedDialogs
                  handleCapture={handleCapture}
                  webcamRef={webcamRef}
                  capture={capture}
                />
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={() => {
                  window.localStorage.removeItem("token");
                  history.push("/signin");
                }}
              >
                Sign Out
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: "5px",
            }}
          >
            <Box p={1}>
              <Box textAlign="left" p={2} color="#11052C" bgcolor="#F3F1F5">
                <TextField
                  error={!firstNameValid}
                  onChange={onFastNameChanged}
                  helperText={firstNameErrorMessage}
                  disabled={!editProfile}
                  autoComplete="fname"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  defaultValue={user.first_name}
                  inputProps={{ ref: textRef }}
                  autoFocus
                />
              </Box>
            </Box>
            <Box p={1}>
              <Box textAlign="left" p={2} color="#11052C" bgcolor="#F3F1F5">
                <TextField
                  error={!lastNameValid}
                  onChange={onLastNameChanged}
                  helperText={lastNameErrorMessage}
                  variant="outlined"
                  disabled={!editProfile}
                  required
                  fullWidth
                  label="Last Name"
                  autoComplete="lname"
                  defaultValue={user.last_name}
                  inputProps={{ ref: textRef2 }}
                  autoFocus
                />
              </Box>
            </Box>

            <Box p={1}>
              <Box textAlign="left" p={2} color="#11052C" bgcolor="#F3F1F5">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  disabled
                  defaultValue={user.email}
                />
              </Box>
            </Box>
            <Box p={1}>
              <Box textAlign="left" p={2} color="#11052C" bgcolor="#F3F1F5">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Account Type"
                  disabled
                  defaultValue={user.account_type}
                />
              </Box>
            </Box>
            <Box p={1}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={() => {
                  if (editProfile) {
                    onSubmit();
                  } else {
                    setEditProfile(true);
                  }
                }}
              >
                {editProfile ? "Update" : "Edit Profile"}
              </Button>
            </Box>
            {editProfile && (
              <Box p={1}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  onClick={() => {
                    textRef.current.value = user.first_name;
                    textRef2.current.value = user.last_name;
                    setImage(user.user_image);
                    setPreviewImage(user.user_image);
                    setfirstNameValid(true);
                    setfirstNameErrorMessage("");
                    setlastNameValid(true);
                    setlastNameErrorMessage("");
                    setImageDeleted(false);
                    setEditProfile(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ) : hasError ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          Failed to get user info. Please try again.
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <LoadingPage />
        </Box>
      )}
    </Box>
  );
}

export default Profile;
