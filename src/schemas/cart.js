import joi from 'joi'

const postCartSchema = joi.object({
    userId: joi.number().positive().allow(null),
    visitorToken: joi.string().min(36).max(36),
    itemId: joi.number().positive().required(),
    quantity: joi.number().positive().required(),
});

const putCartQtySchema = joi.object({
    clientType: joi.string().min(4).max(7).required(),
    token: joi.string().min(36).max(36).required(),
    itemId: joi.number().positive().required(),
    quantity: joi.number().positive().required(),
});

const getClientCartSchema = joi.object({
    userId: joi.number().positive(),
    visitorToken: joi.string().min(36).max(36),
});

const deleteClientCartSchema = joi.object({
    clientType: joi.string().min(4).max(7).required(),
    token: joi.string().min(36).max(36).required(),
});

const deleteItemFromClientCartSchema = joi.object({
    clientType: joi.string().min(4).max(7).required(),
    token: joi.string().min(36).max(36).required(),
    itemId: joi.number().positive().required(),
});

const putCartTransferSchema = joi.object({
    userId: joi.number().positive().required(),
    visitorToken: joi.string().min(36).max(36).required(), 
});

export {
    postCartSchema,
    putCartQtySchema,
    getClientCartSchema,
    deleteClientCartSchema,
    deleteItemFromClientCartSchema,
    putCartTransferSchema,
}