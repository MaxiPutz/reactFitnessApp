import react from "react"
import { useSelector } from "react-redux"
import Chart from "react-apexcharts"
import { Paper, Grid } from "@mui/material"
import { TenMpOutlined } from "@mui/icons-material"


export function MyApexCharts() {
    const select = useSelector((state => state.CSV.viewWorkoutData))
    let yObj = {
        Power_in_W: [],
        Speed_in_km_per_h: [],
        Heart_rate_in_bpm: []
    }
    let times = []

    let tmp = shirnkCSVByAverage(select)

    tmp.forEach(ele => {
        times.push(Number(ele[3]))
        yObj.Power_in_W.push(Number(ele[4]))
        yObj.Speed_in_km_per_h.push(Number(ele[5]))
        yObj.Heart_rate_in_bpm.push(Number(ele[6]))
    });

    const data = Object.entries(yObj).map(([label, yAxis]) => chartTemplate(times, yAxis, label.split('km_per_h').join('km/h').split('_').join(' ') ))

    return <Grid container direction="row" xs>
        {data.map((ele, i) => {
            return <Grid item xs={12} md={4} lg={4} key={`ApexChart3${i}`} >
                <Chart key={`ApexChart2${i}`}
                    options={ele.options}
                    series={ele.series}
                    type={ele.type}
                ></Chart>
            </Grid>

        })
        }
    </Grid>
}

export function MyApexChartsProps(props) {
    const label = props.label
    const xAxis = props.xAxis
    const yAxis = props.yAxis

    // console.log(label, xAxis, yAxis);

    const yaxis = yAxis.map(ele => {
        ele.arr = shirnkArrByAverage(ele.arr)
        return ele
    })

    const xaxis = shirnkArrByAverage(xAxis)


    const options = chartsTemplate2(xaxis, yaxis, 'Max1', label)
    // console.log(options);
    return <Chart
        options={options.options}
        series={options.series}
        type={options.type}
    ></Chart>

}

const shirnkCSVByAverage = (CSV = [], outPutArrLength = 15) => {
    if (CSV.length <= outPutArrLength) {
        // console.log(CSV.length)
        return CSV
    }

    let skip = Math.ceil(CSV.length / outPutArrLength)
    let output = []
    for (let i = 0; i < CSV.length; i += skip) {
        let tmp = [...new Array(CSV[i].length).fill(0)]
        for (var j = 0; j < skip && (i + j) < CSV.length; j += 1) {
            tmp = tmp.map((ele, index) => (Number(CSV[i + j][index]) + ele))
        }
        output.push(tmp.map(ele => (ele / j)))
    }
    return output
}

const shirnkArrByAverage = (arr = [], outPutArrLength = 15) => {
    if (arr.length <= outPutArrLength) {

        // console.log(arr.length)
        return arr
    }

    let skip = Math.ceil(arr.length / outPutArrLength)
    let output = []
    for (let i = 0; i < arr.length; i += skip) {
        let tmp = 0
        for (var j = 0; j < skip && (i + j) < arr.length; j += 1) {
            tmp += arr[i + j]
        }
        output.push(tmp / j)
    }
    return output
}



const chartTemplate = (xAxis, yAxis, label, id = "myChar") => {
    return ({
        options: {
            chart: {
                xaxis: xAxis
            },
            yaxis: {
                labels: {
                    formatter: (ele) => Number(ele).toFixed(0)
                }
            },
            xaxis: {
                categories: xAxis,
                labels: {
                    
                    formatter: (ele) => fancyTimeFormat( Number(ele) ) //% 60 != 0 ? '' : ele
                }
            },
            title: {
                text: `${label}`,
                align: 'left'
            }
        },
        series: [{
            name: label,
            data: yAxis
        }],
        type: "line"
    })
}


const chartsTemplate2 = (xAxis, yAxis, id = "1", label) => {
    return ({
        options: {
            chart: {
                xaxis: xAxis
            },
            xaxis: {
                categories: xAxis,
                labels: {
                    formatter: (ele) => fancyTimeFormat( Number(ele) )
                }
            }, yaxis: {
                labels: {
                    formatter: (ele) => Number(ele).toFixed(0)
                }
            },
            title: {
                text: `${label}`,
                align: 'left'
            },   stroke: {
                width: 1.5
            }
        },

     
        series: yAxis.map(ele => ({
            name: ele.meta[2],
            data: ele.arr
        })),
        type: "line"
    })
}


const chartsTemplate = (xAxis, yAxisObj, id = "basic-bar") => {
    return ({
        options: {
            chart: {
                xaxis: xAxis
            }
        },
        series: Object.entries(yAxisObj).map(([label, yAxis]) => {
            return ({
                name: label,
                data: yAxis
            })
        }),

        type: "line"
    })
}




function fancyTimeFormat(duration)
{   
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
