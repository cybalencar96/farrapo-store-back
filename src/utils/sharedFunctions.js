function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function areDuplicatesInArray(array) {
    return array.length !== new Set(array).size
}

export {
    randomIntFromInterval,
    areDuplicatesInArray
}