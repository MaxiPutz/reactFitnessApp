import { colors, Paper, Grid, Tooltip } from "@mui/material";
import react, { useState, useEffect, useRef, useCallback } from "react"
import { Map, Source, Layer, Marker, NavigationControl } from "react-map-gl"
import LastPageIcon from '@mui/icons-material/LastPage';
import StartIcon from '@mui/icons-material/Start';
import { getMaxMinCoordinates, isCoordinateInMark } from "./redux/saga/businessLogic"
import Pin from "./Pin"
import PathGeoJsonComponent from "./PathGeoJsonComponent";
import { LngLat } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { getSegmentsFromWorkouts } from "./redux/csvManager"
import { setIsInSegmentCreateState, checkAndSetAreMarkersReadyToLoadSegmentForAllWorkout, setStartEndmark } from "./redux/stateManager"
import mapboxgl from 'mapbox-gl';
import SportsScoreTwoToneIcon from '@mui/icons-material/SportsScoreTwoTone';
import GolfCourseTwoToneIcon from '@mui/icons-material/GolfCourseTwoTone';
import MovingMarker from "./MovingMarker";


mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line


const TOKEN = 'pk.eyJ1IjoibWF4aXB1dHoiLCJhIjoiY2p0eXoyNHBvMjVobzRlbXB0aHBscTd6NCJ9.498DhQ66cjxrx1hmPBYkag'


export default function MapComponent(props) {

  const dispatch = useDispatch()

  const [startTime, setStartTime] = useState(undefined)
  const [endTime, setEndTime] = useState(undefined)

  const [startLatLong, setStartLatLong] = useState([[]])
  const [endLatLong, setEndLatLong] = useState([[]])

  let temp99 = props.CSV
    .map((ele) => ({
      lngLat: new LngLat(ele[2], ele[1]),
      timerTime: Number(ele[3])
    }))


  const isInSegmentCreateState = useSelector(state => state.manager.isInSegmentCreateState)
  const lngLatTimerList1 = (useSelector((state) => state.CSV.viewWorkoutData))
    // .filter(ele => Number(ele[1]) === 0 )
    .map((ele) => ({
      lngLat: new LngLat(ele[2], ele[1]),
      timerTime: Number(ele[3])
    }))
  // let [lngLatTimerList1, setS1] = useState(
  // props.CSV.map((ele) => ({
  //     lngLat: new LngLat(ele[2], ele[1]),
  //     timerTime: Number(ele[3])
  // }))
  // .sort((ele1, ele2) =>
  //     ele1.timerTime < ele2.timerTime ? -1 : 1
  // )

  // )

  const [selectedPathComponent, setSelectedPathComponent] = useState(<div></div>)
  const [selectedPathCSV, setSelectedPathCSV] = useState([])
  const map = useRef(null);
  const [lng, setLng] = useState(props.center.long);
  const [lat, setLat] = useState(props.center.lat);

  const [lng2, setLng2] = useState(props.center.long);
  const [lat2, setLat2] = useState(props.center.lat);

  const [isMarkerEndShownen, setIsMarkerEndShownen] = useState(false)
  //const [isStartMarkhidden, setIsStartMarkhidden] = useState(props.isStartMarkhidden)
  const [isPathToSave, setIsPathToSave] = useState(false)

  const [zoom, setZoom] = useState(props.zoom);
  const bounds = [
    [props.minMaxCoordinates.minLong, props.minMaxCoordinates.minLat],
    [props.minMaxCoordinates.maxLong, props.minMaxCoordinates.maxLat]
  ]

  // const  map = useMap()
  useEffect(() => {
    // console.log('onDrag', startTime, endTime, lng, lng2);

  }, [startTime, endTime, lng, lng2])

  useEffect(() => {
    dispatch(setIsInSegmentCreateState(false))
    dispatch(checkAndSetAreMarkersReadyToLoadSegmentForAllWorkout(false))

  }, [])

  useEffect(() => {
    // console.log('set lat effect', lat, lng);
    if (selectedPathCSV.length == 0) {
      setLat(props.center.lat)
      setLng(props.center.long)
      setLat2(props.center.lat)
      setLng2(props.center.long)
    } else {
      // console.log(selectedPathCSV);
      // setLat(selectedPathCSV[0][1])
      // setLng(props.center.long)
    }


    if (map.current) {
      map.current.setCenter([props.center.long, props.center.lat])
      map.current.fitBounds(
        bounds,
        {
          padding: 20
        }
      )
    }



  }, [props.center])


  return <Grid item xs sx={{
    width: "100%"
  }}>

    <Map ref={map}
      initialViewState={{
        latitude: lat,
        longitude: lng,
        bounds: bounds,
        zoom: zoom,
        fitBoundsOptions: {
          padding: 10
        }
      }}
      mapStyle='mapbox://styles/mapbox/light-v10'
      mapboxAccessToken={TOKEN}
      attributionControl={false}
      style={{ width: '100%', height: '300px', display: "" }}

    >
      <PathGeoJsonComponent
        CSV={props.CSV}
        id="route"
        longLatList={props.CSV.map(ele => [ele[2], ele[1]]).filter(ele => ele[0])}
        strokeWeight={6}
        color={colors.blue[500]}
      />
      <Tooltip title={'drop the marker on the path'}>

        <Marker
          color={colors.green[200]}
          style={{
            visibility: isInSegmentCreateState ? 'visible' : 'hidden'
          }}
          onDragEnd={(e) => {

            let val = onDragFilter
              (lngLatTimerList1, e, props.CSV, undefined, endTime)
            // console.log('onDrag', val);

            // console.log(props.CSV);

            if (val.CSV.length == 0) return
            setStartTime(val.startTime)
            setEndTime(val.endTime)
            setStartLatLong([e.lngLat.lat, e.lngLat.lng])

            setSelectedPathComponent(
              <PathGeoJsonComponent
                id="route2"
                strokeWeight={8}
                color={colors.green[500]}
                longLatList={val.CSV.map(ele => [ele[2], ele[1]])}
              />

            )
            setSelectedPathCSV(val)


            setLat(e.lngLat.lat)
            setLng(e.lngLat.lng)
            setIsMarkerEndShownen(true)
          }}

          latitude={lat}
          longitude={lng}
          draggable={true}
        ></Marker>
      </Tooltip>

      <Marker
        color={colors.red[800]}

        style={{
          visibility: isMarkerEndShownen ? 'visible' : 'hidden'
        }}
        onDragEnd={(e) => {



          let val = onDragFilter
            (lngLatTimerList1, e, props.CSV, startTime, undefined)
          // console.log('onDrag', val);

          if (val.CSV.length == 0) return
          setStartTime(val.startTime)
          setEndTime(val.endTime)
          setEndLatLong([e.lngLat.lat, e.lngLat.lng])


          setSelectedPathComponent(
            <PathGeoJsonComponent
              id="route2"
              strokeWeight={8}
              color={colors.green[500]}
              longLatList={val.CSV.map(ele => [ele[2], ele[1]])}
            />

          )
          setSelectedPathCSV(val)


          setLat2(e.lngLat.lat)
          setLng2(e.lngLat.lng)
          setIsMarkerEndShownen(true)
          dispatch(checkAndSetAreMarkersReadyToLoadSegmentForAllWorkout(true))
          dispatch(setStartEndmark({
            endMark: {
              long: e.lngLat.lng,
              lat: e.lngLat.lat
            }, startMark: {
              long: lng,
              lat: lat
            }
          }))
        }}
        latitude={lat2}
        longitude={lng2}
        draggable={true}
      >
      </Marker>
      {selectedPathComponent}
      <MovingMarker />
    </Map>


  </Grid>

}

