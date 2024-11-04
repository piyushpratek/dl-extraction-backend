import express from 'express';
import multer from 'multer';
import { uploadLicense } from '../controllers/licenseController';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/upload').post(upload.single('licenseImage'), asyncHandler(uploadLicense));

export default router;
