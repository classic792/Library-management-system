import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().lowercase().email().required(),
  alias: Joi.string().trim().min(2).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Confirm password must match password" }),
  role: Joi.string().valid("admin", "member").default("member"),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().trim().required(),
  password: Joi.string().required(),
});

export const bookCreateSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  isbn: Joi.string().trim().required(),
  year: Joi.number().integer().min(0).required(),
  totalCopies: Joi.number().integer().min(0).required(),
  availableCopies: Joi.number().integer().min(0),
  imageUrl: Joi.string().trim().uri().allow(""),
});

export const bookUpdateSchema = Joi.object({
  title: Joi.string().trim(),
  author: Joi.string().trim(),
  category: Joi.string().trim(),
  isbn: Joi.string().trim(),
  year: Joi.number().integer().min(0),
  totalCopies: Joi.number().integer().min(0),
  availableCopies: Joi.number().integer().min(0),
  imageUrl: Joi.string().trim().uri().allow(""),
}).min(1);

export const borrowCreateSchema = Joi.object({
  dueDateDays: Joi.number().integer().min(1).max(90).default(14),
});

export const returnCreateSchema = Joi.object({
  condition: Joi.string().valid("good", "damaged", "lost").default("good"),
  fine: Joi.number().min(0).default(0),
});

export const bookIdParamSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
});

export const borrowIdParamSchema = Joi.object({
  borrowId: Joi.string().hex().length(24).required(),
});

export const returnIdParamSchema = Joi.object({
  returnId: Joi.string().hex().length(24).required(),
});
