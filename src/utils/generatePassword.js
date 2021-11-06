/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
export default function generatePassword(numLc, numUc, numDigits, numSpecial) {
    numLc = numLc || 4;
    numUc = numUc || 4;
    numDigits = numDigits || 4;
    numSpecial = numSpecial || 2;

    const lcLetters = 'abcdefghijklmnopqrstuvwxyz';
    const ucLetters = lcLetters.toUpperCase();
    const numbers = '0123456789';
    const special = '!?=#*$@+-.';

    const getRand = (values) => values.charAt(Math.floor(Math.random() * values.length));
     
    // + Jonas Raoni Soares Silva
    // @ http://jsfromhell.com/array/shuffle [v1.0]
    
    function shuffle(o) {
        // v1.0
        for (
            let j, x, i = o.length;
            i;
            j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
        );
        return o;
    }

    const pass = [];
    for (let i = 0; i < numLc; ++i) {
        pass.push(getRand(lcLetters));
    }
    for (let i = 0; i < numUc; ++i) {
        pass.push(getRand(ucLetters));
    }
    for (let i = 0; i < numDigits; ++i) {
        pass.push(getRand(numbers));
    }
    for (let i = 0; i < numSpecial; ++i) {
        pass.push(getRand(special));
    }

    return shuffle(pass).join('');
}
