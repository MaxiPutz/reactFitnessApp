import react, { useEffect } from "react"
import { AppBar, Box, Grid, Paper, Toolbar, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { MyApexChartsProps } from "./MyApexChart"
import { viewMetadataSegment } from "./redux/csvManager"
import MetaDataViewSegments from "./MetaDataViewSegments"
import MyApexChartEvolutionProps from "./MyApexChartsEvolution";


export default function SegmentOverView() {
  const dispatch = useDispatch()

  const selectSegmentsMetadata = useSelector((state) => state.CSV.segementMetaData)
  const selectThisView = useSelector(state => state.CSV.viewWorkoutData)
  const selectWorkoutdata = useSelector(state => state.CSV.workoutData)
  const selectMetadata = useSelector(state => state.CSV.metaData)


  let viewData = []
  let viewMetaData = []


  useEffect(() => {
    dispatch(viewMetadataSegment(viewMetaData))
  }, ...viewMetaData)

  // console.log('test', selectThisView.length);
  if (selectSegmentsMetadata.length == 0 || selectWorkoutdata.length == 0 || selectThisView.length == 0) return <div></div>
  // console.log('test3');




  selectSegmentsMetadata.forEach((inEle) => {
    // console.log(inEle);
    viewData.push(
      selectWorkoutdata
        .filter(ele => Number(ele[0]) == Number(inEle[0]))
        .filter(ele => ele[3] > inEle[1])
        .filter(ele => ele[3] < inEle[2])
    )

    const tmp = selectMetadata.filter(ele => Number(ele[0]) == Number(inEle[0]))
    if (tmp.length != 0) { // ther is a issue selectMetadata find a id which is not right
      viewMetaData.push(tmp)
    }
    // console.log(inEle);
    // console.log(viewMetaData);
  })

  // viewMetaData.map((ele, i) => [i, ele[3], ele[4], ele[5]])
  viewData = viewData.filter(ele => ele.length != 0)
  // console.log(viewData);


  let hearrateObj = []
  let heartrate = []
  let power = []
  let speed = []
  let maxLength = 0
  viewData.forEach(ele => {
    // console.log(ele)
    // console.log(viewMetaData);
    let meta = viewMetaData.find(e => Number(e[0][0]) == Number(ele[0][0]))
    // console.log(meta);
    if (meta == undefined) { // ther is a issue selectMetadata find a id which is not right
      return
    }
    meta = [...meta[0]]
    // console.log(meta[2]);
    meta[2] = myDateParse(meta[2])
    // console.log(meta[2]);
    // console.log(ele[0][0]);
    // console.log(meta);
    hearrateObj.push(({
      arr: ele.map(e => e[6]),
      meta: meta
    }))
    heartrate.push({ arr: ele.map(e => e[6]), meta: meta })
    power.push({ arr: ele.map(e => e[4]), meta: meta })
    speed.push({ arr: ele.map(e => e[5]), meta: meta })
    maxLength = maxLength < ele.length ? ele.length : maxLength
  })

  let temp = []
  for (let i = 0; i < maxLength; i++) temp.push(i)


  // console.log(viewMetaData);

  // console.log(temp, hearrateObj);
  return (
    <Paper>

      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartEvolutionProps label='Power in W' xAxis={temp} yAxis={power} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartEvolutionProps label='Speed in km/h' xAxis={temp} yAxis={speed} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartEvolutionProps label='Heart rate in bpm' xAxis={temp} yAxis={heartrate} />
        </Grid>


        <Grid item xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Detail Segment Performance Over Time
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
        </Grid>


        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartsProps label='Power in W' xAxis={temp} yAxis={power} ></MyApexChartsProps>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartsProps label='Speed in km/h' xAxis={temp} yAxis={speed} ></MyApexChartsProps>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MyApexChartsProps label='Heart rate in bpm' xAxis={temp} yAxis={heartrate} ></MyApexChartsProps>
        </Grid>
        <Grid item xs={11} >
          <MetaDataViewSegments />
        </Grid>
      </Grid>
    </Paper>
  )

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
