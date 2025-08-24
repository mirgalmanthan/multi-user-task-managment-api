import { Router, Request, Response } from "express";
import { verifyAuthToken } from "../middlewares/verify";
import { createTask } from "../controllers/createTask";
import { getTasks } from "../controllers/getTasks";

const taskRouter = Router();

taskRouter.post('/', verifyAuthToken, async (req: Request, res: Response) => {
   await createTask(req, res)
})

taskRouter.get('/', verifyAuthToken, async (req: Request, res: Response) => {
    await getTasks(req, res)
});
export default taskRouter;
