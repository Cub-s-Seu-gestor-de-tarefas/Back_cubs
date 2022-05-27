import { prismaClient } from "@database/prismaClient";
class SocketUsers{
   async getMembers(text:string){
       if (text != "" && text != null) {
        const Emails = await prismaClient.user.findMany({where:{email:{startsWith:text}},select:{email:true}});
        return Emails;
       }

      
    }
}
export{SocketUsers};