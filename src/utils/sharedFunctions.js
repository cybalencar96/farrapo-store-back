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


export {
    randomIntFromInterval,
    areDuplicatesInArray,
    removeDuplicatesInArray,
    translateDiacriticsQuery,
}