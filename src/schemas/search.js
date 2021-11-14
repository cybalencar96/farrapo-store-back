import joi from "joi";

const rawSearchParamsSchema = joi.object({
    searchedName:  joi.string().required(),
    categories:  joi.string().required(),
    colors:  joi.string().required(),
    sizes:  joi.string().required(),
    price:  joi.string().required(),
    orderBy:  joi.string().required(),
});

function areRawSearchParamsValid(rawSearchParams) {
    const validationError = rawSearchParamsSchema.validate(rawSearchParams).error;
    if (validationError) {
        return false;
    }
    return true;
}

export {
    areRawSearchParamsValid,

}