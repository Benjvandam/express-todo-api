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
        const todos = await prisma.todos.findMany({
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

        const todo = await prisma.todos.findFirst({
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
    // Debug
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers['content-type']);

    // Validate required fields
    if (!req.body.title || req.body.title.trim() === '') {
        const error: HttpError = new Error('Title of your todo is missing');
        error.status = 400;
        return next(error);
    }

    try {
        const query = `
            INSERT INTO todos (title, description, priority, complete)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        const values = [
            req.body.title,
            req.body.description || '',
            req.body.priority || 1,
            req.body.complete || false
        ];
    
        const result = await pool.query(query, values);
        return res.status(201).json(result.rows[0]);
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

        const query = `
        UPDATE todos
        SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            priority = COALESCE($3, priority),
            complete = COALESCE($4, complete),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *        
    `

        const values = [
            req.body.title || null,
            req.body.description || null,
            req.body.priority || null,
            req.body.complete ?? null,
            id
        ]

        const result = await pool.query(query, values)

        if (result.rows.length === 0)  {
            const error: HttpError = new Error(`Could not find todo with id ${id}`)
            error.status = 404;
            return next(error)
        };

        return res.status(200).json(result.rows[0])
    } catch (error) {
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
    
        const query = `
            DELETE FROM todos
            WHERE id = $1
            RETURNING *
        `
    
        const values = [id];
    
        const result = await pool.query(query, values);
    
        if (result.rows.length === 0) {
            const error: HttpError = new Error(`Could not find todo with id ${id}`);
            error.status = 404;
            return next(error);
        }
    
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
}