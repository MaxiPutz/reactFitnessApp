import axios from 'axios'



async function loadData() {

  const accessToken = sessionStorage.getItem("accessToken");
  console.log(accessToken, "accessToken")
  const api = sessionStorage.getItem("url")
  const bearer = "Bearer " + accessToken
  console.log(api)
  const serverData = await (fetch(api, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    }
  }))

  const jsonData = await serverData.json()
  // console.log(jsonData)

  return {
    metaData: jsonData.metadata.split("\n").filter(e => e).map(ele => ele.split(',')).map(ele1 => ele1.map(ele2 => ele2 == 'undefined' ? '' : ele2)),
    workoutData: jsonData.workoutData.split("\n").filter(e => e).map(ele => ele.split(',')).map((ele) => (ele.map(e => Number(e))))
  }
}


function loadMetaData() {
  return new Promise(async (res) => {
    let data = await axios(metaData)
    data = data.data.split('\n')
      .map(ele => ele.split(','))


    data.pop()
    data.shift()

    data = data.map(ele1 => ele1.map(ele2 => ele2 == 'undefined' ? '' : ele2))

    res(data)
  })
}

function loadworkoutData() {
  return new Promise(async (res) => {
    let data = await axios(workoutData)

    data = data.data.split('\n')
      .map(ele => ele.split(','))

    data.pop()
    data.shift()
    data = data.map((ele) => (ele.map(e => Number(e))))
    res(data)
  })
}

function workoutFilterdById(workoutData, id) {
  return new Promise((res, rej) => {
    //console.log(workoutData, id);
    let val =
      workoutData.filter((ele) => ele[0] == id)
    res(val)
  })
}

function calcPic(idList) {
  return new Promise((res) => {
    if (idList.length == 0) return res({
      pathString: '',
      squareInPX: '',
      id: '',
      component: ''
    })
    const id = idList[0][0]
    idList = idList
      .map(ele => [Number(ele[1]), Number(ele[2]), Number(ele[3])])

    //idList.sort((ele1, ele2) => ele1[3] < ele2[3] ? -1 : 1)
    const path = scalePathToSquare(idList, 150)
    const svgEle = svgElement(path.stringPathForSVG, path.squareInPX)

    res({
      pathString: path.stringPathForSVG,
      squareInPX: path.squareInPX,
      id: id,
      component: svgEle
    })
  })
}


function loadAllBackgroundPicture() {
  return new Promise(async (res, rej) => {
    // console.log("waiting for load pictures");
    let data = await axios(picture)
    // console.log(data);
    res("data.data")
  })
}


const getMaxMinCoordinates = (listLatLongTimerTime) => {
  let listLat = listLatLongTimerTime.map(ele => ele[0])
  let listLong = listLatLongTimerTime.map(ele => ele[1])

  let minLat = Math.min(...listLat)
  let maxLat = Math.max(...listLat)
  let minLong = Math.min(...listLong)
  let maxLong = Math.max(...listLong)


  return {
    maxLong: maxLong,
    minLong: minLong,
    maxLat: maxLat,
    minLat: minLat
  }
}

const scalePathToSquare = (listLatLongTimerTime, squareInPX) => {
  listLatLongTimerTime = listLatLongTimerTime.filter((ele) => ele[0] != '')
  let minMaxCoordinates = getMaxMinCoordinates(listLatLongTimerTime)

  //console.log(minMaxCoordinates);

  let difLong = minMaxCoordinates.maxLong - minMaxCoordinates.minLong
  let difLat = minMaxCoordinates.maxLat - minMaxCoordinates.minLat
  let highterPath = difLong > difLat ? difLong : difLat

  let scaleFactor = squareInPX / highterPath


  if (difLat < difLong) {
    minMaxCoordinates.minLat += (difLat / 2)
    minMaxCoordinates.minLat -= squareInPX / 2 / scaleFactor
  }




  listLatLongTimerTime
    .sort((ele1, ele2) => {
      return ele1[2] < ele2[2] ? -1 : 1
    })
  //console.log(listLatLongTimerTime);

  if (listLatLongTimerTime.length == 0) {
    return {
      stringPathForSVG: 'M NaN NaN',
      squareInPX: squareInPX

    }
  }

  let listLatLongString = listLatLongTimerTime.map(ele =>
    [(ele[1] - minMaxCoordinates.minLong) * scaleFactor,
    (ele[0] - minMaxCoordinates.minLat) * scaleFactor])
    .map(ele => ele.join(' ')).join(' L ')

  //console.log(listLatLongString);

  return {
    stringPathForSVG: 'M ' + listLatLongString,
    squareInPX: squareInPX
  }
}

const svgElement = (stringPathForSVG, squareInPX) => {
  let transformVal = "scale(1, -1) translate(0, -" + squareInPX + ")"
  return transformVal
}

// radius in ca 1 meter
const isCoordinateInMark = (mark, coordinate, radius = 1) => {
  const earthRaduis = 6371008.8
  const rad = Math.PI / 180
  const lat1 = mark.lat * rad
  const lat2 = coordinate.lat * rad
  const a =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.cos((mark.long - coordinate.long) * rad)

  const maxMeter = earthRaduis *
    Math.acos(Math.min(a, 1))

  return maxMeter < radius
}



export { loadData, isCoordinateInMark, loadMetaData, loadworkoutData, calcPic, workoutFilterdById, loadAllBackgroundPicture, getMaxMinCoordinates }
