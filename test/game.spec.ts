import BokuClass from 'App/Classes/Boku'
import test from 'japa'
test.group('Boku game', (group) => {

  let game: BokuClass

  group.beforeEach(() => {
    game = new BokuClass()
  })

  test('should start game', (assert) => {
    assert.equal(game.ended, false)
  })

  test('should set position', (assert) => {
    const [player, column, line] = [1, 0, 0]
    game.setPosition(column, line, player)
    assert.equal(game.board[0][0], 1)
  })

  test('should get position', (assert) => {
    const [player, column, line] = [1, 0, 0]
    game.board[column][line] = player
    assert.equal(game.getPosition(column, line), 1)
  })

  // test('should get neighbors', (assert) => {
  //   const [player, column, line] = [1, 0, 0]
  //   game.board[column][line] = player
  //   // assert.equal(game.getPosition(column, line), 1)
  //   const neighbors = game.neighbors(column, line)
  //   console.log({ neighbors });
  // })

  test('should make a move', (assert) => {
    const board = [
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    const [player, column, line] = [1, 0, 0]
    game.move(player, column, line)
    assert.deepEqual(game.board, board)
  })

  test('should trow error E_NOT_YOUR_TURN', (assert) => {
    const board = [
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    const [player, column, line] = [1, 0, 0]
    game.move(player, column, line)
    assert.deepEqual(game.board, board)
    try {
      game.move(player, 1, 1)
    } catch (error) {
      assert.equal(error.code, "E_NOT_YOUR_TURN")
    }
  })

  test('should trow error E_FORBIDDEN_MOVE', (assert) => {
    const board = [
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    const [player, column, line] = [1, 0, 0]
    game.move(player, column, line)
    assert.deepEqual(game.board, board)
    try {
      game.move(2, column, line)
    } catch (error) {
      assert.equal(error.code, "E_FORBIDDEN_MOVE")
    }
  })

  test('should change the player', (assert) => {
    assert.equal(game.player, 1)
    game.takeTurn()
    assert.equal(game.player, 2)
  })


  test('should game be winned by player 1', (assert) => {
    game.move(1, 0, 0)
    game.move(2, 5, 5)

    game.move(1, 0, 1)
    game.move(2, 5, 6)

    game.move(1, 0, 2)
    game.move(2, 5, 7)

    game.move(1, 0, 3)
    game.move(2, 5, 8)

    game.move(1, 0, 4)
    assert.equal(game.ended, true)

  })



})
