import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import prisma from '../config/prisma.js'

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the JSON file
const todosDataPath = path.join(__dirname, '..', 'example_todos.json');
const todosData = fs.readFileSync(todosDataPath, 'utf-8');
let todos = JSON.parse(todosData);

// @desc Get all todos
// @route GET /api/todos
export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return res.status(200).json(todos);
    } catch (error) {
        return next(error);
    }
} 

// @desc Get single todo
// @route GET /api/todo/:id
export const getTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(String(req.params.id));

        const todo = await prisma.todo.findFirst({
            where: { id }
        })

        if (!todo ) {
            const error: HttpError = new Error(`Could not find todo with is ${id}`)
            error.status = 404
            return next(error);
        }

        return res.status(200).json(todo)
        
    } catch (error) {
        return next(error);
    }
}

// @desc Create a todo
// Route Create /api/todos
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {

    // Validate required fields
    if (!req.body.title || req.body.title.trim() === '') {
        const error: HttpError = new Error('Title of your todo is missing');
        error.status = 400;
        return next(error);
    }

    try {

        const todo = await prisma.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description || "",
                priority: req.body.priority || 1,
                complete: req.body.complete || false
            }
        });

        return res.status(201).json(todo);
    } catch (error) {
        return next(error);
    }
}

// @desc Update a todo
// Route PUT /api/todo/:id
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(String(req.params.id))
        if (!id || isNaN(id)) {
            const error: HttpError = new Error('ID of the todo is missing');
            error.status = 400;
            return next(error);
        }

        const todo = await prisma.todo.update({
            where: {
                id
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                complete: req.body.complete
            }
        });

        return res.status(200).json(todo)

    } catch (error: any) {
        if (error.code === 'P2025') {
            const httpError: HttpError = new Error(`Could not find todo with id`)
            httpError.status = 404;
            return next(httpError);
        }
        
        return next(error)
    }
} 

// @desc Delete a todo
// Route DELETE /api/todo/:id
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(String(req.params.id));
        if (!id || isNaN(id)) {
            const error: HttpError = new Error('ID of the todo is missing');
            error.status = 400;
            return next(error);
        }
    
        const todo = await prisma.todo.delete({
            where: {
                id
            }
        })

        return res.status(200).json(todo);

    } catch (error: any) {
        if (error.code === 'P2025') {
            const httpError: HttpError = new Error('Could not find todo with id')
            httpError.status = 404;
            return next(httpError)
        }
        return next(error);
    }
}