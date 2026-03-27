import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { Op } from 'sequelize';

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, year } = req.body;
    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { title, author, year } = req.query;
    const where: any = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (author) where.author = { [Op.like]: `%${author}%` };
    if (year) where.year = year;

    const books = await Book.findAll({ where });
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { title, author, year } = req.body;
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    await book.update({ title, author, year });
    res.json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
