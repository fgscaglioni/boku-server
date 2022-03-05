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
| new InvalidRemovalException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InvalidRemovalException extends Exception {
  constructor() {
    super(`Invalid removal`, 400, 'E_INVALID_REMOVAL')
  }
}
