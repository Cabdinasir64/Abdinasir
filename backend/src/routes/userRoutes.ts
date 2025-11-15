import { Router } from "express";
import * as skillController from "../controllers/skillController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleCheck";
import { upload } from "../middleware/skillImageUpload";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleCheck("admin"),
    upload.single("skillImage"),
    skillController.createSkill
);

router.put(
    "/:id",
    authMiddleware,
    roleCheck("admin"),
    upload.single("skillImage"),
    skillController.updateSkill
);

router.get("/", authMiddleware, skillController.getSkills);
router.get("/:id", authMiddleware, skillController.getSkill);
router.delete("/:id", authMiddleware, roleCheck("admin"), skillController.deleteSkill);

export default router;
