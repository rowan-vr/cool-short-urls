import {User} from "next-auth";

declare module 'next'{

    interface NextApiRequest {
        user: User;
    }
}