const onDragFilter = (lngLatTimerList = [], lngLatMarker, CSV = [], startTime, endTime) => {
  // console.log(lngLatTimerList);
  // console.log(CSV);

  lngLatTimerList = lngLatTimerList.filter(ele => {
    return lngLatMarker.lngLat.distanceTo(ele.lngLat) < 50
  }
  )

  let tmp =
    lngLatTimerList.filter(ele => {
      return isCoordinateInMark(
        ({
          lat: ele.lngLat.lat,
          long: ele.lngLat.lng
        }), {
        lat: lngLatMarker.lngLat.lat,
        long: lngLatMarker.lngLat.lng

      }
      ), 50
    })

  // console.log('compare', tmp, lngLatTimerList);
  if (lngLatTimerList.length == 0) {
    return {
      CSV: [],
      startTime: startTime,
      endTime: endTime
    }
  }
  const pathElement = startTime == undefined ?
    lngLatTimerList[lngLatTimerList.length - 1].timerTime :
    lngLatTimerList[0].timerTime

  if (startTime == undefined && endTime == undefined) {
    return {
      CSV: CSV.filter((ele => ele[3] > pathElement)),
      startTime: pathElement
    }
  } else if (startTime != undefined && endTime == undefined) {
    return {
      CSV: CSV
        .filter((ele => ele[3] < pathElement))
        .filter((ele) => ele[3] > startTime)
      ,
      startTime: startTime,
      endTime: pathElement
    }

  } else if (startTime == undefined && endTime != undefined) {
    return {
      CSV: CSV
        .filter((ele => ele[3] > pathElement))
        .filter((ele) => ele[3] < endTime),
      startTime: pathElement,
      endTime: endTime
    }
  } else if (startTime != undefined && endTime != undefined) {

  }
}
