import { StudenModel } from "../../domain/student.entity";

export const getFormUrl = async (name: string): Promise<string | null> => {
  const student = await StudenModel.findOne({ name });
  return student?.formUrl || null;
};
