import { Request, Response, Router } from "express";
import { BokuService } from "../services/boku.service";
const router = Router();

const bokuService = new BokuService()

router.get("/restart", (req: Request, res: Response) => {
    res.json(bokuService.restart())
});
router.get("/move", (req: Request, res: Response) => {
    res.json(bokuService.move(req.query))
});
router.get("/board", (req: Request, res: Response) => {
    res.json(bokuService.getBoard())
});
router.get("/last-move", (req: Request, res: Response) => {
    res.json(bokuService.getLastMove())
});
router.get("/movements-number", (req: Request, res: Response) => {
    res.json(bokuService.getMovementsNumber())
});
router.get("/available-moves", (req: Request, res: Response) => {
    res.json(bokuService.getAvailableMoves())
});
router.get("/player", (req: Request, res: Response) => {
    res.json(bokuService.getPlayer())
});

export { router };
