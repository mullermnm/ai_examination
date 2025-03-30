export default (key, value = true) => async (req, res, next) => {
  try {
    req.body[key] = value;
    console.log(req.body)
    return next();
  } catch (e) {
    return next();
  }
};
