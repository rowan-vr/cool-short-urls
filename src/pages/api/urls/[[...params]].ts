import {Body, createHandler, Get, Post, Req, ValidationPipe} from 'next-api-decorators';
import {IsString, IsUrl} from "class-validator";
import {prisma} from "@/database";
import {NextAuthGuard} from "@/middleware/nextauth";
import type {NextApiRequest} from "next";

export class NewUrlBody {
    @IsString()
    @IsUrl()
    destination: string;
}

function makeCode(length:number):string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

@NextAuthGuard()
class UrlHandler {
    @Post("/new")
    public async register(@Body(ValidationPipe) {destination}: NewUrlBody, @Req() req: NextApiRequest) {

        const code = makeCode(6);

        console.log(req.user)

        await prisma.url.create({
            data: {
                slug: code,
                destination,
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        });

        return {code};
    }

    @Get("/mine")
    public async getMine(@Req() req: NextApiRequest) {
        return await prisma.url.findMany({
            where: {
                userId: req.user.id
            }
        });
    }

}

export default createHandler(UrlHandler);