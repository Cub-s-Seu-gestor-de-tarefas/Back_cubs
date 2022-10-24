import { prismaClient } from "@database/prismaClient";

import { Request, Response } from "express";

class UploadsController {
    async userproflie(request: Request, response: Response){
        const id =request.user_id;
        const {filename}=request.file;
        await prismaClient.user.update({where:{id:id},data:{img:filename}})
        return response.json(request.file)

    }
}
export{UploadsController};