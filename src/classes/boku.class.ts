const _ = require("lodash");

export class Boku {
    private board: Board = [];
    private player: number = 1;
    private ended: boolean = false;
    private waiting_removal: boolean = false;
    private forbidden_moves: any = null;
    private movements: number = 0;
    private last_column: number = 0;
    private last_line: number = 0;
    private diags1: Board = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 6], [3, 7], [4, 8], [5, 9], [6, 10]
    ];
    private diags2: Board = [
        [6, 1], [5, 1], [4, 1], [3, 1], [2, 1],
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]
    ];

    constructor(params?: any) {
        this.reset()
    }

    getBoard() {
        return this.board
    }
    printBoard() {
        console.table(this.board)
    }

    reset() {
        this.ended = false;
        this.board = [];
        this.player = 1;
        this.waiting_removal = false;
        this.forbidden_moves = null;
        this.movements = 0;
        this.last_column = -1;
        this.last_line = -1;

        let height = 0;
        for (let column = 0; column < 11; column++) {
            if (column <= 5) {
                height = 5 + column;
            } else {
                height = 15 - column;
            }
            this.board.push(new Array(height).fill(0));
        }
    }

    private getPosition(column: number, line: number) {
        return this.board[column - 1][line - 1];
    }

    private setPosition({ player: state, column, line }: Move) {
        // let b = _.clone(this.board);
        // let b = Object.assign({}, this.board);
        // b[column - 1][line - 1] = state;
        // return b;
        this.board[column - 1][line - 1] = Number(state)
        return this.board
    }

    // // Put a piece on a board. State is the player (or 0 to remove a piece)
    // place_piece(column: number, line: number, state: number) {
    //     this.board = this.set_position(column, line, state);
    // }

    // // Get a fixed-size list of neighbors: [top, top-right, top-left, down, down-right, down-left].
    // // null at any of those places where there's no neighbor
    neighbors(column: number, line: number) {
        let l = [];

        if (line > 1) {
            l.push([column, line - 1]); //up
        } else {
            l.push(null);
        }

        if ((column < 6 || line > 1) && column < this.board.length) {
            if (column >= 6) {
                l.push([column + 1, line - 1]); //// upper right
            } else {
                l.push([column + 1, line]); //// upper right
            }
        } else {
            l.push(null);
        }

        if ((column > 6 || line > 1) && column > 1) {
            if (column > 6) {
                l.push([column - 1, line]); //// upper left
            } else {
                l.push([column - 1, line - 1]); //// upper left
            }
        } else {
            l.push(null);
        }

        if (line < this.board[column - 1].length) {
            l.push([column, line + 1]); //// down
        } else {
            l.push(null);
        }

        if (
            (column < 6 || line < this.board[column - 1].length) &&
            column < this.board.length
        ) {
            if (column < 6) {
                l.push([column + 1, line + 1]); // down right
            } else {
                l.push([column + 1, line]); // down right
            }
        } else {
            l.push(null);
        }

        if ((column > 6 || line < this.board[column - 1].length) && column > 1) {
            if (column > 6) {
                l.push([column - 1, line + 1]); // down left
            } else {
                l.push([column - 1, line]); // down left
            }
        } else {
            l.push(null);
        }

        return l;
    }

    // Check if there's any possible removal (trapped pieces)
    // Returns (player,[positions]), where [positions] is a list of the two possibilities to be removed
    can_remove(player: number) {
        if (this.last_column < 0 || this.last_line < 0) return null;
        let removals = [];
        let l = [];
        let s = "";


        //test vertical
        //test upward

        _.range(
            Math.max(this.last_line - 3, 1),
            this.last_line + 1
        ).forEach((line: any) => {
            const state = this.board[this.last_column - 1][line - 1];
            s += String(state);
        });

        if (
            (s.indexOf("1221") > -1 && this.player == 1) ||
            (s.indexOf("2112") > -1 && this.player == 2)
        ) {
            removals.push([
                [this.last_column, this.last_line - 1],
                [this.last_column, this.last_line - 2]
            ]);
        }

        //test downward
        s = "";
        _.range(
            this.last_line,
            Math.min(this.last_line + 3, this.board[this.last_column - 1].length) + 1
        ).forEach((line: any) => {
            const state = this.board[this.last_column - 1][line - 1];
            s += String(state);
        });

        if (
            (s.indexOf("1221") > -1 && this.player == 1) ||
            (s.indexOf("2112") > -1 && this.player == 2)
        ) {
            removals.push([
                [this.last_column, this.last_line + 1],
                [this.last_column, this.last_line + 2]
            ]);
        }

        let col = this.last_column;
        let line = this.last_line;
        let coords: any = [col, line];

        s = "";
        for (let i = 0; i < 4; i++) {
            let column = coords[0];
            let line = coords[1];
            let state = this.board[column - 1][line - 1];
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

        col = this.last_column;
        line = this.last_line;
        coords = [col, line];

        s = "";
        for (let i = 0; i < 4; i++) {
            let column = coords[0];
            let line = coords[1];
            let state = this.board[column - 1][line - 1];
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

        col = this.last_column;
        line = this.last_line;
        coords = [col, line];

        s = "";
        for (let i = 0; i < 4; i++) {
            let column = coords[0];
            let line = coords[1];
            let state = this.board[column - 1][line - 1];
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

        col = this.last_column;
        line = this.last_line;
        coords = [col, line];

        s = "";
        for (let i = 0; i < 4; i++) {
            let column = coords[0];
            let line = coords[1];
            let state = this.board[column - 1][line - 1];
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
    is_final_state() {

        // test vertical
        for (let column = 0; column < this.board.length; column++) {
            let status = ''
            for (let line = 0; line < this.board[column].length; line++) {
                status += String(this.board[column][line])

                if (status.indexOf("11111") > -1) return 1;
                if (status.indexOf("22222") > -1) return 2;
            }
        }

        // test upward diagonals
        // diags = [(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
        //          (2, 6), (3, 7), (4, 8), (5, 9), (6, 10)]
        for (let i = 0; i < this.diags1.length; i++) {
            let diag = this.diags1[i];
            let s = "";
            let coords: any = [diag[0], diag[1]];
            while (coords != null) {
                let column = coords[0];
                let line = coords[1];
                let state = this.board[column - 1][line - 1];
                s += String(state);
                if (s.indexOf("11111") > -1) return 1
                if (s.indexOf("22222") > -1) return 2;
                let neighbor = this.neighbors(column, line);
                coords = neighbor[1];
            }
        };

        // test downward diagonals
        // diags = [(6, 1), (5, 1), (4, 1), (3, 1), (2, 1),
        //          (1, 1), (1, 2), (1, 3), (1, 4), (1, 5)]
        // this.diags1.forEach(diag => {
        for (let i = 0; i < this.diags2.length; i++) {
            let diag = this.diags2[i];
            let s = "";
            let coords: any = [diag[0], diag[1]];
            while (coords != null) {
                let column = coords[0];
                let line = coords[1];
                let state = this.board[column - 1][line - 1];
                s += String(state);
                if (s.indexOf("11111") > -1) return 1;
                if (s.indexOf("22222") > -1) return 2;
                coords = this.neighbors(column, line)[4];
            }
        };

        return null;
    }

    // Returns a list of positions available on a board
    getAvailableMoves() {
        let l = [];
        let removal_options = this.can_remove(this.player);

        if (removal_options != null) {
            this.waiting_removal = true;
            return removal_options;
        } else {
            for (let column = 0; column < this.board.length; column++) {
                for (let line = 0; line < this.board[column].length; line++) {
                    if (this.board[column][line] == 0) {
                        if (!Object.is([column + 1, line + 1], this.forbidden_moves)) {
                            l.push([column + 1, line + 1]);
                        }
                    }
                }
            }
            return l;
        }
    }

    getAvailableBoards() {
        let l = this.getAvailableMoves();
        let possible_boards: any = [];

        l.forEach((coord: any) => {
            possible_boards.push(this.setPosition({
                column: coord[0], line: coord[1], player: this.player
            }));
        });

        return this.player, possible_boards;
    }

    takeTurn() {
        return (this.player = this.player == 1 ? 2 : 1);
    }

    private validateMove(move: Move) {
        if (this.ended) {
            return new GameOverResponse()
        }

        if (move.player != this.player) {
            return new NotYourTurnResponse()
        }

        if (move.column - 1 > this.board.length || move.column < 0) {
            return new NoSuchColumnResponse()
        }

        if (move.line < 0 || move.line > this.board[move.column - 1].length) {
            return new NoSuchLineResponse(move.column)
        }

        if (Object.is([move.column, move.line], this.forbidden_moves)) {
            return new PositionNotAvailableResponse(move.column, move.line)
        }

        return "success"
    }

    move({ player, column, line }: Move) {

        const output = this.validateMove({ player, column, line })
        if (output !== "success") {
            return output
        }

        let state;

        if (this.getPosition(column, line) == 0 || this.waiting_removal) {
            let forbidden_just_set = false;
            if (this.waiting_removal) {
                if (this.can_remove(this.player).filter((a1: any) => _.isEqual(a1, [column, line])).length) {
                    // if (_.includes(this.can_remove(this.player), [column, line])) {
                    state = 0;
                    this.waiting_removal = false;
                    this.forbidden_moves = [column, line];
                    forbidden_just_set = true;
                } else {
                    return [-6, "Invalid removal"];
                }
            } else {
                state = player;
            }

            this.board = this.setPosition({ column, line, player: state });

            if (!forbidden_just_set) {
                this.forbidden_moves = null;
            }
        } else {
            return new PositionNotAvailableResponse(column, line)

        }

        let f = this.is_final_state();

        if (f != null) {
            this.ended = true;
            return [0, f + " wins"];
        }

        this.last_line = line;
        this.last_column = column;

        // Check for sandwiches
        // possible_states = []

        let removal_options = this.can_remove(this.player);
        if (removal_options != null) {
            this.waiting_removal = true;
            return new MustRemoveResponse();
            // for option in removal_options:
            //     possible_states.append(this.set_position(option[0],option[1],0))
            // return (player,possible_states)
        } else {
            this.takeTurn();
        }

        this.movements += 1;

        return new OkResponse()
    }
}

type Move = {
    player: number,
    column: number,
    line: number
}
type Board = Array<Array<number>>



// return [-1, "Game is over"];
// return [-2, "Not your turn"];
// return [-3, "No such column"];
// return [-4, "No such line in column " + column];
// return [-5, "Position (" + column + "," + line + ") not available (forbidden)" ];
// return [-6, "Invalid removal"];
// return [0, f + " wins"];
// return [1, "ok"];
// return [2, "must remove"];

class BaseResponse {
    code: number
    message: string
    constructor(code: number, message: string) {
        this.code = code
        this.message = message
    }
}
class GameOverResponse extends BaseResponse {
    constructor() {
        super(-1, 'Game is over')
    }
}
class NotYourTurnResponse extends BaseResponse {
    constructor() {
        super(-2, 'Not your turn')
    }
}
class NoSuchColumnResponse extends BaseResponse {
    constructor() {
        super(-3, 'No such column')
    }
}
class NoSuchLineResponse extends BaseResponse {
    constructor(column: number) {
        super(-4, `No such line in column ${column}`)
    }
}
class PositionNotAvailableResponse extends BaseResponse {
    constructor(column: number, line: number) {
        super(-5, `Position (${column}, ${line}) not available (forbidden)`)
    }
}
class InvalidRemovalResponse extends BaseResponse {
    constructor() {
        super(-6, 'Invalid removal')
    }
}
class WinnerResponse extends BaseResponse {
    constructor(player: number) {
        super(0, `${player} wins`)
    }
}
class OkResponse extends BaseResponse {
    constructor() {
        super(1, 'Ok')
    }
}
class MustRemoveResponse extends BaseResponse {
    constructor() {
        super(2, 'Must remove')
    }
}
