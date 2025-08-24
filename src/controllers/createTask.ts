import { Request, Response } from "express";
import { ApiResponse } from "../structs/io";
import { taskInputValidator } from "../middlewares/validators";
import { Task } from "../db/queries/tasks";
import { User } from "../db/queries/users";

export async function createTask(req: Request, res: Response) {
    console.log("createTask invoked")
    let response = new ApiResponse();
    let validationErros = taskInputValidator(req.body)
    try {
        if (validationErros.length > 0) {
            throw {
                statusCode: 400,
                errors: validationErros
            }
        } else {
            let user = await User.findOne({ where: { email: req.body.email } })
            if (!user) {
                throw {
                    statusCode: 404,
                    errors: ["User not found"]
                }
            }
            let result = await Task.create({
                title: req.body.title,
                description: req.body.description,
                user_id: user.id,
                status: 'pending',
                created_at: new Date(),
                updated_at: new Date()
            })
            console.log(result)
            response.statusCode = 200
            response.payload = {
                message: 'Task created successfully',
                taskId: result.id
            }
        }
    } catch (error: any) {
        console.log("ERROR: ")
        console.log(error)
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            response.statusCode = 409;
            response.errors = ["A task with this title already exists. Please choose a different title."];
        } else if (error.statusCode) {
            response.statusCode = error.statusCode;
            response.errors = Array.isArray(error.errors) ? error.errors : [error.message || 'An error occurred'];
        } else {
            console.error('Unexpected error:', error);
            response.statusCode = 500;
            response.errors = ['An unexpected error occurred while creating the task.'];
        }
    } finally {
        res.status(response.statusCode).json(response)
    }
}
