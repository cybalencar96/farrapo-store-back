import faker from 'faker';
import { randomIntFromInterval } from '../../src/utils/sharedFunctions.js';
import { generateValidGenderName } from './genderFactory.js';
import generatePassword from '../../src/utils/generatePassword.js'

function getFakeUser() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: generatePassword(),
        zipCode: randomIntFromInterval(10000000,99999999),
        streetNumber: randomIntFromInterval(1, 10000),
        complement: faker.lorem.words(3),
        phone: String(randomIntFromInterval(100000000, 999999999)),
        genderName: generateValidGenderName(),
        birthDate: randomIntFromInterval(1, Date.now()),
        imageUrl: faker.image.animals() + '.png',
    };
}

function getInvalidFakeUser() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: generatePassword(),
    };
}

function getValidCheckoutUserData() {
    const validUFs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "DO", "MA", "MT",
        "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RR", "SC", "SP", "SE", "TO"];
    return ({
        name: faker.lorem.words(3),
        cpf: randomIntFromInterval(10000000000, 99999999999),
        adress: faker.lorem.words(3),
        number: randomIntFromInterval(1, 1000),
        complement: faker.lorem.words(3),
        city: faker.lorem.words(3),
        state: validUFs[randomIntFromInterval(0, validUFs.length - 1)]
    });
}

function getFakeUuid() {
    return faker.datatype.uuid()
}

function getFakeDate() {
    return faker.date.between("12/31/2012", "12/31/2020");
}

export {
    getFakeUser,
    getInvalidFakeUser,
    getFakeDate,
    getFakeUuid,
    getValidCheckoutUserData,
}