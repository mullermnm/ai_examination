import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const addRegisteredByBody = async function (req, res, next) {
  req.body.registeredBy = ObjectId(req.user.id);
  next();
};

export const addBodyField = function (data) {
  return async (req, res, next) => {
    Object.assign(req.body, data);
    next();
  };
}
export const addQueryField = function (data) {
  return async (req, res, next) => {
    Object.assign(req.query, data);
    next();
  };
}
