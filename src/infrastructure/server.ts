import cors from "cors";
import {
  saveFaceIdController,
  getFormUrlController,
  postFormUrlController,
} from "../adapters/controllers/student.controller";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/saveFaceId", saveFaceIdController);
app.get("/api/form-url", getFormUrlController);
app.post("/api/saveFormUrl", postFormUrlController);

export default app;
