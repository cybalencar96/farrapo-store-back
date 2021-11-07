
function validateBody(schema) {
    return function(req, res, next) {
        const bodyError = schema.validate(req.body).error;

        if (bodyError) {
            return res.status(400).send(bodyError.details[0].message);
        }
        
        next();
    }
}

export {
    validateBody,
}