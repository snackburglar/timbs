function validateBody(schema) {
  return (req, res, next) => {
    // validate and clean the payload once before it reaches a route handler.
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => detail.message),
      });
    }
    req.body = value;
    return next();
  };
}

module.exports = validateBody;
