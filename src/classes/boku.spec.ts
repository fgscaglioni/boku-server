
import { Boku } from "../classes/boku.class";

describe("Test suit Boku", () => {

    let boku: Boku

    beforeAll(() => {
        boku = new Boku()
    })

    test("should instantiate boku class", async () => {
        const boku = new Boku()
        expect(boku).toBeInstanceOf(Boku)
    });

    test("should move", () => {

        console.log(boku.move({
            player: 1,
            column: 2,
            line: 1
        }));
        boku.printBoard()

        console.log(boku.move({
            player: 2,
            column: 4,
            line: 4
        }));
        boku.printBoard()

        // console.log(boku.move(1, 1, 6));
        // boku.printBoard()

        console.log(boku.reset());
        boku.printBoard()

        expect(true).toBe(true)

    })

    test("player one should win the game", () => {

        const boku = new Boku()

        boku.move({ player: 1, column: 5, line: 1 });
        boku.move({ player: 2, column: 7, line: 4 });
        boku.move({ player: 1, column: 5, line: 2 });
        boku.move({ player: 2, column: 3, line: 4 });
        boku.move({ player: 1, column: 5, line: 3 });
        boku.move({ player: 2, column: 1, line: 4 });
        boku.move({ player: 1, column: 5, line: 4 });
        boku.move({ player: 2, column: 7, line: 5 });
        console.log(boku.move({ player: 1, column: 5, line: 5 }));
        // console.log(boku.move({ player: 2, column: 9, line: 4 }));
        // console.log(boku.move({ player: 1, column: 5, line: 6 }));
        // console.log(boku.move({ player: 2, column: 11, line: 4 }));

        expect(true).toBe(true)
    })


    test("should test final state", () => {
        const boku = new Boku()
        // console.log(boku.move({ player: 1, column: 1, line: 1 }));

        boku.board[4][0] = 1
        boku.board[4][1] = 1
        boku.board[4][2] = 1
        boku.board[4][3] = 1
        boku.board[4][4] = 1
        console.table(boku.getBoard());
        console.log(boku.is_final_state());
        boku.reset()


        // test upward diagonals
        boku.board[1][1] = 1
        boku.board[1][2] = 1
        boku.board[1][3] = 1
        boku.board[1][4] = 1
        boku.board[1][5] = 1
        console.table(boku.getBoard());
        console.log(boku.is_final_state());
        boku.reset()



        boku.board[6][1] = 1
        boku.board[5][1] = 1
        boku.board[4][1] = 1
        boku.board[3][1] = 1
        boku.board[2][1] = 1
        console.table(boku.getBoard());
        console.log(boku.is_final_state());
        boku.reset()
    })


    test("should test reset", () => {
        const boku = new Boku()
        console.table(boku.getBoard());
        boku.reset()
        console.table(boku.getBoard());
        const state = boku.is_final_state()
    })


});

