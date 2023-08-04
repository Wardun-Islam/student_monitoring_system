import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import TopAppBar from "./AppBar";
import LoadingPage from "./LoadingPage";
import ErrorDisplay from "./ErrorDisplay";
import { getUser, postAssignment } from "./ApiRequestHandler";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";

export default function PostAssignment() {
  const history = useHistory();
  const { class_id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [postDecription, setPostDecription] = React.useState(null);
  const [inputError, setInputError] = React.useState(false);
  const [pdf, setPdf] = React.useState(null);

  useEffect(() => {
    getUser({ token: window.localStorage.getItem("token") })
      .then(function (response) {
        if (response.data.user.account_type === "teacher") setLoading(false);
      })
      .catch(function (error) {
        window.localStorage.removeItem("token");
        history.push("/signin");
      });
  }, []);

  const onPostDecriptionChange = (event) => {
    setPostDecription(event.target.value);
    if (pdf && event.target.value) setInputError(false);
  };

  const handlePdfCloseClick = () => {
    setPdf(null);
  };

  const onFileChange = (e) => {
    const files = e.target.files;
    files && files.length > 0 && setPdf(files[0]);
    if (files && files.length && postDecription) setInputError(false);
  };

  const onPostClicked = () => {
    setLoading(true);
    if (pdf && postDecription) {
      console.log(postDecription, pdf, class_id.split(":")[1]);
      postAssignment({
        postDescription: postDecription,
        pdf: pdf,
        class_id: class_id.split(":")[1],
        token: window.localStorage.getItem("token"),
      })
        .then(function (response) {
          history.goBack();
        })
        .catch(function (error) {
          setLoading(false);
          setPdf(null);
          setPostDecription(null);
          setErrorMessage("Assignment post failed.");
          setOpenError(true);
        });
    } else {
      setInputError(true);
      setLoading(false);
    }
  };

  const closeError = () => {
    setOpenError(false);
  };

  const confirmError = () => {
    setOpenError(false);
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopAppBar title={"Post Assignments"} button={false} />
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
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 3,
            marginTop: 10,
          }}
        >
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {/* post description field */}
            <TextField
              fullWidth
              label="Announce a new class Assignment"
              multiline
              rows={5}
              variant="standard"
              onChange={onPostDecriptionChange}
            />
            {/* pdf box */}
            {pdf && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  padding: 1,
                  marginTop: 1,
                  border: 2,
                  borderColor: "primary.dark",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                  }}
                >
                  <PictureAsPdfIcon />
                  <Typography pl={1}>{pdf.name}</Typography>
                </Box>
                <Box alignSelf="flex-end">
                  <IconButton
                    onClick={handlePdfCloseClick}
                    size="small"
                    style={{
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
            {/* error */}
            {inputError && (
              <Typography
                variant="caption"
                display="block"
                color="error"
                style={{
                  padding: "3px 0px 0px 0px",
                  textAlign: "center",
                  margin: "0px",
                }}
              >
                Invalid input.
              </Typography>
            )}

            <Box
              sx={{
                paddingTop: 1,
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="contained-button-file">
                <Input
                  accept=".pdf"
                  id="contained-button-file"
                  type="file"
                  onChange={onFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadFileIcon />}
                >
                  Attach PDF
                </Button>
              </label>

              <Button
                onClick={onPostClicked}
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
              >
                POST
              </Button>
            </Box>
          </Box>
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
