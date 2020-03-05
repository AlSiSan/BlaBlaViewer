import OlMap from 'ol/Map';

import OlGeoJSON from 'ol/format/GeoJSON.js';
import OlVectorSource from 'ol/source/Vector.js';
import VectorTileSource from 'ol/source/VectorTile.js';

import {Cluster} from 'ol/source';
import OlXYZ from 'ol/source/XYZ';
import OlOSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style.js';

import { Zoom } from 'ol/control';

import Projection from 'ol/proj/Projection';

import { GenLayerGroup, GenTileLayer, GenVectorLayer, GenVectorTileLayer } from './customLayers/gen-layers';

import LayerSwitcher from 'ol-layerswitcher';

import * as turf from '@turf/turf';

export class GenMap extends OlMap {

    // pointermove selection
    selection = {};

    // Cache for styles
    styleCache = {
        business: {},
        polygons: {}
    };

    constructor( opt? ) {
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
                    title: 'Datos',
                    type: 'group',
                    fold: 'open',
                    layers: [
                        new GenLayerGroup({
                            name: 'Viajes',
                            title: 'Viajes',
                            type: 'group',
                            fold: 'close',
                            layers: []
                        })
                    ],
                    zIndex: 20
                })
            ],
            view: opt.view,
            controls: [
                new Zoom()
            ]
        });

    }

    setLayerSwitcher( ) {
        const layerSwitcher = new LayerSwitcher();
        this.addControl(layerSwitcher);
    }

    getBboxMap = () => {
        return this.getView().calculateExtent(this.getSize());
    }

}
