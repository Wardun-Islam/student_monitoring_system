import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function CreateClass(props) {
  const { handleConfirm } = props;
  const [className, setclassName] = React.useState("");
  const [section, setSection] = React.useState(0);
  const [classNameValid, setclassNameValid] = React.useState(true);
  const [classNameValidMessage, setclassNameValidMessage] = React.useState("");
  const [error, setError] = React.useState("none");
  const onClassNameChanged = (event) => {
    setclassName(event.target.value);
    setclassNameValid(event.target.value.match(/^[^-\s][\w\s-]+$/));
    if (event.target.value.match(/^[^-\s][\w\s-]+$/))
      setclassNameValidMessage("");
    else setclassNameValidMessage("Invalid class name");
  };

  const onSectionChanged = (event) => {
    setSection(event.target.value);
  };

  const onConfirm = () => {
    if (className.match(/^[^-\s][\w\s-]+$/)) {
      handleConfirm({ classroomName: className, section: section });
    } else {
      setError("block");
    }
  };

  return (
    <Box display="flex" flexDirection="column" ml={10} mr={10}>
      <TextField
        error={!classNameValid}
        variant="standard"
        margin="normal"
        required
        id="class_name"
        label="Class Name"
        name="class_name"
        autoFocus
        onChange={onClassNameChanged}
        helperText={classNameValidMessage}
      />
      <TextField
        variant="standard"
        margin="normal"
        id="section"
        label="Section"
        name="section"
        onChange={onSectionChanged}
      />
      <Box display={error} mb={1}>
        <Typography variant="caption" display="block" color="error">
          invalid input.
        </Typography>
      </Box>
      <Button onClick={onConfirm} color="primary">
        Create
      </Button>
    </Box>
  );
}

CreateClass.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
};
