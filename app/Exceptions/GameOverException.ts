import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new GameOverException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class GameOverException extends Exception {
  constructor() {
    super("Game is over", 400, 'E_GAME_OVER')
  }
}
