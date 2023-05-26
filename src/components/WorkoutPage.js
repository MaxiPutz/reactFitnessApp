import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadWorkoutDataByIdRequested, loadInitDataRequested, resetSegmetDataView } from "./redux/csvManager"
import mapboxgl from "mapbox-gl";
import BackgroudView from "./BackgroundView"
import { Card, colors, Paper, Grid, Typography, AppBar, Box, Toolbar, MenuItem, Button, Tooltip, IconButton, Collapse, CardContent } from "@mui/material";
import { CircularProgress } from "@mui/material"
import { getMaxMinCoordinates } from "./redux/saga/businessLogic"
import { Line } from "react-chartjs-2"
import { renderToStaticMarkup } from 'react-dom/server'
import { ReactDOM } from "react";
import MapComponent from "./MapComponent"
import { loadSegmentsFromStartEndMark, setIsInSegmentCreateState, setStartEndmark, setIsSegmentAppBarShowen, setIsExpanded } from "./redux/stateManager";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
} from 'chart.js'
import { Directions, MacroOffSharp, } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { height } from "@mui/system";
import { MyApexCharts } from "./MyApexChart";
import SegmentOverView from "./SegmentOverView";
import { useBackListener } from "../myHooks/useBackListener"

export default function WorkoutPage(props) {


  const { id, date } = useParamsujkj()
  // console.log(date);
  const navigate = useNavigate()
  const select = useSelector((state => state.CSV.viewWorkoutData))

  const selectManagerAppBar = useSelector(state => state.manager.isSegmentAppBarShowen)
  // const selectIsExpanded = useSelector(state => state.manager.isExpanded)
  // const [isExpanded, setIsExpanded] = useState(selectIsExpanded.val)

  const isExpanded = useSelector(state => state.manager.isExpanded)

  // console.log(isExpanded, 'is expand');
  const selectIsLoadButtonShowen =
    useSelector((state) => state.manager.areMarkersReadyToLoadSegmentForAllWorkout)
  const dispatch = useDispatch()




  let viewMapbox = <div></div>//<BackgroudView id={id} stroke="black" scale={2}/>

  useEffect(() => {
    dispatch(loadWorkoutDataByIdRequested(id))
    // dispatch(setStartEndmark( {
    //     endMark: {
    //       'long': 16.522150322714054,
    //       lat: 47.434468157775626
    //     },
    //     startMark: {
    //       'long': 16.518382843354885,
    //       lat: 47.43712980224592
    //     }
    //   }))
    // dispatch(loadSegmentsFromStartEndMark())

  }, [])


  // console.log(select, id);

  if (select.length != 0) {
    let tmp = getMaxMinCoordinates(select.map((ele) => [ele[1], ele[2], ele[3]]).filter(ele => ele[0]))

    const center = {
      lat: (tmp.minLat + (tmp.maxLat - tmp.minLat) / 2),
      long: (tmp.minLong + (tmp.maxLong - tmp.minLong) / 2)
    }
    // console.log(center);
    viewMapbox = <MapComponent CSV={select} center={center} zoom={12.4} minMaxCoordinates={tmp} />
    //   <MapBoxTest2 CSV={select} center={center} zoom={12.4} style={{

    // }} ></MapBoxTest2>
  }

  //return viewMapbox

  return <Paper>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container alignContent={"center"}>
            <Grid item >
              <MenuItem
                onClick={() => dispatch(setIsExpanded(!isExpanded))}
              >
                <ExpandMore
                  expand={isExpanded}

                  aria-expanded={isExpanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Workout     {date}
                </Typography>
              </MenuItem>
            </Grid>

            <Grid item>
              <MenuItem>
                <Tooltip title={'Create a segment'}>
                  <Button variant="contained"
                    onClick={() => dispatch(setIsInSegmentCreateState(true))}
                  > Create </Button>
                </Tooltip>
              </MenuItem>
            </Grid>

            <Grid visibility={
              selectIsLoadButtonShowen ? "visible" : "hidden"
            }>
              <MenuItem>
                <Tooltip title={'load segments from workouts'}>
                  <Button variant="contained"
                    style={{
                      backgroundColor: colors.yellow[200]
                    }}
                    onClick={() => {
                      dispatch(loadSegmentsFromStartEndMark())
                      dispatch(setIsExpanded(false))
                    }
                    }
                  >
                    <Typography color={colors.grey[700]}>
                      load
                    </Typography>
                  </Button>
                </Tooltip>
              </MenuItem>
            </Grid >


            <Grid item>
              <MenuItem>
                <Tooltip title={'go to homepage'}>
                  <Button variant="contained"
                    onClick={() => {
                      dispatch(resetSegmetDataView())
                      dispatch(setIsSegmentAppBarShowen(false))
                      navigate('/')
                    }
                    }
                  > home </Button>
                </Tooltip>
              </MenuItem>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>

    <Paper style={{
    }} elevation={12} sx={{
      backgroundColor: colors.grey[50]
    }}
    >
      <Grid container alignContent={"center"} justifyContent={"center"} direction="column" sx={{
        width: "100%",
        height: "600"
      }}>
        <Grid item xs alignContent={"center"} justifyContent={"center"} sx={{ width: "80%", height: "50%" }}>
          {viewMapbox}
        </Grid>
        <Grid item xs sx={{ width: "80%", height: "50%" }}>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit >
            <MyApexCharts />
          </Collapse >
        </Grid>

      </Grid>
    </Paper>
    <Box sx={{ flexGrow: 1, display: (selectManagerAppBar ? 'inline' : 'none') }}>
      <AppBar position="static" >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Segment Performance Over Time
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <SegmentOverView />
  </Paper >
}


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <ExpandMoreIcon disableFocusRipple={true} {...other} justifyContent={"center"} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
