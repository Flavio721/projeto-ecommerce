import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";

const prisma = new PrismaClient();

export async function me(req, res, next){
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user.id},
            select: {
                email: true,
                role: true,
                name: true,
                phone: true,
                createdAt: true
            }
        })

        return res.status(200).json({
            user
        })
    }catch (error){
        next(error);
    }
}

export async function update(req, res, next) {
  try {
    const { currentPassword, name, phone, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new AppError("Usuário não encontrado", 404);

    // Só verifica senha se o usuário quiser alterá-la
    let hashedPassword = user.password;

    if (newPassword) {
      if (!currentPassword) {
        throw new AppError("Informe a senha atual para alterá-la", 400);
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) throw new AppError("Senha atual incorreta", 400);

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || user.name,
        phone: phone || user.phone,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    next(error);
  }
}

export async function listAddress(req, res, next){
    try{
        const userId = req.user.id;

        const address = await prisma.address.findMany({
            where: { userId: parseInt(userId)}
        });

        if(!address){
            throw new AppError("Nenhum endereço registrado", 404);
        }
        
        return res.status(200).json({
            address
        })
    }catch (error){
        next(error);
    }
}

export async function createAddress(req, res, next){
    try{
        const { street, number, complement, city, state, cep } = req.body;
        const userId = req.user.id;

        if(!street || !number || !city || !state || !cep){
            throw new AppError("Campos obrigatórios vazios", 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId)}
        });

        if(!user){
            throw new AppError("Usuário não encontrado", 404);
        }

        const create = await prisma.address.create({
            data: {
                userId: user.id,
                street: street,
                number,
                complement,
                city,
                state,
                cep
            }
        })
        return res.status(200).json({
            message: "Endereço criado com sucesso"
        })
    }catch (error){
        next(error);
    }
}

export async function updateAddress(req, res, next) {
  try {
    const { street, number, complement, city, state, cep } = req.body;
    const userId = req.user.id;
    const addressId = parseInt(req.params.id); // ← id do endereço vem da URL

    // Busca o endereço garantindo que pertence ao usuário logado
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,               // ← garante que o endereço é do usuário
      },
    });

    if (!address) {
      throw new AppError("Endereço não encontrado", 404);
    }

    await prisma.address.update({
      where: { id: address.id }, // ← id correto do endereço
      data: {
        street:     street     || address.street,
        number:     number     || address.number,
        complement: complement || address.complement,
        city:       city       || address.city,
        state:      state      || address.state,
        cep:        cep        || address.cep,
      },
    });

    return res.status(200).json({ message: "Endereço atualizado com sucesso" });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next){
    try{
        const userId = req.user.id;
        const addressId = req.params;

        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId,               // ← garante que o endereço é do usuário
            },
        });

        if (!address) {
            throw new AppError("Endereço não encontrado", 404);
        }

        const deleteAddress = await prisma.address.delete({
            where: { id: address.id}
        });

        return res.status(200).json({
            message: "Endereço removido com sucesso"
        })
    }catch (error){
        next(error)
    }
}

export async function getAllAddress(req, res, next){
    try{
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
                role: "ADMIN"
            }
        });

        if(!user) throw new AppError("Você não tem permissão suficiente", 400);

        const address = await prisma.address.findMany();

        return res.status(200).json({
            address
        })
    }catch (error){
        next(error);
    }
}