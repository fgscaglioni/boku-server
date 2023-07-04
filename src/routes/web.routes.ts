import { Request, Response, Router } from "express";
import * as path from "path";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/fabricio", (req: Request, res: Response) => {
    res.json("fabricio");
});

export { router };

