import faker from 'faker';
import { randomIntFromInterval } from '../../src/utils/sharedFunctions.js';


function getInvalidCategory(validBody) {
    let invalidCategory = faker.lorem.word(randomIntFromInterval(3, 10));
    while (validBody.categories.includes(invalidCategory)) {
        invalidCategory = faker.lorem.word(randomIntFromInterval(3, 10));
    }
    return invalidCategory;
}

function getFakeCategories() {
    const numberOfCategories = 3;
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

export {
    getFakeCategories,
    getInvalidCategory,
}
