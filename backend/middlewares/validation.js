import Joi from 'joi';

export const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
      }),
    age: Joi.number().min(1).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    healthId: Joi.string().optional(),
    emergencyContact: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
      relationship: Joi.string().required()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

export const validateUserLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).max(50),
    age: Joi.number().min(1).max(120),
    gender: Joi.string().valid('male', 'female', 'other'),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    emergencyContact: Joi.object({
      name: Joi.string(),
      phone: Joi.string().pattern(/^[0-9]{10}$/),
      relationship: Joi.string()
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};