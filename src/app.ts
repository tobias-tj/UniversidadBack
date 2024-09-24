import dotenv from "dotenv";
import app from "./infrastructure/server";
import { connectionDatabase } from "./infrastructure/database/mongoose.connection";

dotenv.config();

const startServer = async () => {
  await connectionDatabase();
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
