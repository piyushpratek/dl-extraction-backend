import mongoose, { Document, Schema } from 'mongoose';

interface ILicense extends Document {
    name: string;
    relation: string; // "S/W/D of" field
    address: string;
    dob: string;
    dlNumber: string;
    issuedOn: string;
    validTill: string;
}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    relation: { type: String },
    address: { type: String },
    dob: { type: String },
    dlNumber: { type: String, required: true },
    bloodGroup: { type: String },
    issuedOn: { type: String },
    validTill: { type: String }
}, {
    timestamps: true,
});

export const License = mongoose.model<ILicense>('License', schema);

