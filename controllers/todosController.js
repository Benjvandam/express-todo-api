import { error } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the JSON file
const todosDataPath = path.join(__dirname, '..', 'example_todos.json');
const todosData = fs.readFileSync(todosDataPath, 'utf-8');
let todos = JSON.parse(todosData);

// @desc Get all todos
// @route GET /api/todos
export const getTodos = async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id');

        return res.status(200).json(result.rows);
    } catch (error) {
        return next(error);
    }
} 

// @desc Get single todo
// @route GET /api/todo/:id
export const getTodo = (req, res, next) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((todo) => todo.id === id );

    if (!todo) {
        const error = new Error(`Could not find todo with id ${id}`);
        error.status = 404;
        return next(error);
    }

    res.status(200).json(todo);

}

// @desc Create a todo
// Route Create /api/todos
export const createTodo = async (req, res, next) => {
    // Debug
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers['content-type']);
    
    // Validate required fields
    if (!req.body.title || req.body.title.trim() === '') {
        const error = new Error('Title of your todo is missing');
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
export const updateTodo = (req, res, next) => {
    const id = parseInt(req.params.id)
    if (!id || isNaN(id)) {
        const error = new Error('ID of the todo is missing');
        error.status = 400;
        return next(error);
    }

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
        const error = new Error(`Todo with ID ${id} could not be found`)
        error.status = 404
        return next(error)
    }

    const newTodo = {
        id,
        title: req.body.title != undefined ? req.body.title : todos[todoIndex].title,
        description: req.body.description != undefined ? req.body.description : todos[todoIndex].description,
        priority: req.body.priority != undefined ? req.body.priority : todos[todoIndex].priority,
        complete: req.body.complete != undefined ? req.body.complete : todos[todoIndex].complete
    }

    todos[todoIndex] = newTodo

    res.status(201).json(newTodo)
} 

// @desc Delete a todo
// Route DELETE /api/todo/:id
export const deleteTodo = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        error = new Error('Could not find the todo')
        error.status = 404
        next(error)
    }

    todos = todos.filter((todo) => todo.id != id)
    res.status(201).json(todos)
}