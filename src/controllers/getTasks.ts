import { Request, Response } from "express";
import { ApiResponse } from "../structs/io";
import { Task } from "../db/queries/tasks";
import { User } from "../db/queries/users";

export async function getTasks(req: Request, res: Response) {
    console.log("getTasks invoked");
    let response = new ApiResponse();
    try {
        let user = await User.findOne({where: {email: req.body.email}})
        if (!user) {
            throw {
                erros: ['User not found'],
                statusCode: 404
            }
        }
        const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) || 0 : 0;
        const limit = process.env.TASKS_PER_PAGE ? parseInt(process.env.TASKS_PER_PAGE, 10) : 10;
        let tasks = await Task.findAll({
            where: {
                user_id: user.id
            },
            offset: offset,
            limit: limit
        });
        console.log(tasks)
        response.statusCode = 200;
        response.payload = {
            tasks: tasks,
            offset: offset,
            
        }
    } catch (error) {
        
    } finally {
        res.status(response.statusCode).json(response)
    }
}
