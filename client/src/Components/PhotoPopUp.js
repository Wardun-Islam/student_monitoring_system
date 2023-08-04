import React from "react";
import Button from "@mui/material/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Box } from "@mui/system";
import MediaCapture from "./MediaCapture";
import Webcam from "react-webcam";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import camera from "../images/camera.jpg";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

export default function CustomizedDialogs(props) {
  const [webCapture, setWebCapture] = React.useState(false);
  const [display, setDisplay] = React.useState("none");

  const handleImageCapture = (e) => {
    setDisplay("none");
    props.handleCapture(e);
  };

  const handleWebCameraCapture = (e) => {
    setWebCapture(true);
  };

  const captureImage = (e) => {
    setDisplay("none");
    setWebCapture(false);
    props.capture(e);
  };

  const handleClickOpen = () => {
    setDisplay("block");
  };

  const handleClickAway = () => {
    if (webCapture) {
      setWebCapture(false);
    }
    setDisplay("none");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          fullWidth={true}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<PhotoCamera />}
        >
          Select Photo
        </Button>
      </Box>
      <Box
        sx={{
          display: { display } /* Hidden by default */,
          position: "fixed" /* Stay in place */,
          zIndex: "1000" /* Sit on top */,
          left: "0",
          top: "0",
          width: "100%" /* Full width */,
          height: "100%" /* Full height */,
          overflow: "hidden" /* Enable scroll if needed */,
          backgroundColor: `rgba(0,0,0,0.3)`,
          paddingTop: "50px",
        }}
      >
        {webCapture ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                padding: "20px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fefefe",
                margin: `5% auto 15% auto` /* 5% from the top, 15% from the bottom and centered */,
                border: `1px solid #888`,
                width:
                  "80%" /* Could be more or less, depending on screen size */,
              }}
            >
              <Box display="flex" flexDirection="column">
                <Webcam
                  audio={false}
                  ref={props.webcamRef}
                  screenshotFormat="image/jpeg"
                />

                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={captureImage}
                >
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fefefe",
                margin: `5% auto 15% auto` /* 5% from the top, 15% from the bottom and centered */,
                border: `1px solid #888`,
                width:
                  "80%" /* Could be more or less, depending on screen size */,
              }}
            >
              <Box
                m={2}
                sx={{
                  padding: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: "40%",
                    padding: "5px",
                  }}
                >
                  <MediaCapture handleImageCapture={handleImageCapture} />
                </Box>
                <ImageButton
                  onClick={handleWebCameraCapture}
                  focusRipple
                  key={"Camera"}
                  style={{
                    width: "40%",
                    padding: "5px",
                  }}
                >
                  <ImageSrc style={{ backgroundImage: `url(${camera})` }} />
                  <ImageBackdrop className="MuiImageBackdrop-root" />
                  <Image>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="inherit"
                      sx={{
                        position: "relative",
                        p: 4,
                        pt: 2,
                        pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                      }}
                    >
                      {"Camera"}
                      <ImageMarked className="MuiImageMarked-root" />
                    </Typography>
                  </Image>
                </ImageButton>
              </Box>
              <Box sx={{
                alignSelf:"flex-start",
                justifySelf:"flex-end",
              }}>
                <IconButton
                  onClick={() => {
                    handleClickAway();
                  }}
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
