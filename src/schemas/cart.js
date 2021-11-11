import joi from 'joi'

const postCartSchema = joi.object({
    userId: joi.number().positive(),
    visitorId: joi.string().min(36).max(36),
    itemId: joi.number().positive().required(),
    quantity: joi.number().positive().required(),
});

const putCartQtySchema = joi.object({
    cartId: joi.number().positive().required(),
    quantity: joi.number().positive().required(),
});

const getClientCartSchema = joi.object({
    userId: joi.number().positive(),
    visitorId: joi.string().min(36).max(36),
});

export {
    postCartSchema,
    putCartQtySchema,
    getClientCartSchema,
}