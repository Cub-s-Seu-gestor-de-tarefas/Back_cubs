import { prismaClient } from "@database/prismaClient";
class SocketDocument {
    async getHeaderData(id: string) {
        const workspaceData = await prismaClient.workspace.findFirst({ where: { id: id }, select: { title: true, owner: true, updated_at: true } });
        const Members = await prismaClient.members.findMany({ where: { workspaceId: id }, select: { userId: true } })
        const topMembers = [];
        console.log("workspaceData",workspaceData);
        console.log("Members",Members);
        topMembers.push(workspaceData.owner);
        if(Members.length >= 2){
        for (let index = 0; index < 2; index++) {
            topMembers.push(Members[index].userId);

        }}else if(Members.length >0){
            topMembers.push(Members[0].userId);
        }
        const bichos = [];
        
        for (let index = 0; index <= topMembers.length; index++) {

            const bicho = await prismaClient.user.findFirst({where:{ id: topMembers[index] },select:{ img: true }});
            bichos.push(bicho.img);

        }
       
      console.log("topMembers",topMembers);
      console.log("bichos",bichos);
      bichos.pop();
      

        let header = {
            "imgs": bichos,
            "title":workspaceData.title,
            "update_at": workspaceData.updated_at
        }
        return header;
    }
}
export { SocketDocument };