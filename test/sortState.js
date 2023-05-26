const sortState = function (initState) {

  // console.log(initState);


  this.state = initState ? initState : {
    isUpward: false,
    sortElement: {
      date: true,
      heartRate: false,
      power: false,
      distance: false,
      time: false,
      speed: false
    }
  }

  // console.log(this.state);

  const setSort = (sortElement) => {
    let state2 = this.state
    // console.log(state2.sortElement)
    // console.log(state2.sortElement[sortElement])
    if (state2.sortElement[sortElement]) {
      state2.isUpward = !state2.isUpward
      return state2
    }

    Object.keys(state2.sortElement).forEach(key => state2.sortElement[key] = false)
    state2.isUpward = false
    state2.sortElement[sortElement] = true
    return state2
  }

  const getCSVSortfunction = () => {
    const trueKey = Object.entries(this.state.sortElement).find(([key, val]) => val == true)[0]

    const constCSVIndex =
      ['id', 'date', 'sport', 'power', 'speed', 'heartRate', 'time', 'distance']
        .map((ele, i) => ele == trueKey ? i : false).find(ele => ele != false)
    const multi = state.isUpward ? -1 : 1

    // console.log(constCSVIndex);
    // console.log(trueKey);
    // console.log(multi);

    let cast = (ele) => {
      if (trueKey == 'date') return new Date(ele)
      return Number(ele)
    }
    return (ele1, ele2) => cast(ele1[constCSVIndex]) > cast(ele2[constCSVIndex]) ? multi * (-1) : (multi * 1)
  }

  return {
    getState: JSON.parse(JSON.stringify(this.state)),
    setSort: setSort,
    getCSVSortfunction: getCSVSortfunction
  }
}


function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

const state = new sortState()

let arr = [
  [1, 2, 1, 3, 3, 0, 'atime', 'acdistance'],
  [1, 3, 1, 4, 4, 'bheartRate', 'time', 'distance'],
  [1, 4, 1, 1, 1, 'heartRate', 'time', 'distance'],
  [1, 1, 1, 2, 2, 'cheartRate', 'btime', 'distance']
]

let old = [...arr]

arr.sort(state.getCSVSortfunction())
// console.log('date', arr, old)

state.setSort('time')
arr.sort(state.getCSVSortfunction())
// console.log('time', arr, old)
state.setSort('distance')
arr.sort(state.getCSVSortfunction())
// console.log('distance', arr, old)
state.setSort('heartRate')
arr.sort(state.getCSVSortfunction())
// console.log('hearRate', arr, old)
state.setSort('power')
arr.sort(state.getCSVSortfunction())
// console.log('power', arr, old)



