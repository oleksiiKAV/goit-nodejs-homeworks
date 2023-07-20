const validateBody = (schema) => async (req, res, next) => {
    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
  
  module.exports = { validateBody }