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
| new NoSuchLineInColumnException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoSuchLineInColumnException extends Exception {
  constructor(column: number) {
    super(`No such line in column ${column}`, 400, 'E_NO_SUCH_LINE_IN_COLUMN')
  }
}
