import mongoose, { Schema, type Model } from 'mongoose';

export interface IPhysician {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hospital: string;
  specialty?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const physicianSchema = new Schema<IPhysician>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    specialty: { type: String, trim: true },
    remark: { type: String, trim: true },
  },
  { timestamps: true }
);

const Physician: Model<IPhysician> =
  mongoose.models.Physician || mongoose.model<IPhysician>('Physician', physicianSchema);

export default Physician;
