import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom"

import { Grid, CircularProgress, Paper, Button, Typography, AppBar, Toolbar, Box, MenuItem, Tooltip, IconButton, Collapse } from "@mui/material"

import { loadBackgroundPictureRequested, loadWorkoutDataByIdRequested } from "./redux/csvManager";
import BackgroundView from "./BackgroundView";

import EventNoteIcon from '@mui/icons-material/EventNote';
import BoltIcon from '@mui/icons-material/Bolt';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import RouteIcon from '@mui/icons-material/Route';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StraightIcon from '@mui/icons-material/Straight';
import { styled } from "@mui/material";
import { setSortState } from "./redux/stateManager";


export default function MetaDataView() {
  const selectMetaData = useSelector(state => state.CSV.metaData)
  let selectFilterState = useSelector(state => state.manager.sortState)




  const dispatch = useDispatch()
  const navigate = useNavigate()
  let val = <CircularProgress></CircularProgress>
  if (selectMetaData.length != 0) {

    val = <Grid container spacing={0}
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
              navigate('/workout/' + ele[0] + '/' + myDateParse(ele[2]))
              dispatch(loadWorkoutDataByIdRequested(ele[0]))
            }}
            sx={{ height: '100%', width: '100%' }}

          >
            <Grid container direction={"row"}

            >
              <Grid
                item
                xs
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography  >
                  <BackgroundView
                    id={ele[0]}  ></BackgroundView>
                </Typography>
              </Grid>
              <Grid item justifyContent={"flex-end"}>
                {/* <ViewID id={ele[0]} style={{hide: true}} /> */}
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


  }

  return <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <MenuItem onClick={() => dispatch(setSortState({ state: selectFilterState, toSort: 'power' }))}>
          <Collapse in={selectFilterState.getState.sortElement.power} timeout="auto" unmountOnExit>
            <SortIcon
              expand={!selectFilterState.getState.isUpward}
              aria-expanded={selectFilterState.getState.isUpward}
              aria-label="show more">
            </SortIcon>
          </Collapse>
          <BoltIcon></BoltIcon>
        </MenuItem>

        <MenuItem onClick={() => dispatch(setSortState({ state: selectFilterState, toSort: 'heartRate' }))}>
          <Collapse in={selectFilterState.getState.sortElement.heartRate} timeout="auto" unmountOnExit>
            <SortIcon
              expand={!selectFilterState.getState.isUpward}
              aria-expanded={selectFilterState.getState.isUpward}
              aria-label="show more">
            </SortIcon>
          </Collapse>
          <MonitorHeartIcon></MonitorHeartIcon>
        </MenuItem>

        <MenuItem onClick={() => dispatch(setSortState({ state: selectFilterState, toSort: 'date' }))}>
          <Collapse in={selectFilterState.getState.sortElement.date} timeout="auto" unmountOnExit>
            <SortIcon
              expand={!selectFilterState.getState.isUpward}
              aria-expanded={selectFilterState.getState.isUpward}
              aria-label="show more">
            </SortIcon>
          </Collapse>
          <EventNoteIcon></EventNoteIcon>
        </MenuItem>

        <MenuItem onClick={() => dispatch(setSortState({ state: selectFilterState, toSort: 'time' }))}>
          <Collapse in={selectFilterState.getState.sortElement.time} timeout="auto" unmountOnExit>
            <SortIcon
              expand={!selectFilterState.getState.isUpward}
              aria-expanded={selectFilterState.getState.isUpward}
              aria-label="show more">
            </SortIcon>
          </Collapse>
          <TimerIcon></TimerIcon>
        </MenuItem>

        <MenuItem onClick={() => dispatch(setSortState({ state: selectFilterState, toSort: 'distance' }))}>
          <Collapse in={selectFilterState.getState.sortElement.distance} timeout="auto" unmountOnExit>
            <SortIcon
              expand={!selectFilterState.getState.isUpward}
              aria-expanded={selectFilterState.getState.isUpward}
              aria-label="show more">
            </SortIcon>
          </Collapse>
          <RouteIcon></RouteIcon>
        </MenuItem>
      </Toolbar>
    </AppBar>
    {val}
  </Box>


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
      {props.power == -1 ? 0 : props.power}
    </Typography>
    <Tooltip title={"Power w"}>
      <BoltIcon alignmentBaseline="after-edge" />
    </Tooltip>
  </Grid>
}

function ViewSpeed(props) {
  return <Grid container alignItems={"self-end"} justifyContent={"flex-end"} >
    <Typography variant="body2" component="div" align="right">
      {Number(props.speed).toFixed(2)}
    </Typography>
    <Tooltip title={"Speed in KM/H"}>
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
    <Tooltip title={"Distance in km"}>
      <RouteIcon />
    </Tooltip>
  </Grid>
}






function myDateParse(str) {
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

const SortIcon = styled((props) => {
  const { expand, ...other } = props;
  return <StraightIcon {...other} justifyContent={"center"} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

