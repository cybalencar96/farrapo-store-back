import faker from 'faker';
import generatePassword from './generatePassword';

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const scrmRegex = /[0-9]{2}\.[A-Z]{2}\.[0-9]{6}/;
const invalidScrmRegex = /[0-9]{3}\.[A-Z]{2}\.[0-9]{2}/;
const siteRegex = /[A-Z]{3,4} [A-Z]{2,3}/;

function generateValidGenderName() {
    const randomInt = randomIntFromInterval(1,3)
    if (randomInt === 1) return 'not_said';
    if (randomInt === 2) return 'male';
    if (randomInt === 3) return 'female';
}

function getFakeUser(genderId) {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: generatePassword(),
        zipCode: randomIntFromInterval(10000000,99999999),
        streetNumber: randomIntFromInterval(1, 10000),
        complement: faker.lorem.words(3),
        phone: String(randomIntFromInterval(100000000, 999999999)),
        genderName: generateValidGenderName(),
        genderId: randomIntFromInterval(1,3), // for .tests purposes
        birthDate: randomIntFromInterval(1, Date.now()),
        imageUrl: faker.image.animals(),
    };
}

function getInvalidFakeUser() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: generatePassword(),
    };
}


export {
    getFakeUser,
    getInvalidFakeUser,
};
