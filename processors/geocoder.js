const csv = require('csv-parser');
const fs = require('fs');
const fetch = require('node-fetch');

let municipalities = {};
let promisesList = [];

/*
q: string - Criterio de busqueda
*/
let geoCodeData = async(municipalityObject) => {

    let criteria = municipalityObject.mun;
    let url = new URL("https://open.mapquestapi.com/nominatim/v1/search.php"),
        params = {
            q: criteria,
            format: 'json',
            key: 'amGyLgneTX76yHuXoAe94xFL2WOdfEkZ'
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url.href).then((res) => {
        return res.json();
    }).then((res) => {
        municipalities[criteria.split(' ').join('-')]['lon'] = res[0].lon;
        municipalities[criteria.split(' ').join('-')]['lat'] = res[0].lat;
    });
};

fs.createReadStream('DATOS_PRUEBA.txt')
    .pipe(csv({ separator: '|' }))
    .on('data', (data) => {
        municipalities[data.ORIGEN.split(' ').join('-')] = { mun: data.ORIGEN };
        municipalities[data.DESTINO.split(' ').join('-')] = { mun: data.DESTINO };
    })
    .on('end', async() => {
        Object.keys(municipalities).forEach((municipality) => {
            promisesList.push(geoCodeData(municipalities[municipality]));
        });
        await Promise.all(promisesList);
        console.log(municipalities);
    });