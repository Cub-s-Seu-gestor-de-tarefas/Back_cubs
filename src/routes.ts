import { AuthenticateUserController } from "@controllers/AuthenticateUserController";
import {  TableController } from "@controllers/TableController";
import { CreateUserController } from "@controllers/CreateUserController";
import { Router } from "express";
import multer from "multer";
import { WorkspaceController } from "@controllers/WorkspaceController";
import { ensureAuthenticated } from "@middleware/ensureAuthenticated";
const multerconfig = multer();
const router = Router();
const tableController = new TableController();
const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const workspaceController = new WorkspaceController();
router.post('/TableCreate',tableController.handleWrite);
router.post('/TableDbCreate',ensureAuthenticated,tableController.handleDbSave);
router.post('/TableDbReadOne',tableController.handleDbReadOne);
router.post('/TableDbReadByWorkspcae',tableController.handleDbReadByWorkspace);
router.post('/TableRead',tableController.handleRead);
router.post("/TableDelete",tableController.handleDelete);
router.post("/ExcelUpload",multerconfig.single("file"),tableController.handleExcelUpload);


router.post("/CreateUser",createUserController.handle);
router.post("/AuthenticateUser",authenticateUserController.handle);
router.post("/CreateWorkspace",ensureAuthenticated,workspaceController.handleCreate);
router.get("/GetWorkspaces",ensureAuthenticated,workspaceController.handleListWorkspace);
router.post("/AddMember",ensureAuthenticated,workspaceController.hadleAddMember);

export{router};