import express, { Application } from "express";
// import NodeCache from "node-cache";
import cors from "cors";
// import { errorMiddleware } from "./middlewares/error";


// Importing Routes
import licenseRoutes from "./routes/licenseRoutes";
// import userRoute from "./routes/user";

const app: Application = express();


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});

// Using Routes
// app.use("/api/v1/user", userRoute);
app.use('/api/v1/license', licenseRoutes);



app.use("/uploads", express.static("uploads"));
// app.use(errorMiddleware);

export default app