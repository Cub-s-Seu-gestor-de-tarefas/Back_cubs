import { prismaClient } from "@database/prismaClient";
class SocketUsers {
    async getMembers(text: string) {
        if (text != "" && text != null) {
            const Emails = await prismaClient.user.findMany({ where: { email: { startsWith: text } }, select: { email: true,img:true } });
            return Emails;
        }


    }
    async verifyEmail(email: string) {
        const user = await prismaClient.user.findFirst({ where: { email: email } });
        if (!user) {
            console.log("e-mail não existe");
            return false;
        }
        else {
            console.log("e-mail existe");
            return true;
        }
    }
}
export { SocketUsers };