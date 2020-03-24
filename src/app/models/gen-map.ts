import OlMap from 'ol/Map';

import OlGeoJSON from 'ol/format/GeoJSON.js';
import OlVectorSource from 'ol/source/Vector.js';

import {Cluster} from 'ol/source';
import OlXYZ from 'ol/source/XYZ';
import OlOSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style.js';

import { Zoom } from 'ol/control';

import { GenLayerGroup, GenTileLayer, GenVectorLayer, HeatMapLayer } from './customLayers/gen-layers';

import LayerSwitcher from 'ol-layerswitcher';

import * as turf from '@turf/turf';

import Legend from 'ol-ext/control/Legend';

import { CommunicationService } from '../services/communication.service';

export class GenMap extends OlMap {

    // pointermove selection
    selection = {};

    // Cache for styles
    styleCache = {
        originC: {},
        destinationC: {}
    };

    wmsLegends = '';

    legend: Legend;
    legendCache = {
        origenC: false,
        destinationC: false,
        journeysLines: false
    };

    constructor( private comm: CommunicationService, opt? ) {
        super({
            target: 'map',
            layers: [
                new GenLayerGroup({
                    type: 'group',
                    title: 'Mapas base',
                    fold: 'open',
                    layers: [
                        new GenTileLayer({
                            name: 'Vacío',
                            title: 'Vacío',
                            type: 'base',
                            visible: false,
                            source: new OlXYZ({
                                url: ''
                            })
                        }),
                        new GenTileLayer({
                            name: 'EsriSatellite',
                            title: 'ArcGIS Satélite',
                            type: 'base',
                            visible: false,
                            source: new OlXYZ({
                                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                                maxZoom: 17
                              })
                        }),
                        new GenTileLayer({
                            name: 'OSM WikiMedia',
                            title: 'OSM WikiMedia',
                            type: 'base',
                            visible: false,
                            source:  new OlXYZ({
                                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=es'
                            })
                        }),
                        new GenTileLayer({
                            name: 'OSM',
                            title: 'OSM',
                            type: 'base',
                            visible: true,
                            source:  new OlOSM()
                        })
                    ],
                    zIndex: 1
                }),
                new GenLayerGroup({
                    title: 'Overlays',
                    type: 'group',
                    fold: 'open',
                    layers: [],
                    zIndex: 10
                }),
                new GenLayerGroup({
                    name: 'Datos',
                    title: 'Datos',
                    type: 'group',
                    fold: 'open',
                    layers: [],
                    zIndex: 20
                })
            ],
            view: opt.view,
            controls: [
                new Zoom()
            ]
        });
        this.loadPopulation();
        this.comm.journeysDfSubject.asObservable().subscribe(() => {
            // Cargas asínscronas
            this.loadLineJourneys(this.comm.journeysDf);
            new Promise(r => setTimeout(r, 1)).then(() => {
                this.loadOriginJourneys(this.comm.journeysDf);
            });
            new Promise(r => setTimeout(r, 1)).then(() => {
                this.loadDestinationJourneys(this.comm.journeysDf);
            });
        });

        this.legend = new Legend({
            title: 'Leyenda',
            style: (feature) => {
                return [feature.getStyle()];
            },
            collapsed: false
        });

        this.addControl(this.legend);
    }

    getLegend() {
        return this.wmsLegends;
    }

    setLayerSwitcher( ) {
        const layerSwitcher = new LayerSwitcher();
        this.addControl(layerSwitcher);
    }

    getBboxMap = () => {
        return this.getView().calculateExtent(this.getSize());
    }

    loadPopulation() {
        const tileWMSSource = new TileWMS({
            params: {
                LAYERS: 'gpw-v4:gpw-v4-population-density_2020',
                TILED: true,
                tilesorigin: this.getBboxMap()[0] + ',' + this.getBboxMap()[1]},
            url: 'https://sedac.ciesin.columbia.edu/geoserver/ows?SERVICE=WMS&'
        });
        const ly = new GenTileLayer({
            name: 'PopDens',
            title: 'Densidad Población - 2020',
            source: tileWMSSource,
            visible: false,
            zIndex: 2
        });
        this.wmsLegends = tileWMSSource.getLegendUrl(this.getView().getResolution());
        ly.setOpacity(0.4);

        for (const element of this.getLayers()['array_']) {
            if (element.values_.title === 'Overlays') {
                element.values_.layers.array_.push(ly);
            }
        }
    }

