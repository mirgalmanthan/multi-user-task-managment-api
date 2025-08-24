import { Request, Response, Router } from "express";
import { registerUser } from "../controllers/userRegister";
import { loginUser } from "../controllers/userLogin";
import { verifyRefreshToken } from "../middlewares/verify";
import { refreshSession } from "../controllers/refreshSession";

const userRouter = Router();

userRouter.post('/register', async (req: Request, res: Response) => {
    await registerUser(req, res)
});

userRouter.post('/login', async (req: Request, res: Response) => {
    await loginUser(req, res)
});

userRouter.get('/refresh-session', verifyRefreshToken, async (req: Request, res: Response) => {
    await refreshSession(req, res)
});

export default userRouter;