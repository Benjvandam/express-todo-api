import express from 'express';
import path from 'path';
import { fileURLToPath} from 'url';
import todos from './routes/todos.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/error.js'
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse json bodies
app.use(express.json())

// routes
app.use('/api', todos)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});