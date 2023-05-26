
import React from "react";
import Chart from "react-apexcharts"
import { Paper, Grid } from "@mui/material"

export default function MyApexChartEvolutionProps(props) {
  const label = props.label
  const xAxis = props.xAxis
  const yAxis = props.yAxis

  // console.log(props);
  let xaxis = yAxis.map(ele => ele)
  xaxis.sort((ele1, ele2) => euroDateStringToDate(ele1.meta[2]) < euroDateStringToDate(ele2.meta[2]) ? -1 : 1)
  let yaxis = []

  xaxis.forEach(ele => {
    let val = 0
    ele.arr.forEach(e => val += e)
    yaxis.push(val / ele.arr.length)
  })


  // console.log(label, xaxis, yaxis);


  // console.log(xaxis.map(ele => (ele.meta[2])));
  const options = chartTemplate(xaxis.map(ele => (ele.meta[2])), yaxis, label, 'helo')
  // console.log(options);
  return <Chart
    options={options.options}
    series={options.series}
    type={options.type}
  ></Chart>

}


const chartTemplate = (xAxis, yAxis, label, id = "myChar2") => {
  // console.log(xAxis);
  //xAxis = xAxis.map(ele => euroDateStringToDate(ele))
  return ({
    options: {
      chart: {
        xaxis: xAxis
      },
      yaxis: {
        labels: {
          formatter: (ele) => (ele)
        }
      },
      xaxis: {
        categories: xAxis
        // labels: {
        //     formatter: (ele) => Date(ele)
        // }
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


function euroDateStringToDate(str) {
  const [d, m, y] = str.split('.')

  return new Date(Number(y), Number(m) + 1, Number(d))
}


function myDateParse(str) {
  let d = str.split('T')[0].split('-')
  let year = d[0]
  let month = d[1]
  let day = d[2]
  return `${day}.${month}.${year}`


  const date = new Date(str)
  // console.log(date);
  return `
    ${date.getDay().toString()}.
    ${date.getMonth().toString()}.
    ${date.ge().toString()}

    `
} 
