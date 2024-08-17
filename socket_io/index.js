const io = require("socket.io")(4100, {
    cors: {
        origins: ["https://stocotoon.netlify.app/"]
    }
});

io.on("connection", socket => {
    console.log("conectado(a)");
    socket.on("join-room", room => {
        console.log("Bem vindo a sala " + room);
        socket.join(room);
    });
    socket.on("leave-room", room => {
        if(!room) return;
        console.log("Alguém saiu da sala " + room);
        socket.leave(room);
    })
    socket.on("send-message", (message, room) => {
        console.log(`${message.nick}: "${message.content}" enviada para a sala ${room}`);
        socket.to(room).emit("recieve-message", message)
    })
});

console.log("Servidor socket rodando na porta 4100");