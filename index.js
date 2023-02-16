import express from 'express';
import cors from 'cors';
import {createRequire} from "module";
import swaggerUi from 'swagger-ui-express';
import computedcosts from "./routes/computedcost.js";
import cost from "./routes/cost.js";
import statistics from "./routes/statistic.js";
import user from "./routes/user.js";
import auth from "./routes/auth.js";

const require = createRequire(import.meta.url);

const swaggerDocument = require('./swagger.json')


const app = express();
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())



app.listen(9000, () => {
  console.log("Server running on port 9000");
});
// routes
app.use('/computedcosts/user', computedcosts)
app.use('/cost/user', cost)
app.use('/computedcosts-statistics/user', statistics)
app.use('/user', user)
app.use('/is_authorize',auth)

