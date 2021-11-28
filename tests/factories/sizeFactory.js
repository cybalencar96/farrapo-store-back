import faker from 'faker';

function getInvalidSize(validBody) {
    let invalidSize = faker.lorem.word(2);
    while (invalidSize === validBody.sizeName) {
        invalidSize = faker.lorem.word(2);
    }
    return invalidSize;
}

export {
    getInvalidSize,
}
