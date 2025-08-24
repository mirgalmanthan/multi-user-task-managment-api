import { Router, Request, Response } from "express";
import { verifyAuthToken } from "../middlewares/verify";
import { createTask } from "../controllers/createTask";
import { getTasks } from "../controllers/getTasks";
import { getTaskById } from "../controllers/getTaskById";
import { updateTask } from "../controllers/updateTask";
import { deleteTask } from "../controllers/deleteTask";

const taskRouter = Router();

taskRouter.post('/', verifyAuthToken, async (req: Request, res: Response) => {
   await createTask(req, res)
})

taskRouter.get('/', verifyAuthToken, async (req: Request, res: Response) => {
    await getTasks(req, res)
});

taskRouter.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
    await getTaskById(req, res)
});

taskRouter.put('/:id', verifyAuthToken, async (req: Request, res: Response) => {
    await updateTask(req, res)
});

taskRouter.delete('/:id', verifyAuthToken, async (req: Request, res: Response) => {
    await deleteTask(req, res)
});

export default taskRouter;
