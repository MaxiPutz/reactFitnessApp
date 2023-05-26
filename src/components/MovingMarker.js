import react, { useEffect, useRef } from "react"
import { Marker } from "react-map-gl"
import {  useSelector } from "react-redux"
import { select } from "redux-saga/effects"
import mapboxgl from 'mapbox-gl';
import  AssistWalkerIcon  from '@mui/icons-material/AssistWalker'
import Pin from "./Pin"


mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line



export default function MovingMarker (props)  {
    const select = useSelector(state => state.manager.movingMarker)

    const ref = useRef(null)

    // useEffect(()=> {
    //     if(!ref.current){
    //         return 
    //     }
    //     ref.current.setLngLat([select.long, select.lat])
    // })

    if(select.lat == undefined || select.lat == 0) return <div/> 

    return <Marker 
    ref={ref}
        latitude={select.lat}
        longitude={select.long}
    >
        <AssistWalkerIcon/>
    </Marker>
}
