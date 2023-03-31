import {Body, ConflictException, createHandler, Get, Param, Post, ValidationPipe} from 'next-api-decorators';
import {IsString, MinLength} from "class-validator";
import {prisma} from "@/database";
import bcrypt from "bcrypt";

export class RegisterBody {
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(3)
    password: string;
}

class UserHandler {
    @Post("/register")
    public async register(@Body(ValidationPipe) {username, password}: RegisterBody) {
        const existingUser = await prisma.user.findUnique({where: {username}});
        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        await prisma.user.create({
            data: {
                username,
                password: bcrypt.hashSync(password, 12)
            }
        });


        return {success:true};
    }

}

export default createHandler(UserHandler);