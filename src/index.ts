import * as dotenv from "dotenv";
import * as express from "express";
import * as http from "http";
import * as _ from "lodash";
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
const currentConnections = {};
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
  const game = new Boku();
  game.initializeBoard(null);
  currentConnections[socket.id] = { socket: socket };
  const room = prefixRoom(socket.handshake.query.room || 'default')
  socket.join(room);
  if (!io.sockets.adapter.rooms[room]['game'])
    io.sockets.adapter.rooms[room]['game'] = game;

  console.log("1 - an user connected:", socket.handshake.query.room);
  console.log("room", room);

  io.in(room).emit('update');

  let rooms = Object.keys(io.sockets.adapter.rooms)
    .filter(room => room.indexOf('room_') > -1)
    .map(room => room.replace('room_', ''));
  rooms = [...rooms, ...['sala1', 'sala2', 'sala3']]
  rooms = _.uniq(rooms);
  io.emit('rooms', {
    rooms: rooms,
  });
});

function flatten(xs) {
  return xs.reduce((acc, x) => {
    acc = acc.concat(x);
    if (x.items) {
      acc = acc.concat(flatten(x.items));
      x.items = [];
    }
    return acc;
  }, []);
}

// start the Express server
server.listen(port, () => {
  console.log(`server started at http://0.0.0.0:${port}`);
});
