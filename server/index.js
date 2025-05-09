import express from "express";
import cookieParser from "cookie-parser";
import { dbService } from "./services/db/index.js";
import { router } from "./routers/index.js";
import { errorHandler } from "./middlwares/error-handler.js";
const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.use(errorHandler);

try {
  const res = await dbService.checkConnection();
  console.log(`Connected to the database: ${JSON.stringify(res, null, 2)}`);
} catch(e) {
  console.error(e);
}
