import express, { Application } from "express";
import * as path from "path";
import { router as apiRoutes } from "./routes/api.routes";
import { router as webRoutes } from "./routes/web.routes";

// port is now available to the Node.js runtime
// as if it were an environment variable
const app: Application = express();


// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



app.use('/api', apiRoutes)
app.use('/', webRoutes)


export default app
