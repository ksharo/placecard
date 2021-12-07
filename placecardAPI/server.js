const express = require("express");
const app = express();
const configRoutes = require("./src/routes");
const PORT = 3001;

app.use(express.json());
configRoutes(app);

app.listen(PORT, () => {
    console.log(`API Server is running at http://localhost:${PORT}`);
});