const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const moment = require('moment');

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {

  // Datos del usuario conectado
  var username = "";
  var ip = socket.handshake.address;
  var uid = socket.id;

  // Detecta cuando un usuario se desconecta
  socket.on('loginIn', (data) => {
    username = data;
    console.log(`Nuevo usuario conectado bajo el nombre de ${data}`);
  });

  // Detecta cuando envian un mensaje
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${msg} ${moment().format('dddd')}`);
  });

  // Detecta cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`${username} desconecto.`);
  });

});

server.listen(app.get('port'), () => {
  console.log(`Servidor funcionando bajo el puerto ${app.get('port')}`);
});