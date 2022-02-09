const express = require("express");
const app = express();
const cors = require("cors");
const configRoutes = require("./src/routes");
const PORT = 3001;

global.__basedir = __dirname;

app.use(cors());
app.use(express.json());

configRoutes(app);

app.listen(PORT, () => {
    console.log(`API Server is running at http://localhost:${PORT}`);
});
