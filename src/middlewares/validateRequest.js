
function validateBody(schema) {
    return function(req, res, next) {
        const bodyError = schema.validate(req.body).error;
        if (bodyError) {
            return res.status(400).send(bodyError.details[0].message);
        }
        
        next();
    }
}

function validateHeaders(schema) {
    return function(req, res, next) {
        const bodyError = schema.validate(req.headers).error;
        if (bodyError) {
            return res.status(401).send(bodyError.details[0].message);
        }
        
        res.locals.token = req.headers.authorization.replace('Bearer ','')
        next();
    }
}

function validateParams(schema) {
    return function(req, res, next) {
        const bodyError = schema.validate(req.params).error;
        if (bodyError) {
            return res.status(400).send(bodyError.details[0].message);
        }
        
        next();
    }
}

export {
    validateBody,
    validateHeaders,
    validateParams,
}