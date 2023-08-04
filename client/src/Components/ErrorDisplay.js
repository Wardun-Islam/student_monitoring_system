import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";


export default function ErrorDisplay(props) {
  const { onClose, open, handleConfirm, message } = props;

  const onConfirm = () => {
    handleConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      titleStyle={{ textAlign: "center" }}
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <Typography align="center">Error!</Typography>
      </DialogTitle>

      <Typography align="center" color="error">
        {message}
      </Typography>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ErrorDisplay.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
