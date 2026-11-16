const largoMinimoSecreto = 32;
const expiraPorDefecto = 3600; 

function leerConfigJwt() {
  const secreto = process.env.JWT_SECRET;
  if (!secreto || secreto.length < largoMinimoSecreto) {
    throw new Error(
      `JWT_SECRET debe definirse en .env con al menos ${largoMinimoSecreto} caracteres.`
    );
  }

  const expira = Number(process.env.JWT_EXPIRA_SEGUNDOS) || expiraPorDefecto;
  return { secreto, expira };
}

module.exports = { leerConfigJwt };