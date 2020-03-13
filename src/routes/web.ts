import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

module.exports = (app: express.Application, io: socketio.Server) => {

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });

  app.get("/fabricio", (req, res) => {
    res.json("fabricio");
  });

};