    loadLineJourneys(resDf) {
        ((resDf) => {
            // Datos de viajes confirmados por trayectos
            let data = resDf.filter(row => row.get('ORIGEN_P') !== 'Otros' && row.get('DESTINO_P') !== 'Otros')
                            .groupBy('ORIGEN_C', 'DESTINO_C')
                            .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS'))
                            .rename('aggregation', 'groupCount')
                            .filter(row => row.get('groupCount') > 20);

            let dataPrice = resDf.filter(row => row.get('ORIGEN_P') !== 'Otros' && row.get('DESTINO_P') !== 'Otros')
                            .groupBy('ORIGEN_C', 'DESTINO_C')
                            .aggregate(group => group.stat.mean('IMP_KM'))
                            .rename('aggregation', 'groupCount');

            // Generating geojson format
            const geoLines = {
                type: 'FeatureCollection',
                features: []
            };
            const geoHeatJourneys = {
                type: 'FeatureCollection',
                features: []
            };
            const geoHeatPrice = {
                type: 'FeatureCollection',
                features: []
            };

            // Generates the features for the layers
            data.toArray().forEach((line) => {
                geoLines.features.push(
                    turf.lineString([line[0].coordinates, line[1].coordinates], {journeys: line[2]})
                );
                geoHeatJourneys.features.push(
                    turf.point(line[0].coordinates, {journeys: line[2]})
                );
                geoHeatJourneys.features.push(
                    turf.point(line[1].coordinates, {journeys: line[2]})
                );
            });

            dataPrice.toArray().forEach((line) => {
                geoHeatPrice.features.push(
                    turf.point(line[0].coordinates, {price: line[2]})
                );
                geoHeatPrice.features.push(
                    turf.point(line[1].coordinates, {price: line[2]})
                );
            });

            new Promise(r => setTimeout(r, 1)).then(() => {
                // Generating lines source
                const journeysVectorSources = new OlVectorSource({
                    features: new OlGeoJSON().readFeatures(geoLines, {
                        featureProjection: 'EPSG:3857'
                    })
                });

                let journeysTrack = new GenVectorLayer({
                    title: 'Trayectos viajes',
                    name: 'ViajesTracks',
                    visible: true,
                    source: journeysVectorSources,
                    style: (feature) => {
                        // Añade campo a la leyenda con estilo
                        if (!this.legendCache.journeysLines) {
                            this.legendCache.journeysLines = true;
                            const legendStyle =  new Style(
                                {
                                    fill: new Fill({ color: 'rgba(0, 0, 255, 0.5)' }),
                                    stroke: new Stroke({ color: 'rgba(0, 0, 255, 0.5)', width: 2, lineDash: [5, 8]})
                                }
                            );
                            const featureCloneStyle = feature.clone();
                            featureCloneStyle.setStyle(legendStyle);
                            this.legend.addRow({ title: 'Trayectos', feature: featureCloneStyle });
                        }
                        return new Style({
                            fill: new Fill({ color: 'rgba(0, 0, 255, 0.5)' }),
                            stroke: new Stroke({color: 'rgba(0, 0, 255, 0.5)',
                                                width: Math.log(feature.get('journeys') / 4),
                                                lineDash: [5, 8]})
                        });
                    }
                });
                for (const element of this.getLayers()['array_']) {
                    if (element.values_.title === 'Datos') {
                        journeysTrack.setZIndex(9);
                        element.values_.layers.array_.push(journeysTrack);
                    }
                }
                this.render();
            });

            // Generates heatmap layer
            new Promise(r => setTimeout(r, 1)).then(() => {
                // Generating heatMap points source for journeys
                const journeysHeatVectorSources = new OlVectorSource({
                    features: new OlGeoJSON().readFeatures(geoHeatJourneys, {
                        featureProjection: 'EPSG:3857'
                    })
                });

                // Generated layer heatmap for journeys
                let heatLayer = new HeatMapLayer({
                    title: 'Mapa de calor viajes',
                    name: 'journeysHeatMap',
                    visible: true,
                    source: journeysHeatVectorSources,
                    opacity: 0.8,
                    blur: 35,
                    radius: 5,
                    weight(feature) {
                      return feature.get('journeys');
                    }
                });

                // Generating heatMap points source for journeys
                const priceHeatVectorSources = new OlVectorSource({
                    features: new OlGeoJSON().readFeatures(geoHeatPrice, {
                        featureProjection: 'EPSG:3857'
                    })
                });

                // Generated layer heatmap for journeys
                let heatPriceLayer = new HeatMapLayer({
                    title: 'Mapa de calor precio',
                    name: 'journeysHeatMap',
                    visible: false,
                    source: priceHeatVectorSources,
                    opacity: 0.8,
                    blur: 30,
                    radius: 8,
                    weight(feature) {
                      return feature.get('price');
                    }
                });

                // Adding heatmap layer to group Datos
                for (const element of this.getLayers()['array_']) {
                    if (element.values_.title === 'Datos') {
                        heatLayer.setZIndex(8);
                        element.values_.layers.array_.push(heatLayer);
                        heatPriceLayer.setZIndex(8);
                        element.values_.layers.array_.push(heatPriceLayer);
                    }
                }
                new Promise(r => setTimeout(r, 800)).then(() => {
                    this.render();
                });
            });
        })(resDf);
    }

