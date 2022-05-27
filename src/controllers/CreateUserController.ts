import { prismaClient } from "@database/prismaClient";
import { hash } from "bcryptjs";
import { Request, Response } from "express";
class CreateUserController {
    async handle(request: Request, response: Response) {
        const { name, password, email } = request.body;
        console.log(request.body);
        if (!name) {
            throw new Error("name incorrect");
        }
        if (!email) {
            throw new Error("Email incorrect");
        }
        console.log("Password", password);


        if (!password) {
            throw new Error("Password is empity");
        }

        const passwordHash = await hash(password, 8);

        const userEmail = await prismaClient.user.findFirst({ where: { email: email }, select: { email: true } });
        if (userEmail != null) {
            throw new Error("Este email ja esta cadastrado!");
        }
        const user = await prismaClient.user.create({
            data: { name: name, password: passwordHash, email: email, }
        });

        return response.json(user);

    }
}
export { CreateUserController };