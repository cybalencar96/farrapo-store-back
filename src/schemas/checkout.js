import joi from "joi";

const checkoutSchema = joi.object({
    cart: joi.array().items(
        joi.object({
            cartQty: joi.number().required(),
            id: joi.number().required(),
            price: joi.number().required(),
        }).unknown(true)).min(1).required(),
    userData: joi.object({
        name: joi.string().min(3).required(),
        cpf: joi.number().required(),
        adress: joi.string().min(3).required(),
        number: joi.number(),
        complement: joi.string().min(3),
        city: joi.string().min(3).required(),
        state: joi.string().min(2).max(2).required(),
    })
});

const checkoutAuthorizationSchema = joi.object ({
    authorization: joi.string().min(43).max(43).required(),
}).unknown(true);

export {
    checkoutSchema,
    checkoutAuthorizationSchema,
}