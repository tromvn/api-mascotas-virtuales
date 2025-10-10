const app = require('./src/app/app');
const { dbConnection } = require('./src/database/connection');
const port = 3000;

dbConnection();

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});