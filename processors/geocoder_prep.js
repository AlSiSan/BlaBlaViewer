const csv = require('csv-parser');
const fs = require('fs');

let municipalities = {};
let municipalitiesList = [];

// Script para dividir en 6 los municipios sin repetir, para geolocalizarlos con una API

fs.createReadStream('DATOS_BLABLACAR_norm1.txt')
    .pipe(csv({ separator: '|' }))
    .on('data', (data) => {
        municipalities[data.ORIGEN.split(' ').join('-')] = { mun: data.ORIGEN };
        municipalities[data.DESTINO.split(' ').join('-')] = { mun: data.DESTINO };
    })
    .on('end', () => {
        municipalitiesList = [];
        let writer = fs.createWriteStream(`munList1.json`, { encoding: 'utf8' });
        Object.keys(municipalities).slice(0, 3430).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));

        let writer = fs.createWriteStream(`munList2.json`, { encoding: 'utf8' });
        municipalitiesList = [];
        Object.keys(municipalities).slice(3430, 3430 * 2).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));

        writer = fs.createWriteStream(`munList3.json`, { encoding: 'utf8' });
        municipalitiesList = [];
        Object.keys(municipalities).slice(3430 * 2, 3430 * 3).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));

        writer = fs.createWriteStream(`munList4.json`, { encoding: 'utf8' });
        municipalitiesList = [];
        Object.keys(municipalities).slice(3430 * 3, 3430 * 4).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));

        writer = fs.createWriteStream(`munList5.json`, { encoding: 'utf8' });
        municipalitiesList = [];
        Object.keys(municipalities).slice(3430 * 4, 3430 * 5).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));

        writer = fs.createWriteStream(`munList6.json`, { encoding: 'utf8' });
        municipalitiesList = [];
        Object.keys(municipalities).slice(3430 * 5, Object.keys(municipalities).length).forEach((key) => {
            municipalitiesList.push(municipalities[key].mun);
        });
        writer.write(JSON.stringify({ data: municipalitiesList }));
    });