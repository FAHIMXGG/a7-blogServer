import { prisma } from '../config/prisma';

export type CreateBlogInput = {
  title: string;
  content: string;
  excerpt?: string | null;
  tags?: string[];
  categories?: string[];
  isFeatured?: boolean;
  authorId: string;
};

export type UpdateBlogInput = Partial<Omit<CreateBlogInput, 'authorId'>>;

const mapId = <T extends { id: string }>(obj: T) => {
  const { id, ...rest } = obj as any;
  return { ...rest, _id: id, __v: 0 };
};

export const createBlog = async (payload: CreateBlogInput) => {
  const blog = await prisma.blog.create({
    data: {
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt ?? null,
      tags: payload.tags ?? [],
      categories: payload.categories ?? [],
      isFeatured: payload.isFeatured ?? false,
      authorId: payload.authorId
    },
    include: { author: true }
  });
  const mapped = mapId(blog);
  // map nested author id too
  if (mapped.author) mapped.author = mapId(mapped.author);
  return mapped;
};

export const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findUnique({ where: { id }, include: { author: true } });
  if (!blog) return null;
  const mapped = mapId(blog);
  if (mapped.author) mapped.author = mapId(mapped.author);
  return mapped;
};

export const listBlogs = async (params: {
  q?: string;
  tag?: string;
  category?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}) => {
  const { q, tag, category, isFeatured, page = 1, limit = 10 } = params;

  // Prisma Mongo filters
  const AND: any[] = [];
  if (q) AND.push({ title: { contains: q, mode: 'insensitive' } });
  if (tag) AND.push({ tags: { has: tag } });
  if (category) AND.push({ categories: { has: category } });
  if (typeof isFeatured === 'boolean') AND.push({ isFeatured });

  const where = AND.length ? { AND } : {};

  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.blog.count({ where })
  ]);

  const mapped = items.map((b: any) => {
    const m = mapId(b);
    if (m.author) m.author = mapId(m.author);
    return m;
  });

  return {
    data: mapped,
    meta: { page, limit, total, pages: Math.ceil(total / limit) }
  };
};

export const updateBlog = async (id: string, payload: UpdateBlogInput) => {
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt ?? undefined,
      tags: payload.tags ?? undefined,
      categories: payload.categories ?? undefined,
      isFeatured: payload.isFeatured ?? undefined
    },
    include: { author: true }
  });
  const mapped = mapId(blog);
  if (mapped.author) mapped.author = mapId(mapped.author);
  return mapped;
};

export const deleteBlog = async (id: string) => {
  const blog = await prisma.blog.delete({ where: { id } });
  return mapId(blog);
};

export const incrementViews = async (id: string) => {
  const blog = await prisma.blog.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { author: true }
  });
  const mapped = mapId(blog);
  if (mapped.author) mapped.author = mapId(mapped.author);
  return mapped;
};
