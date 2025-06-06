// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
  });
};
