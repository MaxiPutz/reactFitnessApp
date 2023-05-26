import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaDataView from "./components/MetaDataView";
import WorkoutPage from "./components/WorkoutPage";
import { loadInitDataRequested, loadMetaDataRequested, loadworkoutDataRequested, resetSegmetDataView } from "./components/redux/csvManager"
import { setIsInSegmentCreateState } from "./components/redux/stateManager"
import { Routes, Route } from "react-router-dom"


function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadInitDataRequested('hallo'))
    //dispatch(loadMetaDataRequested("hallo"))
    //dispatch(loadworkoutDataRequested("hallo"))
    window.addEventListener("popstate", e => {
      dispatch(setIsInSegmentCreateState(false))
      dispatch((resetSegmetDataView()))
      //console.log(e, 'popstate listener');
    })
  }, [])


  return (
    <div>
      <header>

      </header>
      <body>
        {/* <MetaDataView></MetaDataView> */}
        <Routes>
          <Route
            path="/workout/:id/:date"
            element={<WorkoutPage></WorkoutPage>}
          ></Route>
          <Route
            path="/"
            element={<MetaDataView></MetaDataView>}
          ></Route>
        </Routes>
      </body>
    </div>
  );
}

export default App;
