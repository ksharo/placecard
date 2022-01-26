const express = require("express");
const app = express();
const configRoutes = require("./src/routes");
const PORT = 3001;

require("dotenv").config();

app.use(express.json());
configRoutes(app);

app.listen(PORT, () => {
    console.log(`API Server is running at http://localhost:${PORT}`);
});