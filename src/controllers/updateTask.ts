import { Task } from "../db/queries/tasks";
import { ApiResponse } from "../structs/io";
import { Request, Response } from "express";

const ALLOWED_STATUSES = ['pending', 'in_progress', 'done'] as const;
type TaskStatus = typeof ALLOWED_STATUSES[number];

function isValidStatus(status: any): status is TaskStatus {
    return ALLOWED_STATUSES.includes(status as TaskStatus);
}

export async function updateTask(req: Request, res: Response) {
    console.log("updateTask invoked");
    let response = new ApiResponse();
    try {
        let task = await Task.findOne({ where: { id: req.params.id } })
        if (!task) {
            throw {
                statusCode: 404,
                errors: ["Task not found"]
            }
        }
        const updateData: Partial<{title?: string, description?: string, status?: string}> = {};
        
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.status !== undefined) {
            if (!isValidStatus(req.body.status)) {
                throw {
                    statusCode: 400,
                    errors: [`Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}`]
                };
            }
            updateData.status = req.body.status;
        }
        
        if (Object.keys(updateData).length === 0) {
            throw {
                statusCode: 400,
                errors: ["No fields provided for update"]
            };
        }
        
        const [updatedCount] = await Task.update(updateData, { 
            where: { 
                id: req.params.id,
                user_id: task.user_id 
            },
            returning: true 
        });
        
        if (updatedCount === 0) {
            throw {
                statusCode: 404,
                errors: ["Task not found or you don't have permission to update it"]
            };
        }
        
        const updatedTask = await Task.findByPk(req.params.id);
        
        response.statusCode = 200;
        response.payload = {
            message: 'Task updated successfully',
            task: {
                id: updatedTask?.id,
                user_id: updatedTask?.user_id,
                title: updatedTask?.title,
                description: updatedTask?.description,
                status: updatedTask?.status,
                updated_at: updatedTask?.updated_at
            }
        }
    } catch (error: any) {
        console.error("ERROR: ", error);
        
        if (error.name === 'SequelizeDatabaseError' && error.parent?.constraint === 'tasks_status_check') {
            response.statusCode = 400;
            response.errors = [`Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}`];
        } 
        else if (error.statusCode) {
            response.statusCode = error.statusCode;
            response.errors = error.errors || [error.message || 'An error occurred'];
        }
        else {
            console.error('Unexpected error:', error);
            response.statusCode = 500;
            response.errors = ['An unexpected error occurred while updating the task.'];
        }
    } finally {
        res.status(response.statusCode).json(response)
    }
}