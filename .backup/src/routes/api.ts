import * as express from "express";
import * as socketio from "socket.io";
import { Boku } from "../classes/boku.class";

module.exports = (app: express.Application, io: socketio.Server, prefixRoom) => {
  const game = new Boku();

  app.use(function (req, res, next) {
    req.query.room = prefixRoom(req.query.room)
    next();
  });

  app.get("/game_status", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];

    res.json({
      player: game.player,
      board: game.board,
      final: game.is_final_state(),
      available_moviments: game.get_available_moves(),
      num_movimentos: game.movements,
      last_move: { column: game.last_column, line: game.last_line }
    })
  });

  app.get("/is_my_turn", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    const player = req.query.player;
    (game.player != player) ? res.json(false) : res.json(true)
  });

  app.get("/player", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    if (game.ended) {
      res.json(0);
    } else {
      res.json(game.player);
    }
  });

  app.get("/board", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    res.json(game.board);
  });

  app.get("/final", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    res.json(game.is_final_state());
  });

  app.get("/available_moviments", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    res.json(game.get_available_moves());
  });

  app.get("/num_movimentos", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    res.json(game.movements);
  });

  app.get("/last_move", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    res.json({ column: game.last_column, line: game.last_line });
  });

  app.get("/restart", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    game.restartGame();
    io.sockets.in(req.query.room).emit('update')
    res.json("reiniciado");
  });

  app.get("/move", (req, res) => {
    const game = <Boku>io.sockets.adapter.rooms[req.query.room]['game'];
    const room = req.query.room;
    const coluna = Number(req.query.coluna);
    const linha = Number(req.query.linha);
    const player = Number(req.query.player);
    const r = game.make_move(player, coluna, linha);
    io.sockets.in(room).emit('update')
    res.json(r);
  });
};
