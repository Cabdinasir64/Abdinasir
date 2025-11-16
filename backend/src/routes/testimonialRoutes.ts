import { Router } from "express";
import * as testimonialController from "../controllers/testimonialController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleCheck";
import { uploadDynamic } from "../middleware/uploadImage";

const router = Router();
const upload = uploadDynamic("testimonials_images")

router.post("/", authMiddleware, roleCheck("admin"), upload.single('image'), testimonialController.createTestimonial);
router.get("/", testimonialController.getTestimonials);
router.get("/:id", testimonialController.getTestimonial);
router.put("/:id", authMiddleware, roleCheck("admin"), upload.single('image'), testimonialController.updateTestimonial);
router.delete("/:id", authMiddleware, roleCheck("admin"), testimonialController.deleteTestimonial);

export default router;
