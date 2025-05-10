import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbService } from "./services/db/index.js";
import { router } from "./routers/index.js";
import { errorHandler } from "./middlwares/error-handler.js";
const PORT = process.env.PORT || 3000;
const whitelistedDomains = process.env.WHITELISTED_DOMAINS.split(',');
const app = express();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const originIsWhitelisted = whitelistedDomains.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    },
  })
);
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
