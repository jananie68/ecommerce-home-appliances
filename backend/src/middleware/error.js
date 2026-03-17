export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error(error);

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error."
  });
}
