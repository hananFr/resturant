const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: err.message });
}

export default errorHandler;