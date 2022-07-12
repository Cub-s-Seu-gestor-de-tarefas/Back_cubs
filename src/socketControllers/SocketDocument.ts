import { prismaClient } from "@database/prismaClient";
class SocketDocument {
    async getHeaderData(id: string) {
        const workspaceData = await prismaClient.workspace.findFirst({ where: { id: id }, select: { title: true, owner: true, updated_at: true } });
        const Members = await prismaClient.members.findMany({ where: { workspaceId: id }, select: { userId: true } })
        const topMembers = [];
        // console.log("workspaceData",workspaceData);
        // console.log("Members",Members);
        topMembers.push(workspaceData.owner);
        if (Members.length >= 2) {
            for (let index = 0; index < 2; index++) {
                topMembers.push(Members[index].userId);

            }
        } else if (Members.length > 0) {
            topMembers.push(Members[0].userId);
        }
        const bichos = [];

        for (let index = 0; index <= topMembers.length; index++) {

            const bicho = await prismaClient.user.findFirst({ where: { id: topMembers[index] }, select: { img: true } });
            bichos.push(bicho.img);

        }


        bichos.pop();
        let date = workspaceData.updated_at;
        //    let stringData = date.toLocaleDateString("pt-br",{year:"numeric",month:"long",day:"numeric"});
        let stringData = new Intl.DateTimeFormat("pt-br", { dateStyle: "full", timeStyle: "full", }).format(date)

        let header = {
            "imgs": bichos,
            "title": workspaceData.title,
            "update_at": stringData
        }
        return header;
    }

    async handleUpdateTitle(currentRoom: string, title: string) {
        await prismaClient.workspace.update({ where: { id: currentRoom }, data: { title: title } });
        await prismaClient.members.updateMany({ where: { workspaceId: currentRoom }, data: { workspaceName: title } })
    }
    async handleGetLoadOrder(currrentRoom: string) {
        const loadOrder = await prismaClient.workspace.findFirst({ where: { id: currrentRoom }, select: { loadOrder: true } })
       const string = loadOrder.loadOrder
        let components= JSON.parse(string);
        // console.log("string", typeof string)
        // console.log("components",typeof components )
        return components;

    }
}
export { SocketDocument };