    loadOriginJourneys(resDf) {
        ((resDf) => {
            let data = resDf.groupBy('ORIGEN_C')
                            .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS'))
                            .rename('aggregation', 'groupCount');

            // Generating points from polygons for cluster
            const geoPoints = {
                type: 'FeatureCollection',
                features: []
            };

            data.toArray().forEach((origen) => {
                geoPoints.features.push(
                    turf.point(origen[0].coordinates, {journeys: origen[1]})
                );
            });

            // Generating Cluster with polygons points
            const clusterSource = new Cluster({
                distance: 60,
                source: new OlVectorSource({
                    features: new OlGeoJSON().readFeatures(geoPoints, {
                        featureProjection: 'EPSG:3857'
                    })
                })
            });

            const ly = new GenVectorLayer({
                title: 'Viajes origen',
                name: 'ViajesOrigenCluster',
                visible: false,
                source: clusterSource,
                style: (feature) => {

                    // Cachea los clusters para no regenerarlos
                    let journeysNum = 0;
                    feature.getProperties().features.forEach((journeyFeature) => {
                        journeysNum += journeyFeature.getProperties().journeys;
                    });
                    const size = this.getView().getZoom() > 11 ? 3 : 1;
                    let style = this.styleCache.originC[`${journeysNum}${size}`];


                    if (!style) {

                        // Añade campo a la leyenda con estilo
                        if (!this.legendCache.origenC) {
                            this.legendCache.origenC = true;
                            const legendStyle =  new Style({
                                image: new CircleStyle({
                                    radius: 15,
                                    stroke: new Stroke({
                                        color: '#fff'
                                    }),
                                    fill: new Fill({
                                        color: '#00ff00'
                                    })
                                })
                            });
                            const featureCloneStyle = feature.clone();
                            featureCloneStyle.setStyle(legendStyle);
                            this.legend.addRow({ title: 'Viajes origen', feature: featureCloneStyle });
                        }
                        style = new Style({
                            image: new CircleStyle({
                                radius: (journeysNum > 10000 ? 50 : journeysNum > 1000 ? 30 : 10) * size,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: 'rgba(0, 255, 0, 0.5)'
                                })
                            }),
                            text: new Text({
                                text: journeysNum.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                        this.styleCache.originC[`${journeysNum}${size}`] = style;
                    }
                    return style;
                }
            });

            for (const element of this.getLayers()['array_']) {
                if (element.values_.title === 'Datos') {
                    ly.setZIndex(10);
                    element.values_.layers.array_.push(ly);
                }
            }
            this.render();
        })(resDf);
    }

    loadDestinationJourneys(resDf) {
        ((resDf) => {
            let data = resDf.groupBy('DESTINO_C')
                            .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS'))
                            .rename('aggregation', 'groupCount');

            // Generating points from polygons for cluster
            const geoPoints = {
                type: 'FeatureCollection',
                features: []
            };

            data.toArray().forEach((origen) => {
                geoPoints.features.push(
                    turf.point(origen[0].coordinates, {journeys: origen[1]})
                );
            });

            // Generating Cluster with polygons points
            const clusterSource = new Cluster({
                distance: 60,
                source: new OlVectorSource({
                    features: new OlGeoJSON().readFeatures(geoPoints, {
                        featureProjection: 'EPSG:3857'
                    })
                })
            });

            const ly = new GenVectorLayer({
                title: 'Viajes destino',
                name: 'ViajesDestinoCluster',
                visible: false,
                source: clusterSource,
                style: (feature) => {

                    // Cachea los clusters para no regenerarlos
                    let journeysNum = 0;
                    feature.getProperties().features.forEach((journeyFeature) => {
                        journeysNum += journeyFeature.getProperties().journeys;
                    });
                    const size = this.getView().getZoom() > 11 ? 3 : 1;
                    let style = this.styleCache.destinationC[`${journeysNum}${size}`];

                    if (!style) {

                        // Añade campo a la leyenda con estilo
                        if (!this.legendCache.destinationC) {
                            this.legendCache.destinationC = true;
                            const legendStyle =  new Style({
                                image: new CircleStyle({
                                    radius: 15,
                                    stroke: new Stroke({
                                        color: '#fff'
                                    }),
                                    fill: new Fill({
                                        color: '#0000ff'
                                    })
                                })
                            });
                            const featureCloneStyle = feature.clone();
                            featureCloneStyle.setStyle(legendStyle);
                            this.legend.addRow({ title: 'Viajes destino', feature: featureCloneStyle });
                        }

                        style = new Style({
                            image: new CircleStyle({
                                radius: (journeysNum > 10000 ? 50 : journeysNum > 1000 ? 30 : 10) * size,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: 'rgba(0, 0, 255, 0.5)'
                                })
                            }),
                            text: new Text({
                                text: journeysNum.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                        this.styleCache.destinationC[`${journeysNum}${size}`] = style;
                    }
                    return style;
                }
            });

            for (const element of this.getLayers()['array_']) {
                if (element.values_.title === 'Datos') {
                    ly.setZIndex(10);
                    element.values_.layers.array_.push(ly);
                }
            }
            this.render();
        })(resDf);
    }
}
