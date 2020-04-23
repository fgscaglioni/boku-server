import * as express from "express";
import * as socketio from "socket.io";
import { Boku } from "../classes/boku.class";

module.exports = (app: express.Application, io: socketio.Server) => {
  const game = new Boku();
  game.initializeBoard(null);


  app.get("/teste", (req, res) => {
    if (!req.query.column || !req.query.line) res.status(400).json({
      error: 'Column and line must be informed'
    })
    res.json({
      requestParams: req.params,
      requestBody: req.body,
      requestQuery: req.query,
      requestUrl: req.url
    });
  });

  app.get("/game_status", (req, res) => {

    let result = {
      player: game.player,
      board: game.board,
      final: game.is_final_state(),
      available_moviments: game.get_available_moves(),
      num_movimentos: game.movements,
      last_move: { column: game.last_column, line: game.last_line }
    }

    res.json(result)
  });

  app.get("/is_my_turn", (req, res) => {
    // console.log(req.query, game.player);
    const player = req.query.player;
    (game.player != player) ? res.json(false) : res.json(true)
  });

  app.get("/player", (req, res) => {
    if (game.ended) {
      res.json(0);
    } else {
      res.json(game.player);
    }
  });

  app.get("/board", (req, res) => {
    res.json(game.board);
  });

  app.get("/final", (req, res) => {
    res.json(game.is_final_state());
  });

  app.get("/available_moviments", (req, res) => {
    res.json(game.get_available_moves());
  });

  app.get("/num_movimentos", (req, res) => {
    res.json(game.movements);
  });

  app.get("/last_move", (req, res) => {
    res.json({ column: game.last_column, line: game.last_line });
  });

  app.get("/restart", (req, res) => {
    game.initializeBoard(null);
    res.json("reiniciado");
  });

  app.get("/move", (req, res) => {
    const room = req.query.room;
    const coluna = Number(req.query.coluna);
    const linha = Number(req.query.linha);
    const player = Number(req.query.player);
    const r = game.make_move(player, coluna, linha);
    io.sockets.in(room).emit('update')
    res.json(r);
  });
};
