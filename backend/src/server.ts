declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Assuming UserDocument is the type of your user object
      /* dbClient?: string;
      originalUrl: string; */
      cookies: Record<string, any>;
      secret?: string | undefined;
      signedCookies: Record<string, any>;
      originalUrl: string;
    }
  }
}
import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { IUser } from "./@types";
// @ts-ignore
import { getGameById } from "./utils/getGameById.js";
/* declare  module "express" {
  interface Request {
    user?: IUser;
  }
} */
connectDB();
/* import connectDb from "./config/db.js";
import { getUser } from "./models/userModel.js";
 */

/* ";
import customerRoutes from "./routes/customerRoutes.js";
import carsRoutes from "./routes/carRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import officeRoutes from "./routes/officeRoutes.js";
 */

//adding the .env const to process.env
dotenv.config();

let port = process.env.PORT || 5200;
const app = express();

//to parse row json and access the body of req
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV === "development") {
        // Allow requests with no origin (like mobile apps or curl requests)
        // and in development environment from localhost
        callback(null, true);
      } else {
        // Allow all other origins
        callback(null, origin);
      }
    },
    //process.env.NODE_ENV != "development" ? "" : "http://localhost:5174",
    credentials: true,
  })
);

// Middleware to attach the db client to the request object
app.use((req: Express.Request, res, next) => {
  console.log("req");
  next();
});
app.use("/api/users", userRoutes);
app.get("/chess.com/game/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  getGameById(gameId).then((game: any) => {
    res.send(JSON.stringify(game));
  });
});
//app.options("/api/users/auth", cors());
/* 
app.use("/api/customers", customerRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/offices", officeRoutes); */

/* if (process.env.NODE_ENV == "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} */
app.get("/", (req, res) => {
  console.log("anas");
  res.send("server is ready");
});
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
