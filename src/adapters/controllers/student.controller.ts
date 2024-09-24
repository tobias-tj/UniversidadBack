import { Request, Response } from "express";
import { getFormUrl } from "../../usecases/students/getFormUrl.usecase";
import { saveFaceId } from "../../usecases/students/saveFaceId.usecase";

export const saveFaceIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, faceId } = req.body;

  try {
    await saveFaceId(name, faceId);
    res.status(200).json({ message: "FaceId guardado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error guardando el faceId", error });
  }
};

export const getFormUrlController = (req: Request, res: Response): void => {
  const formUrl = getFormUrl();
  res.json({ url: formUrl });
};
