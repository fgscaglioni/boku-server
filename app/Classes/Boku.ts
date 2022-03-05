import ForbiddenMoveException from "App/Exceptions/ForbiddenMoveException";
import GameOverException from "App/Exceptions/GameOverException";
import NoSuchColumnException from "App/Exceptions/NoSuchColumnException";
import NoSuchLineInColumnException from "App/Exceptions/NoSuchLineInColumnException";
import NotYourTurnException from "App/Exceptions/NotYourTurnException";
import * as _ from "lodash";

enum GameStatus {
  Ended = 'ended',
  Playing = 'playing'
}

export type BoardType = Array<Array<number>>
export type ForbiddenMovesType = Array<number>
export type CoordinatesType = Array<number> | null


export default class BokuClass {

  board: BoardType = [];
  player: number = 1;
  players = []
  ended: boolean = false;
  waitingRemoval: boolean = false;
  forbiddenMoves: ForbiddenMovesType = [];
  movements: number = 0;
  lastColumn: number = 0;
  lastLine: number = 0;
  // diags1: BoardType = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 10]];
  // diags2: BoardType = [[6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]];
  diags1: BoardType = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9]];
  diags2: BoardType = [[5, 0], [4, 0], [3, 0], [3, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];

  constructor() {
    this.reset()
  }

  reset() {
    this.ended = false;
    this.board = [];
    this.player = 1;
    this.waitingRemoval = false;
    this.forbiddenMoves = [];
    this.movements = 0;
    this.lastColumn = -1;
    this.lastLine = -1;

    let height = 0;
    for (let column = 0; column < 11; column++) {
      if (column <= 5) {
        height = 5 + column;
      } else {
        height = 15 - column;
      }
      this.board.push(_.times(height, _.constant(0)));
    }
  }



  move(player: number, column: number, line: number) {

    let state;

    if (this.ended)
      throw new GameOverException()

    if (player != this.player)
      throw new NotYourTurnException()

    if (column > this.board.length || column < 0)
      throw new NoSuchColumnException()

    if (line < 0 || line > this.board[column].length)
      throw new NoSuchLineInColumnException(column)

    if ([column, line] == this.forbiddenMoves)
      throw new ForbiddenMoveException(column, line)


    if (this.getPosition(column, line) == 0 || this.waitingRemoval) {
      let forbiddenJustSet = false;
      if (this.waitingRemoval) {
        if (this.canRemove(this.player).filter(a1 => _.isEqual(a1, [column, line])).length) {
          // if (_.includes(this.can_remove(this.player), [column, line])) {
          state = 0;
          this.waitingRemoval = false;
          this.forbiddenMoves = [column, line];
          forbiddenJustSet = true;
        } else {
          return [-6, "Invalid removal"];
        }
      } else {
        state = player;
      }
      this.board = this.setPosition(column, line, state);

      if (!forbiddenJustSet) {
        this.forbiddenMoves = [];
      }
    } else {
      throw new ForbiddenMoveException(column, line)
      // return [
      //   -7,
      //   "Position (" + column + "," + line + ") not available (forbidden)"
      // ];
    }

    let f = this.isFinalState();

    if (f != null) {
      this.ended = true;
      console.log({ f });

      return [0, f + " wins"];
    }

    this.lastLine = line;
    this.lastColumn = column;

    // Check for sandwiches
    // possible_states = []

    let removalOptions = this.canRemove(this.player);
    if (removalOptions != null) {
      this.waitingRemoval = true;
      return [2, "must remove"];
      // for option in removal_options:
      //     possible_states.append(this.set_position(option[0],option[1],0))
      // return (player,possible_states)
    } else {
      this.takeTurn();
    }

    this.movements += 1;

    return [1, "ok"];
  }

  getPosition(column: number, line: number) {
    return this.board[column][line];
  }

  setPosition(column: number, line: number, player: number): BoardType {
    let b = _.clone(this.board);
    b[column][line] = player;
    return b;
  }

  // // Get a fixed-size list of neighbors: [top, top-right, top-left, down, down-right, down-left].
  // // null at any of those places where there's no neighbor
  neighbors(column: number, line: number) {
    const minColumn = 0
    const minLine = 0
    const maxColumn = 5
    const boardColumnLen = this.board[column].length - 1
    const boardLen = this.board.length - 1
    let neighbors: Array<CoordinatesType> = [];

    if (line > 0) {
      neighbors.push([column, line]); //up
    } else {
      neighbors.push(null);
    }

    if ((column < maxColumn || line > minLine) && column < boardLen) {
      if (column >= maxColumn) {
        neighbors.push([column + 1, line]); //// upper right
      } else {
        neighbors.push([column + 1, line]); //// upper right
      }
    } else {
      neighbors.push(null);
    }

    if ((column > maxColumn || line > minLine) && column > minColumn) {
      if (column > maxColumn) {
        neighbors.push([column, line]); //// upper left
      } else {
        neighbors.push([column, line]); //// upper left
      }
    } else {
      neighbors.push(null);
    }

    if (line < boardColumnLen) {
      neighbors.push([column, line + 1]); //// down
    } else {
      neighbors.push(null);
    }

    if (
      (column < maxColumn || line < boardColumnLen) &&
      column < boardLen
    ) {
      if (column < maxColumn) {
        neighbors.push([column + 1, line + 1]); // down right
      } else {
        neighbors.push([column + 1, line]); // down right
      }
    } else {
      neighbors.push(null);
    }

    if ((column > maxColumn || line < boardColumnLen) && column > minColumn) {
      if (column > maxColumn) {
        neighbors.push([column, line + 1]); // down left
      } else {
        neighbors.push([column, line]); // down left
      }
    } else {
      neighbors.push(null);
    }

    return neighbors;
  }

  // Check if there's any possible removal (trapped pieces)
  // Returns (player,[positions]), where [positions] is a list of the two possibilities to be removed
  canRemove(player: number) {
    if (this.lastColumn < 0 || this.lastLine < 0) return null;
    let removals: Array<BoardType> = [];
    let l: BoardType = [];
    let s = "";


    //test vertical
    //test upward

    _.range(
      Math.max(this.lastLine - 3, 1),
      this.lastLine + 1
    ).forEach(line => {
      const state = this.board[this.lastColumn][line];
      s += String(state);
    });

    if (
      (s.indexOf("1221") > -1 && this.player == 1) ||
      (s.indexOf("2112") > -1 && this.player == 2)
    ) {
      removals.push([
        [this.lastColumn, this.lastLine],
        [this.lastColumn, this.lastLine - 2]
      ]);
    }

    //test downward
    s = "";
    _.range(
      this.lastLine,
      Math.min(this.lastLine + 3, this.board[this.lastColumn].length) + 1
    ).forEach(line => {
      const state = this.board[this.lastColumn][line];
      s += String(state);
    });

    if (
      (s.indexOf("1221") > -1 && this.player == 1) ||
      (s.indexOf("2112") > -1 && this.player == 2)
    ) {
      removals.push([
        [this.lastColumn, this.lastLine + 1],
        [this.lastColumn, this.lastLine + 2]
      ]);
    }

    let col = this.lastColumn;
    let line = this.lastLine;
    let coords: CoordinatesType = [col, line];

    s = "";
    for (let i = 0; i < 4; i++) {
      let column = coords[0];
      let line = coords[1];
      let state = this.board[column][line];
      l.push([column, line]);
      s += String(state);

      if (s.indexOf("1221") > -1 && this.player == 1) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      if (s.indexOf("2112") > -1 && this.player == 2) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      coords = this.neighbors(column, line)[1];
      if (coords == null) {
        break;
      }
    }

    col = this.lastColumn;
    line = this.lastLine;
    coords = [col, line];

    s = "";
    for (let i = 0; i < 4; i++) {
      let column = coords[0];
      let line = coords[1];
      let state = this.board[column][line];
      l.push([column, line]);
      s += String(state);

      if (s.indexOf("1221") > -1 && this.player == 1) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      if (s.indexOf("2112") > -1 && this.player == 2) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      coords = this.neighbors(column, line)[5];
      if (coords == null) {
        break;
      }
    }

    // test downward diagonals

    col = this.lastColumn;
    line = this.lastLine;
    coords = [col, line];

    s = "";
    for (let i = 0; i < 4; i++) {
      let column = coords[0];
      let line = coords[1];
      let state = this.board[column][line];
      l.push([column, line]);
      s += String(state);

      if (s.indexOf("1221") > -1 && this.player == 1) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      if (s.indexOf("2112") > -1 && this.player == 2) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      coords = this.neighbors(column, line)[2];
      if (coords == null) {
        break;
      }
    }

    col = this.lastColumn;
    line = this.lastLine;
    coords = [col, line];

    s = "";
    for (let i = 0; i < 4; i++) {
      let column = coords[0];
      let line = coords[1];
      let state = this.board[column][line];
      l.push([column, line]);
      s += String(state);

      if (s.indexOf("1221") > -1 && this.player == 1) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      if (s.indexOf("2112") > -1 && this.player == 2) {
        let sub = _.slice(
          l,
          l.length - 3,
          l.length - 1
        );
        removals.push(sub);
      }
      coords = this.neighbors(column, line)[4];
      if (coords == null) {
        break;
      }
    }

    if (removals.length > 0) {
      return _.flatten(removals);
    } else {
      return null;
    }
  }

  // Check if a board is in an end-game state. Returns the winning player or None.
  isFinalState() {
    // test vertical
    for (let column = 0; column < this.board.length; column++) {
      let s = "";
      for (let line = 0; line < this.board[column].length; line++) {
        let state = this.board[column][line];
        s += String(state);
        if (s.indexOf("11111") > -1) return 1;
        if (s.indexOf("22222") > -1) return 2;
      }
    }

    // test upward diagonals
    // diags = [(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    //          (2, 6), (3, 7), (4, 8), (5, 9), (6, 10)]
    for (let i = 0; i < this.diags1.length; i++) {
      let diag = this.diags1[i];

      let s = "";
      let coords: CoordinatesType = [diag[0], diag[1]];

      while (coords != null) {
        let column: number = coords[0];
        let line: number = coords[1];
        let state = this.board[column][line];

        s += String(state);

        if (s.indexOf("11111") > -1) return 1
        if (s.indexOf("22222") > -1) return 2;

        let neighbors = this.neighbors(column, line);
        coords = neighbors[1];
      }
    };

    // test downward diagonals
    // diags = [(6, 1), (5, 1), (4, 1), (3, 1), (2, 1),
    //          (1, 1), (1, 2), (1, 3), (1, 4), (1, 5)]
    // this.diags1.forEach(diag => {
    for (let i = 0; i < this.diags2.length; i++) {
      let diag = this.diags2[i];
      let s = "";
      let coords: CoordinatesType = [diag[0], diag[1]];
      while (coords != null) {
        let column = coords[0];
        let line = coords[1];
        let state = this.board[column][line];
        s += String(state);
        if (s.indexOf("11111") > -1) return 1;
        if (s.indexOf("22222") > -1) return 2;
        coords = this.neighbors(column, line)[4];
      }
    };

    return null;
  }

  // Returns a list of positions available on a board
  getAvailableMoves(): CoordinatesType[] {
    let availableMoves: CoordinatesType[] = [];
    let removalOptions = this.canRemove(this.player);

    if (removalOptions != null) {
      this.waitingRemoval = true;
      return removalOptions;
    } else {
      for (let column = 0; column < this.board.length; column++) {
        for (let line = 0; line < this.board[column].length; line++) {
          if (this.board[column][line] == 0) {
            if ([column, line] != this.forbiddenMoves) {
              availableMoves.push([column, line]);
            }
          }
        }
      }
      return availableMoves;
    }
  }

  getAvailableBoards(): BoardType[] {
    let possibleBoards: BoardType[] = [];
    let availableMoves = this.getAvailableMoves();

    for (let availableMove of availableMoves) {
      const board = this.setPosition(availableMove[0], availableMove[1], this.player)
      possibleBoards.push(board);
    }

    return this.player, possibleBoards;
  }

  takeTurn(): number {
    return (this.player = this.player == 1 ? 2 : 1);
  }



}
