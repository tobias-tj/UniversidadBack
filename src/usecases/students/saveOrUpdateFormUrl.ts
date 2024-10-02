import { StudenModel } from "../../domain/student.entity";

// Función para guardar o actualizar la URL del formulario
export const saveOrUpdateFormUrl = async (
  name: string,
  formUrl: string
): Promise<void> => {
  // Buscar al estudiante por nombre
  let student = await StudenModel.findOne({ name });

  // Si el estudiante no existe, crear uno nuevo
  if (!student) {
    student = new StudenModel({ name, formUrl });
  } else {
    // Si existe, simplemente actualizar la URL del formulario
    student.formUrl = formUrl;
  }

  // Guardar el estudiante actualizado en la base de datos
  await student.save();
};
