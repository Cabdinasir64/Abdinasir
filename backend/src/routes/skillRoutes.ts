import { Router } from "express";
import * as skillController from "../controllers/skillController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleCheck";

const router = Router();

router.post("/", authMiddleware, roleCheck("admin"), skillController.createSkill);

router.get("/", authMiddleware, skillController.getSkills);

router.get("/:id", authMiddleware, skillController.getSkill);

router.put("/:id", authMiddleware, roleCheck("admin"), skillController.updateSkill);

router.delete("/:id", authMiddleware, roleCheck("admin"), skillController.deleteSkill);

export default router;
