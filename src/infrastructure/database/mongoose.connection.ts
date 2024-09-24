import mongoose from "mongoose";

export const connectionDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB || "");
    console.log("Conectado a MongoDb");
  } catch (error) {
    console.error("Error conectando a la base de datos: ", error);
  }
};
