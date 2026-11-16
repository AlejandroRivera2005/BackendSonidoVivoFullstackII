require('dotenv').config();
const app = require('./src/app');
const { inicializar } = require('./src/config/db');
const { leerConfigJwt } = require('./src/config/jwt');
const PORT = process.env.PORT || 3000;

Promise.resolve()
  .then(leerConfigJwt) 
  .then(inicializar)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API Express lista en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  });