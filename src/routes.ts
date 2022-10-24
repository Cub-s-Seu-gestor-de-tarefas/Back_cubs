import { AuthenticateUserController } from "@controllers/AuthenticateUserController";
import { TableController } from "@controllers/TableController";
import { CreateUserController } from "@controllers/CreateUserController";
import { Router } from "express";
import multer from "multer";
import { WorkspaceController } from "@controllers/WorkspaceController";
import { ensureAuthenticated } from "@middleware/ensureAuthenticated";
import path from "path";
import { hash } from "bcryptjs";
import { UploadsController } from "@controllers/UploadsController";
const multerconfig = multer();
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname, "public", "userprofile"))
    }, filename: (req, file, callback) => {
        const time = new Date().getTime();
        const title = `${time}_${file.originalname.replace(" ","_")}`;
        callback(null, title)
    }
})
const profileIMG = multer({ storage: storage });
const router = Router();
const uploadsController = new UploadsController();
const tableController = new TableController();
const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const workspaceController = new WorkspaceController();
router.post('/TableCreate', tableController.handleWrite);
router.post('/TableDbCreate', ensureAuthenticated, tableController.handleDbSave);
router.post('/TableDbReadOne', tableController.handleDbReadOne);
router.post('/TableDbReadByWorkspcae', tableController.handleDbReadByWorkspace);
router.post('/TableRead', tableController.handleRead);
router.post("/TableDelete", tableController.handleDelete);
router.post("/ExcelUpload", multerconfig.single("file"), tableController.handleExcelUpload);
router.post("/ProfileImageUpload",ensureAuthenticated, profileIMG.single("file"), uploadsController.userproflie);


router.post("/CreateUser", createUserController.handle);
router.post("/AuthenticateUser", authenticateUserController.handle);
router.post("/CreateWorkspace", ensureAuthenticated, workspaceController.handleCreate);
router.get("/GetWorkspaces", ensureAuthenticated, workspaceController.handleListWorkspace);
router.post("/AddMember", ensureAuthenticated, workspaceController.hadleAddMember);

export { router };