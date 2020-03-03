const path = require('path');

let sample = '<U+0406><U+0432><U+0430><U+043D><U+043E>-<U+0424><U+0440><U+0430><U+043D><U+043A><U+0456><U+0432><U+0441><U+044C><U+043A><U+0430> <U+043C><U+0456><U+0441><U+044C><U+043A><U+0430> <U+0440><U+0430><U+0434><U+0430>'
let getCharacterFromUnicode = (unicodeChar) => {
    return String.fromCharCode(parseInt(unicodeChar, 16));
}

let reg = '\<U\+[0-9A-F]{4}\>'
let processUnicodeString = (unicodeString) => {
    let decodedResult = unicodeString;
    let result = Array.from(unicodeString.matchAll('\<U[+]04[0-9A-F]{2}\>'));
    result.forEach((value) => {
        let asciiChar = getCharacterFromUnicode(value[0].substring(3, 7));
        decodedResult = decodedResult.replace(value[0], asciiChar);
    });
    return decodedResult;
}

let decodedString = processUnicodeString(processUnicodeString(sample));
console.log(decodedString);