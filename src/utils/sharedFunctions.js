import { getValidInsertionItemsBody } from '../factories/itemsFactory.js';
import { getFakeHexCode } from '../factories/colorFactory.js';

function randomIntFromInterval(min, max) {  //min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function areDuplicatesInArray(array) {
    return array.length !== new Set(array).size
}

function removeDuplicatesInArray(arr) {
    return arr.filter((item, idx) => {
        return arr.indexOf(item) == idx;
    })
}

function translateDiacriticsQuery(variable) {
    const specialCharacters = "ÁÉÍÓÚáéíóúâêîôûàèìòùÇç".split('').join(",");
    const charactersToReplace = "AEIOUaeiouaeiouaeiouCc".split('').join(",");
    return `translate(${variable},'${specialCharacters}','${charactersToReplace}')`;
}

function lowerCaseWithoutDiacritics(string) {
    const specialCharacters = "ÁÉÍÓÚáéíóúâêîôûàèìòùÇç";
    const charactersToReplace = "AEIOUaeiouaeiouaeiouCc";
    const arrayToBeJoined = [];
    string.split("").forEach(character => {
        if (specialCharacters.includes(character)) {
            const characterIndex = specialCharacters.indexOf(character);
            arrayToBeJoined.push(charactersToReplace[characterIndex]);
        } else {
            arrayToBeJoined.push(character)
        }
    })
    return arrayToBeJoined.join("").toLowerCase();
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
    randomIntFromInterval,
    areDuplicatesInArray,
    removeDuplicatesInArray,
    translateDiacriticsQuery,
    lowerCaseWithoutDiacritics,
    getRandomNumberOfFiltersAndItens,
}