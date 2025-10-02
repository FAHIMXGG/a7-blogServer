import { prisma } from '../config/prisma';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string; // hashed
  role: 'user' | 'admin';
  phone: string;
};

export const createUser = async (payload: CreateUserInput) => {
  const user = await prisma.user.create({ data: payload });

  // Strip password & map id-> _id and add __v for Mongo-like shape
  const { password, id, ...rest } = user;
  return {
    ...rest,
    _id: id,
    __v: 0
  };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
