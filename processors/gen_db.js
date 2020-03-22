const csv = require('csv-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const turf = require('@turf/turf');

const muniProv = require(`./municipalitiesProv.json`);

municipalities = {};
let journeys = [];

muniProv.features.forEach((muni) => {
    municipalities[muni.properties.id] = {
        point: turf.point([parseFloat(muni.geometry.coordinates[0][0]), parseFloat(muni.geometry.coordinates[0][1])]).geometry,
        name: muni.properties.municipality,
        province: muni.properties.Provincia,
        country: muni.properties.FID.substring(0, 2)
    }
});

const otros = {
    point: turf.point([parseFloat(8), parseFloat(50)]).geometry,
    name: 'Otros',
    province: 'Otros',
    country: 'Otros'
}

const uri = "mongodb+srv://admin:admin123@blablaviewertest-exjko.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

/**
 * Uploads the data to the database
 */
client.connect(() => {
    fs.createReadStream('DATOS_BLABLACAR_norm1.txt')
        .pipe(csv({ separator: '|' }))
        .on('data', (data) => {
            let journey = data;

            let origenSlug = journey.ORIGEN.split(' ').join('-');
            let destinoSlug = journey.DESTINO.split(' ').join('-');

            if (!isNaN(journey.IMP_KM)) {
                journey.IMP_KM = parseFloat(journey.IMP_KM).toFixed(3);

                journey.DIA = new Date(`${journey.DIA.substring(6, 10)}-${journey.DIA.substring(3, 5)}-${journey.DIA.substring(0, 2)}`);
                journey.ORIGEN_C = origenSlug in municipalities ? municipalities[origenSlug].point : otros.point;
                journey.DESTINO_C = destinoSlug in municipalities ? municipalities[destinoSlug].point : otros.point;
                journey.ORIGEN_P = origenSlug in municipalities ? municipalities[origenSlug].province : otros.province;
                journey.DESTINO_P = destinoSlug in municipalities ? municipalities[destinoSlug].province : otros.province;
                journey.ORIGEN_S = origenSlug in municipalities ? municipalities[origenSlug].country : otros.country;
                journey.DESTINO_S = destinoSlug in municipalities ? municipalities[destinoSlug].country : otros.country;
                journey.ASIENTOS_OFERTADOS = parseInt(journey.ASIENTOS_OFERTADOS);
                journey.ASIENTOS_CONFIRMADOS = parseInt(journey.ASIENTOS_CONFIRMADOS);
                journey.VIAJES_OFERTADOS = parseInt(journey.VIAJES_OFERTADOS);
                journey.VIAJES_CONFIRMADOS = parseInt(journey.VIAJES_CONFIRMADOS);
                journey.OFERTANTES = parseInt(journey.OFERTANTES);
                journey.OFERTANTES_NUEVOS = parseInt(journey.OFERTANTES_NUEVOS);
                delete journey.PAIS;

                journeys.push(journey);
            }
        })
        .on('end', () => {
            console.log('Completado');
            const collection = client.db('test').collection("Journeys");
            collection.insertMany(journeys).then(() => {
                client.close();
            });
        });
});