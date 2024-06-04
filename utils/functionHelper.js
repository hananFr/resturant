export const throwError = (err, status = 500) => {
  const error = new Error(err);
  error.status = status;
  throw error;
}

export const compareObjects = (reqBody, dbObj) => {
  Object.keys(reqBody).map(key => dbObj[key] = reqBody[key]);
}