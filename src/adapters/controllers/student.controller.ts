import { Request, Response } from "express";
import { getFormUrl } from "../../usecases/students/getFormUrl.usecase";
import { saveFaceId } from "../../usecases/students/saveFaceId.usecase";
import { saveOrUpdateFormUrl } from "../../usecases/students/saveOrUpdateFormUrl";

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

export const getFormUrlController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "El nombre del estudiante es requerido" });
    return;
  }

  try {
    const formUrl = await getFormUrl(name);

    if (formUrl != null) {
      res.status(200).json({ formUrl: formUrl });
    } else {
      res.status(404).json({ message: "Form URL not found for this student" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error para obtener url" });
  }
};

export const postFormUrlController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, formUrl } = req.body; // Recibimos el nombre del estudiante y la URL

  try {
    await saveOrUpdateFormUrl(name, formUrl); // Guardamos o actualizamos la información
    res.status(200).json({ message: "Form URL saved/updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Algo ha salido desde nuestro back para guardar url" });
  }
};
