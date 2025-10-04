import { Request, Response } from 'express';
import { z } from 'zod';
import {
  createBlog,
  getBlogById,
  listBlogs,
  updateBlog,
  deleteBlog,
  incrementViews
} from '../../services/blog.service';

// Create / Update schemas
const createSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]).optional(),
  categories: z.array(z.string()).default([]).optional(),
  isFeatured: z.boolean().default(false).optional(),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional()
});

const updateSchema = createSchema.partial();

export const createBlogHandler = async (req: Request, res: Response) => {
  const body = createSchema.parse(req.body);
  const authorId = req.auth!.sub; // from protect middleware
  const blog = await createBlog({ ...body, authorId });
  return res.status(201).json({
    success: true,
    message: 'Blog created successfully!',
    data: blog
  });
};

export const getOneBlogHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Optional: increment views when fetching a single blog
  const blog = await incrementViews(id).catch(async () => {
    // if increment fails (e.g., not found), try just fetching
    return await getBlogById(id);
  });

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  return res.json({ success: true, message: 'Blog fetched successfully!', data: blog });
};

export const listBlogsHandler = async (req: Request, res: Response) => {
  const { q, tag, category, isFeatured, page, limit } = req.query;
  const featured = typeof isFeatured === 'string' ? isFeatured === 'true' : undefined;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 10;

  const result = await listBlogs({
    q: q as string | undefined,
    tag: tag as string | undefined,
    category: category as string | undefined,
    isFeatured: featured,
    page: pageNum,
    limit: limitNum
  });

  return res.json({
    success: true,
    message: 'Blogs fetched successfully!',
    data: result.data,
    meta: result.meta
  });
};

export const updateBlogHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = updateSchema.parse(req.body);

  const blog = await updateBlog(id, body);
  return res.json({
    success: true,
    message: 'Blog updated successfully!',
    data: blog
  });
};

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteBlog(id);
  return res.json({
    success: true,
    message: 'Blog deleted successfully!',
    data: null
  });
};
