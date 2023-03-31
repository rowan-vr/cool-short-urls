import {createMiddlewareDecorator, NextFunction, UnauthorizedException} from "next-api-decorators";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export const NextAuthGuard = createMiddlewareDecorator(async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const session = await getServerSession(req,res, authOptions);
    if (!session?.user){
        throw new UnauthorizedException("You are not authenticated");
    }

    req.user = session.user;
    next();
});