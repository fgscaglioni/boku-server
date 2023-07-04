import { NextFunction, Request, Response, Router } from "express";
import { BokuService } from "../services/boku.service";
const router = Router();

const bokuService = new BokuService()

router.use(function (req: Request, res: Response, next: NextFunction) {
    // req.query.room = prefixRoom(req.query.room)
    next();
});

router.get("/start", (req: Request, res: Response) => {
    res.json(bokuService.restart())
});
router.get("/move", (req: Request, res: Response) => {
    res.json(bokuService.move(req.query))
});
router.get("/board", (req: Request, res: Response) => {
    res.json(bokuService.board())
});
router.get("/status", (req: Request, res: Response) => { });
router.get("/player", (req: Request, res: Response) => { });
router.get("/final", (req: Request, res: Response) => { });
router.get("/is-my-turn", (req: Request, res: Response) => { });
router.get("/available-moves", (req: Request, res: Response) => { });
router.get("/number-of-moves", (req: Request, res: Response) => { });
router.get("/last-move", (req: Request, res: Response) => { });
router.get("/restart", (req: Request, res: Response) => { });

export { router };
