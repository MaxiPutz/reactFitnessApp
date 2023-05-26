const fs = require('fs')

let data = fs.readFileSync('./segment.json')
let workout = fs.readFileSync('../src/assets/workoutData.csv')
let meta = fs.readFileSync('../src/assets/metaData.csv')

workout = workout.toString().split('\n')
  .map(ele => ele.split(',').map(e => Number(e)))
meta = meta.toString().split('\n')
  .map(ele => ele.split(',').map(e => (e)))

data = JSON.parse(data)


let output = {
  metaData: [],
  workOutdata: []
}
let input = data.viewWorkoutSegement[0]

input.forEach((inEle) => {
  // console.log(inEle);
  output.metaData.push(meta.filter(ele => Number(ele[0]) == Number(inEle.id)))

  output.workOutdata.push(
    workout.filter(ele => Number(ele[0]) == Number(inEle.id))
      .filter(ele => ele[3] > inEle.startTime)
      .filter(ele => ele[3] < inEle.endTime)

  )
})

// console.log(output.workOutdata);


