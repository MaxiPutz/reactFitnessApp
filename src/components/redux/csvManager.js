import { createSlice, current } from "@reduxjs/toolkit"
import { isCoordinateInMark } from "./saga/businessLogic"
import { useDispatch } from "react-redux"


export const CSVSlice = createSlice({
  name: 'CSV',
  initialState: {
    metaData: [], // id,sport,startTime,averagePower,averageSpeed,averageHearRate,totalTime,totalDistance
    workoutData: [], // workoutID, lat, long, timertime, power, heartrate, speed
    backGroundPictureComponents: [], // {pathString, component}
    viewWorkoutData: [], // workoutID, lat, long, timertime, power, heartrate, speed
    segementWorkoutData: [], // // workoutID, lat, long, timertime, power, heartrate, speed, segmentID
    segementMetaData: [], //  workoutID, startTime, endTime, segmentID
    testState: [],
    viewMetadataSegment: []
  },
  reducers: {
    resetSegmetDataView: (state, action) => {
      state.viewMetadataSegment = []
      state.segementMetaData = []
      state.segementWorkoutData = []

    },
    viewMetadataSegment: (state, action) => {
      state.viewMetadataSegment = action.payload
    },
    loadMetaDataSuccess: (state, action) => {
      // console.log(action.type);
      state.metaData = action.payload
    },
    loadworkoutDataSuccess: (state, action) => {
      // console.log(action.type);
      state.workoutData = action.payload

    },
    loadInitDataRequested: (state, action) => {

    },
    loadMetaDataRequested: (state, action) => {
      // console.log(action);
    },
    loadworkoutDataRequested: (state, action) => {
      // console.log(action);
    },
    loadBackgroundPictureSuccess: (state, action) => {
      state.backGroundPictureComponents =
        [...state.backGroundPictureComponents, action.payload]
    },
    loadBackgroundPictureRequested: (state, action) => {
    },
    loadWorkoutDataByIdRequested: (state, action) => {
    },
    getWorkoutDataByIDSuccess: (state, action) => {
      // console.log(action);
      state.viewWorkoutData = action.payload
    },
    loadAllBackgroundPictureSuccess: (state, action) => {
      // console.log(action.type);
      state.backGroundPictureComponents = action.payload.pictureComponents
    },
    getSegmentsFromWorkouts: (state, action) => {
      const startMark = action.payload.startMark
      const endMark = action.payload.endMark

      // console.log(action);
      const startSegment = state.workoutData
        .filter((ele) =>
          isCoordinateInMark(
            startMark,
            {
              lat: ele[1],
              long: ele[2]
            },
            50
          ))
      const endSegment = state.workoutData.filter((ele) =>
        isCoordinateInMark(
          endMark,
          {
            lat: ele[1],
            long: ele[2]
          },
          50
        ))

      let idSegmentStart =
        getWorkoutsIDWithHighestTimerTimeFromWorkOutCSV(startSegment)
      let idSegmentEnd =
        getWorkoutsIDWithLowestTimerTimeFromWorkOutCSV(endSegment)

      let result = []
      Object.entries(idSegmentStart).forEach(([key, val]) => {
        if (idSegmentEnd[key] == undefined) return
        result.push({
          id: key,
          startTime: idSegmentStart[key],
          endTime: idSegmentEnd[key],
          segmentId: action.payload.segemtId
        })
      })

      state.testState = [result, idSegmentEnd, idSegmentStart, ...endSegment, ...startSegment]

      // console.log(result.map((res) => Object.entries(res).map(([ke, val]) => val)))
      // console.log(result.map((res) => res));
      state.segementMetaData = result.map((res) => Object.entries(res).map(([ke, val]) => val))
    },
    sortMetaData: (state, action) => {
      // console.log('sortmeta');
      // console.log(action);
      state.metaData = action.payload
    }
  }
})

const getWorkoutsIDWithHighestTimerTimeFromWorkOutCSV = (segments) => {
  let val = {}
  segments.forEach((ele) => val[ele[0]] =
    (val[ele[0]] === undefined || Number(ele[0]) > Number(val[ele[0]])) ?
      Number(ele[3]) :
      Number(val[ele[0]])
  )
  return val
}

// issue if the forwart and the backwart path are the same
const getWorkoutsIDWithLowestTimerTimeFromWorkOutCSV = (segments, minTime = 0) => {
  let val = {}
  segments.forEach((ele) => val[ele[0]] =
    (val[ele[0]] === undefined || Number(ele[0]) < Number(val[ele[0]])) ?
      Number(ele[3]) :
      Number(val[ele[0]])
  )
  return val
}


export const {
  loadMetaDataSuccess,
  loadworkoutDataSuccess,
  loadMetaDataRequested,
  loadInitDataRequested,
  loadworkoutDataRequested,
  loadBackgroundPictureRequested,
  loadBackgroundPictureSuccess,
  loadWorkoutDataByIdRequested,
  getWorkoutDataByIDSuccess,
  loadAllBackgroundPictureSuccess,
  getSegmentsFromWorkouts,
  viewMetadataSegment,
  resetSegmetDataView,
  sortMetaData
} = CSVSlice.actions

export default CSVSlice.reducer
