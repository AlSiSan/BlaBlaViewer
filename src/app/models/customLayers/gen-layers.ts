import OlVectorLayer from 'ol/layer/Vector.js';
import OlTileLayer from 'ol/layer/Tile';
import OlLayerGroup from 'ol/layer/Group';
import VectorTileLayer from 'ol/layer/VectorTile';
import HeatMap from 'ol/layer/Heatmap';
import { Select } from 'ol/interaction';

/**
 * Those are custom layers due to TypeScript restrictions
 * JavaScript is flexible
 * TypeScript is typed
 */

export class GenTileLayer extends OlTileLayer {
    name: string;
    title: string;
    constructor( params ) {
        super( params );
    }
}

export class HeatMapLayer extends HeatMap {
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