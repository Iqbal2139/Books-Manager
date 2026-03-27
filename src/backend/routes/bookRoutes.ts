import { Router } from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, bookSchema } from '../middleware/validate';

const router = Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', authenticateToken, validateRequest(bookSchema), createBook);
router.put('/:id', authenticateToken, validateRequest(bookSchema), updateBook);
router.delete('/:id', authenticateToken, deleteBook);

export default router;
