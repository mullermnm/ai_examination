import Joi from "joi";
import ErrorResponse from "../../response/ErrorResponse";

const middleware = (schema, property) => {
  return (req, res, next) => {
    console.info('Validation middleware triggered');
    const { error } = schema.validate(req.body, { abortEarly: false });
    const valid = error == null;
    if (valid) {
      console.info('Validation passed');
      next();
    } else {
      const { details } = error;
      const errors = details.map((error) => {
        return { [error.context.key]: error.message };
      });
      const messages = errors.reduce((obj, item) => (obj[Object.keys(item)[0]] = Object.values(item)[0], obj), {});
      const response = ErrorResponse(messages, 422)
      console.error('Validation failed:', messages);
      res.status(422).json(response);
    }
  };
};
export default middleware;
