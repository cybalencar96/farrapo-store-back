import joi from 'joi';

const itemsSchema = joi.object ({
    name: joi.string().min(3).max(255).required(),
    description:  joi.string().min(3).required(),
    price: joi.number().min(0).precision(2),
    colorName: joi.string().min(3).required(),
    sizeName: joi.string().min(1).required(),
    quantity: joi.number().min(0).precision(0).required(),
    imageUrl: joi.string().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/).required(),
    categories: joi.array().items(joi.string().min(3)).required(),
})

export {
    itemsSchema,
}