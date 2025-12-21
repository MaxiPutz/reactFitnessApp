import { colors } from "@mui/material";
import React from "react";
import { Layer, Source } from "react-map-gl";

const geoJsonTamplate = (longLatList)=> {
    return {
        "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": longLatList
                    }
    }
}

const layerStyleTamplate = (strokeWeight=3, color=colors.blue[400])=> ({
    //id: 'myLine',
    type: 'line',
    paint: {
        'line-width': strokeWeight,
        'line-color': color
    }
})


// m: path, id
//o: strokeWeight and color
export default function PathGeoJsonComponent (props) {
    const layerStyle = 
    props.strokeWeight === props.color === undefined ?
    layerStyleTamplate() : layerStyleTamplate(props.strokeWeight,  props.color)
    

    return <Source id={props.id} type="geojson" data={geoJsonTamplate(props.longLatList)}>
        <Layer id={props.id} {...layerStyle}/> 
    </Source>
}