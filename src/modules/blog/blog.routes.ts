import { Router } from 'express';
import {
  createBlogHandler,
  getOneBlogHandler,
  listBlogsHandler,
  updateBlogHandler,
  deleteBlogHandler
} from './blog.controller';
import { protect, requireAdmin } from '../../middlewares/auth';

const router = Router();

// Public reads
router.get('/', listBlogsHandler);
router.get('/:id', getOneBlogHandler);

// Admin-only writes
router.post('/', protect, requireAdmin, createBlogHandler);
router.patch('/:id', protect, requireAdmin, updateBlogHandler);
router.delete('/:id', protect, requireAdmin, deleteBlogHandler);

export default router;
