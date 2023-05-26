
function DrawLineChart(props) {
    // const ref = useRef();
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        // Tooltip,
        Legend
    )

    if (props.CSV == undefined) return <CircularProgress></CircularProgress>

    let CSV = props.CSV.map(ele => ele.map(e => Number(e)))
    CSV.sort((ele1, ele2) => ele1[3] < ele2[3] ? -1 : 1)
    let time = CSV.map(ele => ele[3])
    let power = CSV.map(ele => ele[4])
    let speed = CSV.map(ele => ele[5])
    let hearthRate = CSV.map(ele => ele[6])



    const data = {
        labels: time,
        datasets: [
            {
                label: 'Power',
                data: power,
                fill: true,

                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: colors.yellow[400]
            },
            {
                label: 'Speed',
                data: speed,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: colors.blue[400]
            },
            {
                label: 'Heart rate',
                data: hearthRate,
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: colors.red[400]
            }
        ],
    };

    return <Paper elevation={4} sx={{
        height: "50%",
        width: "40%"
    }}>
        <Line
            // height={300}
            // width={"100%"}
            // ref={ref} 
            options={{ maintainAspectRatio: false }}
            data={data} />
    </Paper>

}
