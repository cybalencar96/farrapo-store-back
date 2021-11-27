
function validateBody(schema) {
    return function (req, res, next) {
        const bodyError = schema.validate(req.body).error;
        if (bodyError) {
            return res.status(400).send(bodyError.details[0].message);
        }
        
        next();
    }
}

function validateQuery(schema) {
    return function (req, res, next) {
        const queryError = schema.validate(req.query).error;
        if (queryError) {
            return res.status(400).send(queryError.details[0].message);
        }
        
        next();
    }
}


function validateHeaders(schema) {
    return function(req, res, next) {
        const headersError = schema.validate(req.headers).error;
        if (headersError) {

            return res.status(401).send(headersError.details[0].message);
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

function validateHeadersAndBody(headersSchema, bodySchema) {
    return function (req, res, next) {
        const headersError = headersSchema.validate(req.headers).error;
        if (headersError) {
            return res.status(401).send(headersError.details[0].message);
        }
        
        res.locals.token = req.headers.authorization.replace('Bearer ', '');

        const bodyError = bodySchema.validate(req.body).error;

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
    validateQuery,
    validateHeadersAndBody,
}