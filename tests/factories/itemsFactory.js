import faker from 'faker';
import { randomIntFromInterval } from '../../src/utils/sharedFunctions.js';
import { getFakeCategories } from './categoryFactory.js';
import { getFakeHexCode } from './colorFactory.js';

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

function getRandomNumberOfFiltersAndItens() {
    const numberOfitems = randomIntFromInterval(15, 45);
    const [items, categories, sizes, colors, names] = [[], [], [], [], []];
    for (let i = 0; i < numberOfitems; i++) {
        const validBody = getValidInsertionItemsBody()
        items.push(validBody);
        validBody.categories.forEach(category => {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });
        if (!sizes.includes(validBody.sizeName)) {
            sizes.push(validBody.sizeName);
        }
        if (!colors.map( ({colorName}) => colorName ).includes(validBody.colorName)) {
            const previousSize = colors.length;
            while (colors.length === previousSize) {
                const fakeHexCode = getFakeHexCode();
                if (!colors.find(({ hexCode }) => hexCode === fakeHexCode)) {
                    colors.push({colorName: validBody.colorName, hexCode: fakeHexCode});
                }
            }
        }
        names.push(validBody.name);
    }
    return { items, categories, sizes, colors, names };
}

export {
    getValidInsertionItemsBody,
    getRandomNumberOfFiltersAndItens,
}
