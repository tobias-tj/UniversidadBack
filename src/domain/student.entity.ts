import { Schema, model, Document } from "mongoose";

export interface Student extends Document {
  name: string;
  faceId?: string;
  formUrl?: string;
}

const StudentSchema = new Schema<Student>({
  name: { type: String, required: true },
  faceId: { type: String, required: false },
  formUrl: { type: String, required: false },
});

export const StudenModel = model<Student>("Student", StudentSchema);
