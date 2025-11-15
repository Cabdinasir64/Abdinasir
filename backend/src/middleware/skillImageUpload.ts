import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';
import { Request } from 'express';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req: Request, file: Express.Multer.File) => {
        const ext = file.mimetype.split('/')[1];
        return {
            folder: 'skill_images',
            format: ext === 'jpeg' ? 'jpg' : ext,
            public_id: `${Date.now()}_${file.originalname}`
        };
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, JPG, and JPEG files are allowed'));
};

export const upload = multer({ storage, fileFilter });
