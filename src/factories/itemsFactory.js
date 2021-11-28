import faker from 'faker';
import { randomIntFromInterval } from '../utils/sharedFunctions.js';
import { getFakeCategories } from './categoryFactory.js';

function getValidInsertionItemsBody() {
    return ({
        name: faker.lorem.words(3),
        description: faker.lorem.words(6),
        price: randomIntFromInterval(0, 10000)/100,
        colorName: faker.vehicle.color(),
        sizeName: faker.lorem.word(3),
        quantity: randomIntFromInterval(1, 100),
        imageUrl: faker.image.fashion() + ".png",
        categories: getFakeCategories(),
    });
}

export {
    getValidInsertionItemsBody,
}
