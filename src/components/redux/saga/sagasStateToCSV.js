import { takeEvery, put, select, takeLatest } from "redux-saga/effects";
import { getSegmentsFromWorkouts, sortMetaData } from "../csvManager"
import { loadSegmentsFromStartEndMark, setSortState, _setSortState } from "../stateManager"
import { sortState } from "../sortState"

function* loadSegmentsFromStartEndMarkSaga(action) {
  // console.log(action);
  const selectStartEndMark = yield select(state => state.manager.startEndMark)
  const selectHighestSegmentId = yield select(state => state.manager.segemtId)

  yield put(getSegmentsFromWorkouts({ ...selectStartEndMark, segemtId: selectHighestSegmentId }))
}


function* sortMetaDataSaga(action) {

  let arr = [
    [1, 2, 1, 3, 3, 12, 'acdistance', 'adi'],
    [1, 3, 1, 4, 4, 5, 'time', 'distance'],
    [1, 4, 1, 1, 1, 1094, 'time', 'distance'],
    [1, 1, 1, 2, 2, 3, 'btime', 'distance']
  ]



  let temp = sortState(action.payload.state.getState)
  temp = sortState(temp.setSort(action.payload.toSort))

  // console.log(action);
  let selectMetaData = yield select(state => state.CSV.metaData)
  // console.log(temp);

  let arr2 = [...arr]
  // console.log(arr2);
  arr.sort(temp.getCSVSortfunction())
  // console.log(arr);

  let se = [...selectMetaData].sort(temp.getCSVSortfunction())
  // console.log('sort');
  yield put(sortMetaData(se))
  yield put(_setSortState(temp))
  // console.log('after yield');
}

export default function* sagasStateToCSV() {
  yield takeEvery(loadSegmentsFromStartEndMark, loadSegmentsFromStartEndMarkSaga)
  yield takeLatest(setSortState, sortMetaDataSaga)
}
