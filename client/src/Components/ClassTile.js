import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import p1 from "../images/p1.jpg";
import { useHistory } from "react-router-dom";

export default function ClassTile({ classInfo }) {
  const history = useHistory();

  return (
    <Card
      sx={{ maxWidth: 345, margin: 2 }}
      onClick={() => {
        history.push("/class:" + classInfo.class_room_id);
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="80"
          image={p1}
          alt="class background"
        />
        <CardContent style={{ backgroundColor: "#A2D2FF" }}>
          <Typography gutterBottom variant="h5" component="h2">
            {classInfo.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Class Code: {classInfo.class_room_id}
          </Typography>
          {classInfo.section ? (
            <Typography variant="body2" color="textSecondary" component="p">
              Section: {" "} {classInfo.section}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
             {"."}{ classInfo.section}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
