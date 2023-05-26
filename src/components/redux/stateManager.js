import { createSlice } from "@reduxjs/toolkit"
import { retry, select } from "redux-saga/effects";
import { getSegmentsFromWorkouts } from "./csvManager";
import { sortState } from "./sortState"

export const StateSlice = createSlice({
  name: 'manager',
  initialState: {
    isInSegmentCreateState: false,
    areMarkersReadyToLoadSegmentForAllWorkout: false,
    segemtId: 0,
    startEndMark: {},
    sortState: sortState(),
    isSegmentAppBarShowen: false,
    isExpanded: true,
    movingMarker: {
      lat: undefined,
      long: undefined
    }
  },
  reducers: {
    setMovingMarker: (state, action) => {
      state.movingMarker = action.payload
    },
    setIsInSegmentCreateState: (state, action) => {
      // console.log(action);
      state.isInSegmentCreateState = action.payload
    },
    checkAndSetAreMarkersReadyToLoadSegmentForAllWorkout: (state, action) => {
      state.areMarkersReadyToLoadSegmentForAllWorkout =
        ((state.isInSegmentCreateState && action.payload) && true)
    },
    loadSegmentsFromStartEndMark: (state, action) => {
      state.isSegmentAppBarShowen = true
      // console.log(action);
    },
    setStartEndmark: (state, action) => {
      state.startEndMark = action.payload
    },
    incrementSegmentId: (state, action) => {
      state.segemtId += 1
    },
    setIsSegmentAppBarShowen: (state, action) => {
      // console.log(action);
      state.isSegmentAppBarShowen = action.payload
    },
    setIsExpanded: (state, action) => {
      // console.log(action);
      state.isExpanded = action.payload
    },
    setSortState: (state, action) => {
    },
    _setSortState: (state, action) => {
      state.sortState = action.payload
    },

  }
})

export const {
  setIsInSegmentCreateState,
  checkAndSetAreMarkersReadyToLoadSegmentForAllWorkout,
  setStartEndmark,
  loadSegmentsFromStartEndMark,
  setIsSegmentAppBarShowen,
  setIsExpanded,
  setSortState,
  _setSortState,
  setMovingMarker
} = StateSlice.actions

export default StateSlice.reducer

