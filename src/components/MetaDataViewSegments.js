import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom"

import { Grid, CircularProgress, Paper, Button, Typography, AppBar, Toolbar, Box, MenuItem, Tooltip } from "@mui/material"

import { loadBackgroundPictureRequested, loadWorkoutDataByIdRequested } from "./redux/csvManager";
import BackgroundView from "./BackgroundView";

import EventNoteIcon from '@mui/icons-material/EventNote';
import BoltIcon from '@mui/icons-material/Bolt';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import RouteIcon from '@mui/icons-material/Route';

import { setIsExpanded } from "./redux/stateManager"

export default function MetaDataView() {

  const selectMetaData2 = useSelector(state => state.CSV.viewMetadataSegment)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let val = <CircularProgress></CircularProgress>
  // console.log(selectMetaData2);
  if (selectMetaData2.length != 0) {


    val = <Grid container spacing={0} justifyContent={"center"} alignItems={"center"}>

      {


        selectMetaData2.map((selectMetaData, metadataIndex) => {
          return (<Grid item key={'selectMetadataGrid' + metadataIndex} style={{
            height: 230,
            width: 300
          }}>
            <Grid container spacing={0}
            > {selectMetaData.map((ele, index) => {
              //if (index >= 6) return
              return (
                <Paper key={'metaDataViewPaper' + index} style={{
                  height: 220,
                  minWidth: 250
                }}
                  elevation={0}
                  square sx={{
                    p: 0.4,
                    flexGrow: 10
                  }} >

                  <Button variant="contained"
                    onClick={async () => {
                      // console.log('clicki klick');
                      navigate('/workout/' + ele[0] + '/' + ele[2])
                      dispatch(loadWorkoutDataByIdRequested(ele[0]))
                      // window.scrollTo(0, 0)
                      dispatch(setIsExpanded(true))


                      window.scrollTo(1000, 1000)
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })


                    }}
                    sx={{ height: '100%', width: '100%' }}

                  >
                    <Grid container direction={"row"}

                    >
                      <Grid
                        xs
                        container
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography  >
                          <BackgroundView
                            id={ele[0]}></BackgroundView>
                        </Typography>
                      </Grid>
                      <Grid item justifyContent={"flex-end"}>
                        {/* <ViewID id={ele[0]} /> */}
                        <ViewWorkoutType workoutType={ele[1]} />
                        <ViewDate date={ele[2]} />
                        <ViewPower power={ele[3]} />
                        <ViewSpeed speed={ele[4]} />
                        <ViewHearthRate hearthRate={ele[5]} />
                        <ViewTotalTime totalTime={ele[6]} />
                        <ViewTotalDistance totalDistance={ele[7]} />
                      </Grid>
                    </Grid>
                  </Button>
                </Paper>


              )
            }
            )
              }
            </Grid>
          </Grid>
          )
        })
      }
    </Grid >


  }

  return <Paper>

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Selected Workouts
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    {val}
  </Paper>



}
function ViewID(props) {
  return <Grid container alignItems={"self-end"} justifyContent={"flex-end"}>
    <Tooltip title={"Workout ID"}>
      <Typography variant="body2" component="div" align="right">
        {props.id}
      </Typography>
    </Tooltip>
  </Grid>
}



function ViewWorkoutType(props) {
  return <Grid container alignItems={"self-end"} justifyContent={"flex-end"} >
    <Tooltip title={"Workout Type"}>

      <Typography variant="body2" component="div" align="right">
        {props.workoutType}
      </Typography>
    </Tooltip>

  </Grid>
}

function ViewDate(props) {
  return <Grid container alignItems={"center"} justifyContent={"flex-end"}>

    <Typography variant="div" component="div" align="right" justifyContent={"flex-end"} >
      {
        myDateParse(props.date)
      }
    </Typography>
    <Tooltip title={"Date"}>
      <EventNoteIcon />
    </Tooltip>


  </Grid>
}


function ViewPower(props) {
  return <Grid container alignItems={"self-end"} justifyContent={"flex-end"} display={"flex"}>

    <Typography variant="body2" component="div" align="right">
      {props.power}
    </Typography>
    <Tooltip title={"Power in W"}>
      <BoltIcon alignmentBaseline="after-edge" />
    </Tooltip>
  </Grid>
}

function ViewSpeed(props) {
  return <Grid container alignItems={"self-end"} justifyContent={"flex-end"} >
    <Typography variant="body2" component="div" align="right">
      {Number(props.speed).toFixed(2)}
    </Typography>
    <Tooltip title={"Speed in km/h"}>
      <SpeedIcon />
    </Tooltip>
  </Grid>
}

function ViewHearthRate(props) {
  return <Grid container xs alignItems={"self-end"} justifyContent={"flex-end"}>
    <Typography variant="body2" component="div" align="right">
      {Number(props.hearthRate).toFixed(2)}
    </Typography>
    <Tooltip title={"Heart rate in bpm"}>
      <MonitorHeartIcon />
    </Tooltip>
  </Grid>
}

function ViewTotalTime(props) {
  return <Grid container xs alignItems={"self-end"} justifyContent={"flex-end"}>
    <Typography variant="body2" component="div" align="right">
      {fancyTimeFormat(Number(props.totalTime).toFixed(2))}
    </Typography>
    <Tooltip title={"Workout time"}>
      <TimerIcon />
    </Tooltip>
  </Grid>
}

function ViewTotalDistance(props) {
  return <Grid container xs alignItems={"self-end"} justifyContent={"flex-end"}>
    <Typography variant="body2" component="div" align="right">
      {Number(props.totalDistance).toFixed(2)}
    </Typography>
    <Tooltip title={"Distance in KM"}>
      <RouteIcon />
    </Tooltip>
  </Grid>
}


function myDateParse(str) {
  //return str
  let d = str.split('T')[0].split('-')
  let year = d[0]
  let month = d[1]
  let day = d[2]

  return `${day}.${month}.${year}`
  const date = new Date(str)
  return `
    ${date.getDay().toString()}.
    ${date.getMonth().toString()}.
    ${date.getFullYear().toString()}

    `
}

function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
