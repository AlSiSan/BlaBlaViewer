const csv = require('csv-parser');
const fs = require('fs');

// Se incluyen nombres en cirílico que están en formato UNICODE
// Deben transformarse

/*
unicodeChar: string - Carácter en unicode
*/
let getCharacterFromUnicode = (unicodeChar) => {
    return String.fromCharCode(parseInt(unicodeChar, 16));
}

/*
unicodeString: string - Cadena de texto en la que se buscan carácteres unicode
*/
let processUnicodeString = (unicodeString) => {
    let decodedResult = unicodeString;
    let result = Array.from(unicodeString.matchAll('\<U[+][0-9A-F]{4}\>'));
    result.forEach((value) => {
        let asciiChar = getCharacterFromUnicode(value[0].substring(3, 7));
        decodedResult = decodedResult.replace(value[0], asciiChar);
    });
    return decodedResult;
}

// Se incluyen nombres en cirílico que están en formato UNICODE
// Deben transformarse

//Comienza a escribirse el resultado
writer = fs.createWriteStream('DATOS_BLABLACAR_norm1.txt');
writer.write('"DIA"|"PAIS"|"ORIGEN"|"DESTINO"|"IMP_KM"|"ASIENTOS_OFERTADOS"|"ASIENTOS_CONFIRMADOS"|"VIAJES_OFERTADOS"|"VIAJES_CONFIRMADOS"|"OFERTANTES"|"OFERTANTES_NUEVOS"\n')

//Comienza la lectura del fichero original
fs.createReadStream('DATOS_BLABLACAR.txt')
    .pipe(csv({ separator: '|' }))
    .on('data', (data) => {
        let journey = data;
        journey.ORIGEN = processUnicodeString(journey.ORIGEN);
        journey.DESTINO = processUnicodeString(journey.DESTINO);
        journey.PAIS = journey.PAIS.toUpperCase();
        // if (journey.ORIGEN == 'NA' || journey.PAIS == 'NA' || journey.DESTINO == 'NA') console.log(true);

        // Se escriben los resultados normalizados
        writer.write(`"${journey.DIA}"|"${journey.PAIS}"|"${journey.ORIGEN}"|"${journey.DESTINO}"|${journey.IMP_KM}|${journey.ASIENTOS_OFERTADOS}|${journey.ASIENTOS_CONFIRMADOS}|${journey.VIAJES_OFERTADOS}|${journey.VIAJES_CONFIRMADOS}|${journey.OFERTANTES}|${journey.OFERTANTES_NUEVOS}\n`);

    })
    .on('end', () => {
        console.log('Completado');
    });