import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUploadRoutes from "./routes/fileUploadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import connectMongodb from "./connection.js";


dotenv.config();
const PORT=process.env.PORT || 5000;
const MONGO_URI=process.env.MONGO_URI;
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));


app.use("/api/upload", fileUploadRoutes);
app.use("/api/ai", aiRoutes);
app.get("/",(req, res) => {res.status(200).json({"message":"backend working"});});
app.listen(PORT, () => console.log("Server running on port 5000"));
connectMongodb(MONGO_URI);
