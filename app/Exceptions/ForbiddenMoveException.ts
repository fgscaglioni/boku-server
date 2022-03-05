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
| new ForbiddenMoveException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ForbiddenMoveException extends Exception {
  constructor(column: number, line: number) {
    super(`Position (${column},${line}) not available`, 400, 'E_FORBIDDEN_MOVE')
  }
}
