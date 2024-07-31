const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

const { joinRoom, sendMessage } = require("./socket_io/socket");

const cors = require("cors");
const db = require("./db");

// routes
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const memberRoutes = require("./routes/memberRoutes");
const storyRoutes = require("./routes/storyRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const pageRoutes = require("./routes/pageRoutes");
const pictureRoutes = require("./routes/pictureRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// middleware
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(cors());

// config routes
app.use("/user", userRoutes);
app.use("/team", teamRoutes);
app.use("/member", memberRoutes);
app.use("/story", storyRoutes);
app.use("/chapter", chapterRoutes);
app.use("/page", pageRoutes);
app.use("/picture", pictureRoutes);
app.use("/script", scriptRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

io.on("connection", (req, res) => {
    console.log("Conected")
});

db
    //.sync({force: true})
    .sync()
    .then(() => {
        server.listen(4000);
    })
    .catch((error) => {
        console.log(error);
    })
