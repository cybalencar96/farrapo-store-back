import faker from 'faker';

function getInvalidColor(validBody) {
    let invalidColor = faker.vehicle.color();
    while (invalidColor === validBody.colorName) {
        invalidColor = faker.vehicle.color();
    }
    return invalidColor;
}

function getFakeHexCode() {
    return faker.datatype.hexaDecimal(6).substring(2);
}

export {
    getInvalidColor,
    getFakeHexCode,
}
