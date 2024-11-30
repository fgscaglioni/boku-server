import { Boku } from "../classes/boku.class"

export class BokuService {

    private boku

    constructor() {
        this.boku = new Boku()
    }

    restart() {
        this.boku.reset()
        return this.boku.getBoard()
    }

    move({ player, column, line }: Partial<Move>) {
        if (!player || !column || !line) {
            throw new Error("Invalid move");
        }
        return this.boku.move({ player, column, line })
    }

    getBoard() {
        return this.boku.getBoard()
    }

    getLastMove() {
        return this.boku.getLastMove()
    }

    getMovementsNumber() {
        return this.boku.getMovements()
    }

    getAvailableMoves() {
        return this.boku.getAvailableMoves()
    }

    getPlayer() {
        return this.boku.getPlayer()
    }

}

export interface Move {
    player: number
    column: number
    line: number
}
