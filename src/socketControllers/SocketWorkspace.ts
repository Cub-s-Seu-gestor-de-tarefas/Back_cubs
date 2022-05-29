import { prismaClient } from "@database/prismaClient";

class SocketWorkspaces {
    async handleListWorkspace(user_id: string) {
        const user = user_id;
        const array = [];
        const userWorkspaces = await prismaClient.workspace.findMany({ where: { owner: user }, orderBy: { created_at: 'asc' } });

        if (userWorkspaces) {
            userWorkspaces.map((m) => { array.push({ id: m.id, title: m.title, private: m.private }) });
            const userMember = await prismaClient.members.findMany({ where: { userId: user }, include: { Workspace: { select: { title: true, id: true, private: true } } } })
            // console.log(userMember);
            userMember.map((m) => { array.push({ id: m.Workspace.id, title: m.Workspace.title, private: m.Workspace.private }) });
        } else {
            const userMember = await prismaClient.members.findMany({ where: { userId: user }, include: { Workspace: { select: { title: true, id: true, private: true } } }, orderBy: { Workspace: { created_at: "asc" } } })
            console.log(userMember);
            userMember.map((m) => { array.push({ id: m.Workspace.id, title: m.Workspace.title, private: m.Workspace.private }) });

        }

        // console.log(array);
        return array;
    };
    async handleCreateRoom(id: string, title: string) {
        const user_id = id;

        if (!title) {
            throw new Error("title is empity")
        }


        const workspace = await prismaClient.workspace.create({
            data: {
                owner: user_id, private: false, title: title, loadOrder: ""
            }
        })
        const newWorkspace = await prismaClient.workspace.findFirst({ where: { owner: user_id, title: title }, select: { id: true, title: true } })

        console.log(newWorkspace);
        return newWorkspace;
    }
    async handleAddNewMember(id: string, data) {
        const { workspaceId, memberEmail, admin } = data;
        const user = id;
        if (!memberEmail || admin === null) {
            throw new Error("É necessário um E-mail e e status de admin");
        }
        if (!workspaceId) {
            throw new Error("É necessário o ID do Workspace");
        }

        const workspace = await prismaClient.workspace.findFirst({ where: { id: workspaceId, owner: user } });
        const member = await prismaClient.members.findFirst({ where: { userId: user, workspaceId: workspaceId }, select: { admin: true, workspaceName: true } })
        if (workspace) {

            const getNewMember = await prismaClient.user.findUnique({ where: { email: memberEmail }, select: { id: true, name: true } });
           
            const addNewMember = await prismaClient.members.create({ data: { userName: getNewMember.name, workspaceName: workspace.title, userId: getNewMember.id, workspaceId: workspaceId, admin: admin } })
            const getWorkspaceTitle = await prismaClient.workspace.findFirst({ where: { id: workspaceId }, select: { title: true } })
            const json = {
                memberId: getNewMember.id,
                workspaceTitle: getWorkspaceTitle.title
            }
            return json;
        }
        if (member) {
            if (member.admin === true) {
                const getNewMember = await prismaClient.user.findUnique({ where: { email: memberEmail }, select: { id: true, name: true } });
              
                const addNewMember = await prismaClient.members.create({ data: { userName: getNewMember.name, workspaceName: member.workspaceName, userId: getNewMember.id, workspaceId: workspaceId, admin: admin } })
                const getWorkspaceTitle = await prismaClient.workspace.findFirst({ where: { id: workspaceId }, select: { title: true } })
                const json = {
                    memberId: getNewMember.id,
                    workspaceTitle: getWorkspaceTitle.title
                }
                return json;
            }

        }
        else {
            throw new Error("Precisa ser o dono do workspace ou administrador para adicionar um membro");
        }


    }
}
export { SocketWorkspaces };