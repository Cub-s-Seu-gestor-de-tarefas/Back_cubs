import { prismaClient } from "@database/prismaClient";
class SocketKanban{
 async handleGetTitle(kanbanID:string){
     const {Title}=await prismaClient.kanban.findFirst({where:{id:kanbanID},select:{Title:true}});
     return Title;
 }
 async handleUpdateTitle(kanbanID:string,title:string){
    await prismaClient.kanban.update({where:{id:kanbanID},data:{Title:title}});

 }
}
export{SocketKanban};
