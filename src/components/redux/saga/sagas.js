import { call, put, takeEvery, select, takeLatest, fork, all } from "redux-saga/effects"
import {
  loadInitDataRequested,
  loadBackgroundPictureRequested,
  loadBackgroundPictureSuccess,
  loadMetaDataRequested,
  loadMetaDataSuccess,
  loadworkoutDataSuccess,
  getWorkoutDataByIDSuccess,
  loadworkoutDataRequested,
  loadWorkoutDataByIdRequested,
  loadAllBackgroundPictureSuccess
} from "../csvManager"
import { setMovingMarker } from "../stateManager"


import { loadMetaData, loadworkoutData, workoutFilterdById, calcPic, loadAllBackgroundPicture, loadData } from "./businessLogic"


function* loadMetaDataSaga(action) {
  const metaData = yield call(loadMetaData)
  yield put(loadMetaDataSuccess(metaData))
}

function* loadworkoutDataSaga(action) {
  const workoutData = yield call(loadworkoutData)
  yield put(loadworkoutDataSuccess(workoutData))
}

function* loadInitDataRequestedSaga(action) {
  const { metaData, workoutData } = yield call(loadData)
  yield put(loadMetaDataSuccess(metaData))
  yield put(loadworkoutDataSuccess(workoutData))

  // new init flow
  // const allBackgroundPicture = yield call(loadAllBackgroundPicture)
  // yield put (loadAllBackgroundPictureSuccess(allBackgroundPicture))

  // yield all(
  //     metaData.map((ele, i) => fork(pathCalcFlow, workoutData, ele[0]))
  // )


  // non blocking calc because of the sleep call
  for (let i = 0; i < metaData.length; i++) {
    //if (i > 6) continue
    const ele = metaData[i][0];

    const workout_filterd_by_ID = yield call(workoutFilterdById, workoutData, ele)
    const path = yield call(calcPic, workout_filterd_by_ID)
    yield put(loadBackgroundPictureSuccess(path))
    yield call(mySleep, 50)
    // console.log(ele);
  }

}

function mySleep(delay) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, delay)
  })
}


function* pathCalcFlow(workoutData, ele) {
  //console.log(ele);
  const workout_filterd_by_ID = yield call(workoutFilterdById, workoutData, ele)
  const path = yield call(calcPic, workout_filterd_by_ID)
  //console.log(path);
  yield put(loadBackgroundPictureSuccess(path))

}


//-----------------

function* loadBackgroundPictureRequestedSaga(action) {
  const selected = yield select((state) => state.CSV.workoutData)
  const workout_filterd_by_ID = yield call(workoutFilterdById, selected, action.payload)

  const path = yield call(calcPic, workout_filterd_by_ID)
  //console.log(path);
  yield put(loadBackgroundPictureSuccess(path))
}

function* loadWorkoutDataByIdRequestedSaga(action) {
  let workoutData = yield select(state => state.CSV.workoutData)
  //console.log(workoutData);
  if (workoutData.length == 0) {
    workoutData = yield call(loadworkoutData)
    yield put(loadworkoutDataSuccess(workoutData))
    //console.log(workoutData);
  }
  const workout_filterd_by_ID = yield call(workoutFilterdById, workoutData, action.payload)

  yield put(getWorkoutDataByIDSuccess(workout_filterd_by_ID))
}


function* setMovingMarkerSaga(action) {
  let viewWorkoutData = yield select(state => state.CSV.viewWorkoutData)

  while (viewWorkoutData.length != 0) {
    viewWorkoutData = shirnkCSVByAverage(viewWorkoutData, 350)

    const totalMovingTime = 5000
    const dt = totalMovingTime / viewWorkoutData.length

    for (let i = 0; i < viewWorkoutData.length; i++) {
      let lat = viewWorkoutData[i][1]
      let long = viewWorkoutData[i][2]
      if (lat == 0 || lat == NaN || lat == undefined) continue


      yield put(setMovingMarker({
        lat: lat,
        long: long
      }))
      yield sleep(dt)
    }
    viewWorkoutData = yield select(state => state.CSV.viewWorkoutData)
  }


}



export default function* mySaga() {
  yield takeEvery(loadInitDataRequested, loadInitDataRequestedSaga)
  yield takeEvery(loadMetaDataRequested, loadMetaDataSaga)
  yield takeEvery(loadworkoutDataRequested, loadworkoutDataSaga)
  yield takeEvery(loadBackgroundPictureRequested, loadBackgroundPictureRequestedSaga)
  yield takeLatest(loadWorkoutDataByIdRequested, loadWorkoutDataByIdRequestedSaga)
  yield takeLatest(getWorkoutDataByIDSuccess, setMovingMarkerSaga)
}


function sleep(time) {
  return new Promise((res, rej) => setTimeout(() => res(), time))
}

const shirnkCSVByAverage = (CSV = [], outPutArrLength = 150) => {
  if (CSV.length <= outPutArrLength)
    return CSV

  let skip = Math.ceil(CSV.length / outPutArrLength)
  let output = []
  for (let i = 0; i < CSV.length; i += skip) {
    let tmp = [...new Array(CSV[i].length).fill(0)]
    for (var j = 0; j < skip && (i + j) < CSV.length; j += 1) {
      tmp = tmp.map((ele, index) => (Number(CSV[i + j][index]) + ele))
    }
    output.push(tmp.map(ele => (ele / j)))
  }
  return output
}
