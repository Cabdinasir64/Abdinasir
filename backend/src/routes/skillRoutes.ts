import { Router } from "express";
import * as skillController from "../controllers/skillController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleCheck";
import { uploadDynamic } from "../middleware/uploadImage";

const router = Router();
const upload = uploadDynamic("skill_images");

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

router.get("/", skillController.getSkills);
router.get("/:id", authMiddleware, skillController.getSkill);
router.delete("/:id", authMiddleware, roleCheck("admin"), skillController.deleteSkill);

export default router;
