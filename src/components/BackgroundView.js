import React from "react";
import { useSelector } from "react-redux";

import AssistWalkerIcon from '@mui/icons-material/AssistWalker'
import {Typography} from "@mui/material"

export default function BackgroundView(props) {
    let px = props.scale === undefined ? 150 : 150 * props.scale


    let select = useSelector((state) => state.CSV.backGroundPictureComponents)
    const stroke = props.stroke === undefined ? "white" : props.stroke
    // console.log(props.id);
    let view = <AssistWalkerIcon sx={{ height: px, width: px }} ></AssistWalkerIcon>

    const found = select.find(ele => ele.id == props.id)
    if (found != undefined  && !found.pathString.includes('M NaN NaN')){
        view = <svg width={px} height={px} >

            <path d={found.pathString}
            fill="transparent" stroke={stroke} 
            transform={ props.scale == undefined ? found.component : 
                found.component.replace("scale(1, -1) translate(0, -150)", `scale(${props.scale}, -${props.scale}) translate(0, -${150})`) }
            > </path>

        </svg>
    }
    return view
}