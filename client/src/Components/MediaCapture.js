import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box } from "@mui/system";
import gallary from "../images/gallary.png";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
const styles = (theme) => ({
    input: {
        display: "none",
    },
    image: {
        position: "relative",
        margin: theme.spacing(2, 2, 1),
        textAlign: "center",
        height: 100,
        [theme.breakpoints.down("xs")]: {
            width: "100% !important", // Overrides inline-style
            height: 100,
        },
    },
});
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

class MediaCapture extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state = { fileUploadState: "" };
        this.inputReference = React.createRef();
    }

    fileUploadAction = () => this.inputReference.current.click();

    render() {
        const { classes } = this.props;
        return (
            <Box
                sx={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "red",
                }}
            >
                <Fragment>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-photo"
                        ref={this.inputReference}
                        onChange={this.props.handleImageCapture}
                        type="file"
                    />
                    <label htmlFor="contained-button-photo">
                        <ImageButton
                            focusRipple
                            key={"gallary"}
                            style={{
                                height: "100%",
                                width: "100%",
                            }}
                            onClick={this.fileUploadAction}
                        >
                            <ImageSrc
                                style={{
                                    backgroundImage: `url(${gallary})`,
                                }}
                            />
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
                                        pb: (theme) =>
                                            `calc(${theme.spacing(1)} + 6px)`,
                                    }}
                                >
                                    {"Gallary"}
                                    <ImageMarked className="MuiImageMarked-root" />
                                </Typography>
                            </Image>
                        </ImageButton>
                    </label>
                </Fragment>
            </Box>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MediaCapture);
