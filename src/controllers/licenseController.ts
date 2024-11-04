import { Request, Response } from 'express';
import Tesseract from 'tesseract.js';
import { unlink } from 'fs';
import { License } from '../models/license';
import sharp from 'sharp';


export const uploadLicense = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded');
            return;
        }

        const { path } = req.file;

        // Preprocessing the image using sharp
        const processedPath = `${path}-processed.png`;
        await sharp(path)
            .resize(1024) // Resize image to width of 1024px, keeping aspect ratio
            .grayscale() // Convert to grayscale
            .toFile(processedPath);

        // Perform OCR on the preprocessed image
        const result = await Tesseract.recognize(processedPath, 'eng', { logger: m => console.log(m) });
        const text = result.data.text;

        console.log('OCR Text:', text);  // Log OCR text 

        // Extracting each field using  regex
        const dlNumber = text.match(/DL\s*No\s*([A-Z0-9]+\s+\d+)/)?.[1]?.trim();
        const name = text.match(/Name\s*([A-Z\s]+)\n/)?.[1]?.trim();
        const relation = text.match(/S\/DMW of\s*([A-Z\s]+)/)?.[1]?.trim();
        const address = text.match(/Add\s*([\s\S]*?)\s*PIN\s*\d{6}/)?.[1]
            ?.replace(/\n/g, ' ')
            .replace(/[:]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const dob = text.match(/DOB\s*=\s*(\d{2}-\d{2}-\d{4})/)?.[1]?.trim();
        const bloodGroup = text.match(/BG\s*([A-Z+-]+)/)?.[1]?.trim();
        const issuedOn = text.match(/DOI\s*[*-]\s*(\d{2}-\d{2}-\d{4})/)?.[1]?.trim();
        const validTill = text.match(/Valid Till\s*-\s*(\d{2}-\d{2}-\d{4})/)?.[1]?.trim();


        // Logging extracted fields to verify accuracy
        console.log({ dlNumber, name, relation, address, dob, bloodGroup, issuedOn, validTill });

        // Check for required fields
        if (!name || !dlNumber) {
            res.status(400).json({
                message: 'Required fields missing',
                errors: {
                    name: name ? undefined : 'Name is required',
                    dlNumber: dlNumber ? undefined : 'DL Number is required',
                }
            });
            return;
        }

        // Save to database
        const newLicense = new License({
            name,
            relation,
            address,
            dob,
            bloodGroup,
            dlNumber,
            issuedOn,
            validTill
        });

        await newLicense.save();

        // Delete the uploaded file to save space
        unlink(path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        res.status(201).json({ message: 'License data saved', data: newLicense });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Failed to process document' });
    }
};
