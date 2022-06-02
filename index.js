const httpServer = require("http").createServer();

let msj = [];
let users = [];

let server = httpServer.listen(process.env.PORT || 3001, () => {
  console.log("escuchando 3001");
});
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  console.log("usuario conectado", socket.id);
  socket.emit("txtUsers", msj);
  socket.emit("listUsers", users);

  //ENVIAR TEXTO
  socket.on("sendText", (text) => {
    console.log("12", msj);
    msj.push({ id: text?.id, text: text?.text });
    io.emit("txtUsers", msj);

    if (msj.length > 200) {
      msj = [{ id: "Admin", text: "no bd maximas row" }];
    }
    let busqueda = users.filter((list) => list.id == text.id);
    if (busqueda == false) {
      users.push({ id: text?.id });
      console.log(users);
      io.emit("listUsers", users);
    }
  });

  socket.on("disconnect", (text) => {
    console.log("usuario desconectado");
    let busqueda = users.filter((list) => list.id == text.id);
    console.log("asd", busqueda);
    console.log(text.id);
  });
});
