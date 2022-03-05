/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('game_status', 'GamesController.gameStatus')
  Route.get('is_my_turn', 'GamesController.isMyTurn')
  Route.get('player', 'GamesController.player')
  Route.get('board', 'GamesController.board')
  Route.get('final', 'GamesController.final')
  Route.get('available_moviments', 'GamesController.availableMoviments')
  Route.get('num_movimentos', 'GamesController.numMovimentos')
  Route.get('last_move', 'GamesController.lastMove')
  Route.get('restart', 'GamesController.restart')
  Route.get('move', 'GamesController.move')
})

Route.get('/', async () => {
  return { hello: 'world' }
})
