import joi from 'joi'


const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!#=+.%*?&])[A-Za-z\d-@_$!#=+.%*?&]{8,20}$/;
const zipcodeRegex = /[0-9]{8}$/
const phoneRegex = /[0-9]{8,}$/
const imageUrlRegex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/

const minZipCode = 10000000 // 8 char
const maxZipCode = 99999999 // 8 char

const signUpSchema = joi.object ({
    name: joi.string().max(255).required(),
    email:  joi.string().pattern(emailRegex).required(),
    password: joi.string().pattern(passwordRegex).required(),
    zipCode: joi.number().min(minZipCode).max(maxZipCode).required(),
    phone: joi.string().pattern(phoneRegex).max(12).required(),
    genderName: joi.string().allow('not_said', 'male', 'female', 'binary', 'trans').required(),
    genderId: joi.number(),
    birthDate: joi.number().positive().max(Date.now()).required(),
    imageUrl: joi.string().allow(''),
    streetNumber: joi.number().positive().required(),
    complement: joi.string().allow(''),
});

const signInSchema = joi.object ({
    email:  joi.string().required(),
    password: joi.string().required(),
});

const getUserSchema = joi.object ({
    authorization: joi.string().min(43).max(43).required(),
}).unknown();

export {
    signUpSchema,
    signInSchema,
    getUserSchema,
}