import express from 'express';
import { getTodos,
        getTodo,
        createTodo,
        updateTodo,
        deleteTodo
} from '../controllers/todosController.js'

const router = express.Router();

// Get all todos
router.get('/todos/', getTodos)

// Get todo
router.get('/todo/:id', getTodo)

//Create new todo
router.post('/todos/', createTodo)

// Update a todo
router.put('/todo/:id', updateTodo)

// Delete a todo
router.delete('/todo/:id', deleteTodo)

export default router;