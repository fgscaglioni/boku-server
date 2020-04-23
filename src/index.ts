import * as dotenv from "dotenv";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as socketio from "socket.io";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('./routes/web')(app, io);
require('./routes/api')(app, io);

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// socket
io.on("connection", socket => {
  console.log("1 - an user connected:", socket.handshake.query.room);
  const room = socket.handshake.query.room || 'default'
  console.log("room", room);
  socket.join(room);
  io.in(room).emit('update')
  io.emit('rooms', io.sockets.adapter.rooms)
});

// start the Express server
server.listen(port, () => {
  console.log(`server started at http://0.0.0.0:${port}`);
});
