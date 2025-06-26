// const Joi = require('joi');

// // Schema to validate user input
// const validateUser = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//   });

//   return schema.validate(data);
// };


const Joi = require('joi');

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

module.exports = validateUser;
