import Joi from "joi";

const signIn = Joi.object().keys({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  signIn,
};
