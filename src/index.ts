import * as dotenv from "dotenv";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as socketio from "socket.io";
import { Boku } from "./classes/boku.class";


// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const prefixRoom = (room) => {
  if (!room) return undefined;
  return `room_${room}`;
}

require('./routes/web')(app, io);
require('./routes/api')(app, io, prefixRoom);

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// socket
io.on("connection", socket => {
  console.log('user connected');
  const room = prefixRoom(socket.handshake.query.room || 'default')

  const listRooms = () => {
    let rooms = Object.keys(io.sockets.adapter.rooms)
      .filter(room => room.indexOf('room_') > -1)
      .map(room => room.replace('room_', ''));
    io.emit('rooms', { rooms: rooms });
  }
  listRooms();

  socket.on('create_room', (room) => {
    let roomName = prefixRoom(room.room);

    if (io.sockets.adapter.rooms[roomName]) {
      listRooms();
      socket.emit('room_status', {
        code: 'room_unavailable',
        message: 'This room is already in use'
      })
      return
    }

    let game: Boku = new Boku();

    socket.join(roomName);
    socket.emit('room_status', {
      code: 'room_created',
      message: 'This room was created'
    })

    io.sockets.adapter.rooms[roomName]['game'] = game;
    io.sockets.adapter.rooms[roomName]['players'] = [{
      socket_id: socket.id,
      player: 1
    }];

    io.in(roomName).emit('update');
    socket.emit('player_connected', 1);

    listRooms();
  })

  socket.on('join_room', (room) => {
    if (!room.room) return;
    let roomName = prefixRoom(room.room);
    if (io.sockets.adapter.rooms[roomName]['players'].length == 2) {
      socket.emit('room_status', {
        code: 'room_full',
        message: 'This room already has two players'
      })
      return;
    }

    socket.join(roomName);
    io.in(roomName).emit('update');

    let opponent = io.sockets.adapter.rooms[roomName]['players'][0].player;
    let player = (opponent == 1) ? 2 : 1;
    io.sockets.adapter.rooms[roomName]['players'].push({
      socket_id: socket.id,
      player
    })
    socket.emit('player_connected', player);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    for (const key of Object.keys(io.sockets.adapter.rooms)) {
      let room = io.sockets.adapter.rooms[key];
      if (room['players']) {
        console.log(io.sockets.adapter.rooms[key]['players']);
        const players = room['players']
          .filter(player => player.socket_id != socket.id);
        io.sockets.adapter.rooms[key]['players'] = players;
        console.log(io.sockets.adapter.rooms[key]['players']);
      }
    }
  })

});


// start the Express server
server.listen(port, () => {
  console.log(`server started at http://0.0.0.0:${port}`);
});
