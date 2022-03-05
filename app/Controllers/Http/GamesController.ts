// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BokuClass from "App/Classes/Boku";

export default class GamesController {

  game: BokuClass
  constructor() {
    this.game = new BokuClass();
  }

  getResponse() {
    return {
      player: this.game.player,
      board: this.game.board,
      final: this.game.isFinalState(),
      available_moviments: this.game.getAvailableMoves(),
      num_movimentos: this.game.movements,
      last_move: { column: this.game.lastColumn, line: this.game.lastLine }
    }
  }

  async gameStatus({ response }: HttpContextContract) {
    response.json(this.getResponse())
  }
  async isMyTurn({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async player({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async board({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async final({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async availableMoviments({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async numMovimentos({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async lastMove({ response }: HttpContextContract) {
    response.notImplemented()
  }
  async restart({ response }: HttpContextContract) {
    this.game.reset()
    response.json(this.getResponse())
  }
  async move({ request, response }: HttpContextContract) {
    const { line, column, player } = request.only(['line', 'column', 'player'])
    this.game.move(Number(player), Number(column), Number(line))
    response.json(this.getResponse())
  }

}
