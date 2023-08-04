const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const http = require("http");
const socetio = require("socket.io");
const { port } = require("./config");
const indexRouter = require("./Routes/index.router");
const registerRouter = require("./Routes/register.router");
const signInRouter = require("./Routes/signin.router");
const userRouter = require("./Routes/users.router");
const classroomRouter = require("./Routes/classroom.router");
const assignmentsRouter = require("./Routes/assignments.router");
const commentRouter = require("./Routes/comment.router");
const studentRouter = require("./Routes/student.router");
const annotationRouter = require("./Routes/annotation.router");
const app = express();
const server = http.createServer(app);
const { insert_into_table } = require("./Controllers/query.controller");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());
app.use(cors());
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/", registerRouter);
app.use("/", signInRouter);
app.use("/", userRouter);
app.use("/", classroomRouter);
app.use("/", assignmentsRouter);
app.use("/", commentRouter);
app.use("/", studentRouter);
app.use("/", annotationRouter);

const io = socetio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_annotation_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("annotation_changed", (data) => {
    const documentId = JSON.parse(data).documentId;
    const annotationId = JSON.parse(data).annotationId;
    const xfdfString = JSON.parse(data).xfdfString.replace(/\'/g, `''`);
    insert_into_table({
      table_name: "annotations",
      data: {
        documentId: documentId,
        annotationId: annotationId,
        xfdfString: xfdfString,
      },
      returning_column: "documentId",
    }).then((documentId) => {
      if (documentId[0]) {
        console.log(documentId[0]);
        io.sockets.in(documentId[0]).emit("get_annotation_changed", data);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port || 4000, () => {
  console.log("server is running on port: " + port);
});
