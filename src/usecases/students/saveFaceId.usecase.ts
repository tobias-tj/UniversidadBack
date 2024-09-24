import { StudenModel } from "../../domain/student.entity";

export const saveFaceId = async (
  name: string,
  faceId: string
): Promise<void> => {
  const student = new StudenModel({ name, faceId });
  await student.save();
};
