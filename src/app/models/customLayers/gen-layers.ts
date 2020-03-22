import OlVectorLayer from 'ol/layer/Vector.js';
import OlHeatMap from 'ol/layer/HeatMap.js';
import OlTileLayer from 'ol/layer/Tile';
import OlLayerGroup from 'ol/layer/Group';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Select } from 'ol/interaction';

export class GenTileLayer extends OlTileLayer {
    name: string;
    title: string;
    constructor( params ) {
        super( params );
    }
}

export class HeatMapLayer extends OlHeatMap {
    name: string;
    title: string;
    constructor( params ) {
        super( params );
    }
}

export class GenVectorLayer extends OlVectorLayer {
    name: string;
    title: string;
    constructor( params ) {
        super( params );
    }
}

export class GenLayerGroup extends OlLayerGroup {
    name: string;
    title: string;
    type: string;
    constructor( params ) {
        super( params );
    }
}

export class GenVectorTileLayer extends VectorTileLayer {
    name: string;
    title: string;
    constructor( params ) {
        super( params );
    }
}

export class GenSelect extends Select {
    style: any;
    constructor( params ) {
        super( params );
    }
}