const fs = require('fs');
const fetch = require('node-fetch');
const turf = require('@turf/turf');

const num_max_geoCodeReqs = 10;
const numList = 6;
let waitingFetch = 0;
let currentReqs = 0;
let featuresList = [];
let json_data = '';
let apiKey = ['3MhgH4GyfQ0GUNDpse9rHoh8iewHexFk',
    'HacsHpGzBVm1KpBUAACv2A7x2L9AGbSV',
    'Gd4svebgO3xoa4j25JRuHGAe2IQMIpq5',
    'LRiud7G3ClQyXugehSo1lZF3igG4yW7l',
    'bMWUXiWT9TK4Yt5RofvAkxj1OAuHs4xQ',
    'dNT9MRdmqkALT9istlck0SgAzzrsa87U'
];

/*
q: string - Criterio de busqueda
*/
let geoCodeData = (criteria, apiIndex) => {

    if (currentReqs >= num_max_geoCodeReqs) {
        setTimeout(geoCodeData, 500, criteria, apiIndex);
    } else {
        currentReqs++;
        let url = new URL("https://open.mapquestapi.com/nominatim/v1/search.php"),
            params = {
                q: criteria,
                format: 'json',
                key: apiKey[apiIndex]
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return fetch(url.href).then((res) => {
            return res.json();
        }).then((res) => {
            // Se crea una feature de tipo punto en formato geojson y se guarda en una lista de features
            let lon = res && res[0] && res[0].lon ? parseFloat(res[0].lon) : 0;
            let lat = res && res[0] && res[0].lon ? parseFloat(res[0].lat) : 0;
            let feature = turf.feature(turf.point([lon, lat]).geometry, { id: criteria.split(' ').join('-'), 'municipality': criteria });
            featuresList.push(feature);
            return;
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            currentReqs--;
            waitingFetch--;
            if (waitingFetch == 0) {
                let writer = fs.createWriteStream('municipalities.json', { encoding: 'utf8' });
                writer.write(JSON.stringify(turf.featureCollection(featuresList)));
                console.log('terminado');
            }
        });
    }
};

[...Array(numList).keys()].forEach((num) => {
    json_data = require(`./munList${num+1}.json`);
    waitingFetch += json_data.data.length;
    json_data.data.forEach((municipality) => {
        geoCodeData(municipality, num);
    });
});