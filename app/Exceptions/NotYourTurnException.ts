import { Exception } from '@adonisjs/core/build/standalone';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NotYourTurnException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotYourTurnException extends Exception {
  constructor() {
    super("Not your turn", 400, 'E_NOT_YOUR_TURN')
  }
}
