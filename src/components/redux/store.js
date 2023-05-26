import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import mySaga from './saga/sagas'
import sagasStateToCSV from './saga/sagasStateToCSV'
import CSVReducer from "./csvManager"
import stateManagerReducer from "./stateManager"

const sagaMiddleware = createSagaMiddleware()

export default configureStore({
  reducer: {
    CSV: CSVReducer,
    manager: stateManagerReducer
  }
,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({thunk: false, serializableCheck: false}), sagaMiddleware]
})

sagaMiddleware.run(sagasStateToCSV)
sagaMiddleware.run(mySaga)