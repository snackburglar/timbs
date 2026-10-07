const Joi = require("joi");

// schemas trim and bound input before route handlers store or use it.
const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  category: Joi.string().trim().min(2).max(50).required(),
  price: Joi.number().positive().precision(2).required(),
  initials: Joi.string().trim().min(1).max(4).required(),
  colour: Joi.string()
    .pattern(/^#[0-9a-fA-F]{6}$/)
    .required(),
  description: Joi.string().trim().min(5).max(500).required(),
  available: Joi.boolean().default(true),
}).required();

const newsSchema = Joi.object({
  date: Joi.string().trim().max(40).required(),
  publishedAt: Joi.string().trim().max(40).optional(),
  category: Joi.string().trim().min(2).max(50).required(),
  title: Joi.string().trim().min(3).max(150).required(),
  excerpt: Joi.string().trim().min(5).max(300).required(),
  content: Joi.string().trim().min(10).max(2000).required(),
  initials: Joi.string().trim().min(1).max(4).required(),
  colour: Joi.string()
    .pattern(/^#[0-9a-fA-F]{6}$/)
    .required(),
}).required();

const credentialsSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  // cap password length before passing it to bcrypt.
  password: Joi.string().min(8).max(72).required(),
}).required();

const registrationSchema = credentialsSchema.keys({
  name: Joi.string().trim().min(2).max(80).required(),
});

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().required(),
  message: Joi.string().trim().min(10).max(2000).required(),
}).required();

const newsletterSchema = Joi.object({
  email: Joi.string().trim().email().required(),
}).required();

module.exports = {
  contactSchema,
  credentialsSchema,
  newsletterSchema,
  newsSchema,
  productSchema,
  registrationSchema,
};
