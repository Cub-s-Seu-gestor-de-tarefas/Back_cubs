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
        let components = JSON.parse(string);
        // console.log("string", typeof string)
        // console.log("components",typeof components )

        //filtrar por meio de um map o tipo de componente para pegar na tabela correta os meta dados
        return components;

    }

    async handleCreateNewComponent(currentRoom: string, component: any) {
        //filtrar o componete 

        const type = component.compType;
        console.log("c", component, type)
        switch (type) {
            case "Kanban":
                const kanban = await prismaClient.kanban.create({ data: { Title: "Kanban", workspaceId: currentRoom, metadata: "" } });
                component.compID = kanban.id;
                console.log(component);
              let {loadOrder} =  await prismaClient.workspace.findFirst({where:{id:currentRoom},select:{loadOrder:true}});
              const {components} = JSON.parse(loadOrder);
              components.push(component);
              let data = {components:components}
              let metadata = JSON.stringify(data);
              await prismaClient.workspace.update({where:{id:currentRoom},data:{loadOrder:metadata}})
              console.log("components: ", components);
                break;


        }
        //criar o componete 

    }

}
export { SocketDocument };