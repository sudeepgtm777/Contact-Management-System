export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    err.message = messages[0]; // only the custom message
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
