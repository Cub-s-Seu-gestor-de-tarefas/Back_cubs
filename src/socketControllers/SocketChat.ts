import { prismaClient } from "@database/prismaClient";
class SocketChat{
async addNewMessage(data:any,id:string,currentRoom:string){
const icon = await prismaClient.user.findFirst({where:{id:id},select:{img:true}});
data["icon"]= icon.img;
console.log(data)
}
}
export{SocketChat};