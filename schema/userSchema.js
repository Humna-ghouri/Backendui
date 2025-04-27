// userSchema.js (Using Joi for validation)
const Joi = require('joi');

// Schema to validate user input
const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
