import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { genereateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export async function registerUser(req, res){
    const { email, password, name, phone } = req.body;

    // Verificações para cadastro
}