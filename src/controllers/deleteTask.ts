import { ApiResponse } from "../structs/io";
import { Request, Response } from "express";
import { Task } from "../db/queries/tasks";

export async function deleteTask(req: Request, res: Response) {
    console.log("deleteTask invoked");
    let response = new ApiResponse();
    try {
        let task = await Task.findOne({ where: { id: req.params.id } })
        if (!task) {
            throw {
                statusCode: 404,
                errors: ["Task not found"]
            }
        }
        await task.destroy();
        response.statusCode = 200;
        response.payload = {
            message: "Task deleted successfully"
        }
    } catch (error: any) {
        response.errors = error.errors;
        response.statusCode = error.statusCode;
    } finally {
        res.status(response.statusCode).json(response)
    }
}