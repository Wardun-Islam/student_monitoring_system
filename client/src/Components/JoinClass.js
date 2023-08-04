import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function JoinClass(props) {
  const { handleConfirm } = props;
  const [classCode, setclassCode] = React.useState("");
  const [classCodeValid, setclassCodeValid] = React.useState(true);
  const [classCodeValidMessage, setclassCodeValidMessage] = React.useState("");
  const [error, setError] = React.useState("none");
  const onClassCodeChanged = (event) => {
    setclassCode(event.target.value);
    setclassCodeValid(
      !(!event.target.value || event.target.value.length === 0)
    );
    if (!event.target.value || event.target.value.length === 0)
      setclassCodeValidMessage("enter class code");
    else setclassCodeValidMessage("");
  };

  const onConfirm = () => {
    if (!(!classCode || classCode === 0)) {
      handleConfirm({ classCode: classCode });
    } else {
      setError("block");
    }
  };

  return (

      <Box display="flex" flexDirection="column" ml={10} mr={10}>
        <TextField
          error={!classCodeValid}
          variant="standard"
          margin="normal"
          required
          id="class_code"
          label="Class Code"
          name="class_code"
          autoFocus
          onChange={onClassCodeChanged}
          helperText={classCodeValidMessage}
        />
        <Box display={error} mb={1}>
          <Typography variant="caption" display="block" color="error">
            invalid input.
          </Typography>
        </Box>
          <Button onClick={onConfirm} color="primary">
            Join
          </Button>
      </Box>
  );
}

JoinClass.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
};
