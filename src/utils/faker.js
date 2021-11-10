import faker from 'faker';
import generatePassword from './generatePassword.js';
import { randomIntFromInterval } from './sharedFunctions.js';

function generateValidGenderName() {
    const randomInt = randomIntFromInterval(4,6)
    if (randomInt === 4) return 'not_said';
    if (randomInt === 5) return 'male';
    if (randomInt === 6) return 'female';
}

function getFakeUuid() {
    return faker.datatype.uuid()
}

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
        genderId: randomIntFromInterval(4,6), // for .tests purposes
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

function getFakeHexCode() {
    return faker.datatype.hexaDecimal(6).substring(2);
}

function getFakeCategories() {
    const numberOfCategories = randomIntFromInterval(3, 6);
    const categories = [];
    for (let i = 0; i < numberOfCategories; i++) {
        let counter = 0;
        while (categories.length !== i + 1) {
            const fakeCategory = faker.lorem.word(randomIntFromInterval(3, 10));
            if (!categories.includes(fakeCategory)) {
                categories.push(fakeCategory);
            }
        }
    }
    return categories;
}

function getValidInsertionItemsBody() {
    return ({
        name: faker.lorem.words(3),
        description: faker.lorem.words(6),
        price: randomIntFromInterval(0, 10000)/100,
        colorName: faker.vehicle.color(),
        sizeName: faker.lorem.word(2),
        quantity: randomIntFromInterval(1, 100),
        imageUrl: faker.image.fashion() + ".png",
        categories: getFakeCategories(),
    });
}

function getInvalidColor(validBody) {
    let invalidColor = faker.vehicle.color();
    while (invalidColor === validBody.colorName) {
        invalidColor = faker.vehicle.color();
    }
    return invalidColor;
}

function getInvalidSize(validBody) {
    let invalidSize = faker.lorem.word(2);
    while (invalidSize === validBody.sizeName) {
        invalidSize = faker.lorem.word(2);
    }
    return invalidSize;
}

function getInvalidCategory(validBody) {
    let invalidCategory = faker.lorem.word(randomIntFromInterval(3, 10));
    while (validBody.categories.includes(invalidCategory)) {
        invalidCategory = faker.lorem.word(randomIntFromInterval(3, 10));
    }
    return invalidCategory;
}

export {
    getFakeUser,
    getInvalidFakeUser,
    getValidInsertionItemsBody,
    getFakeHexCode,
    getInvalidColor,
    getInvalidSize,
    getInvalidCategory,
    getFakeUuid,
};
