import React from 'react'
// import classes from './GraphCss.css'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios'


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


class Graph extends React.Component{
    state = {
        vaccineInfo: [],
        highchartsSeries: [],
    myChart: {
        time: {
            timezone: 'Asia/Kolkata'
        },
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        // title: {
        //     text: 'Height Versus Weight of 507 Individuals by Gender'
        // },
        // subtitle: {
        //     text: 'Source: Heinz  2003'
        // },
        credits: {
            enabled: false
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Day'
            },
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                
                // second: '%d %b %Y'
            },
        },
        yAxis: {
            title: {
                text: 'Time'
            },
            min: 0,
            max: 24*60,
            tickInterval: 120,
            labels: {
                formatter: function () {
                    let minutes = this.value % 60
                    let hour = this.value / 60
                    let date = new Date(1970, 1, 1, hour, minutes, 0, 0)
                    return formatAMPM(date)
                }
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {

                return `<strong>${this.point.vaccine}</strong>`+'<br/>'+`Centre Name: ${this.point.centerName}` + '<br/>' + `Dose 1: ${this.point.dose1Quantity}` + '<br/>' +`Dose 2: ${this.point.dose2Quantitiy}`
                
            }
        },
        series: []

        // series: [
        //     {
        //         name: 'covacibn',
        //         data: [ {
        //             x: 123123,
        //             y: 2342343
                
        //         }]
        //     },
        //     {
        //         name: 'covisheidl',
        //         data: [ {
        //             x: 123123,
        //             y: 2342343
                
        //         }]
        //     }
        // ]
    }
}

    componentDidMount = () => {
        let getUrl = 'http://127.0.0.1:8000/slots/slotAvailabilityEvent/'
        axios.get(getUrl).then(res =>{
            this.prepareDataforVisuals(res.data)
        }).catch(err=>{
            console.log(err)
            document.write("Error Happened")
        })
    }

    getStartOfDay = (timestamp) => {
        let day = new Date(timestamp)
        day.setHours(5, 30, 0, 0)
        return day.getTime()
    }
    
    prepareDataforVisuals = (data) => {
        let seriesData = {}
        data.forEach(item  => {
            let {timestamp, day, time, vaccine, day_timestamp, time_timestamp, center_name, available_capacity_dose1, available_capacity_dose2} = item
            if (seriesData[vaccine] === undefined) {
                seriesData[vaccine] = []
            }                    


            let startOfDay = this.getStartOfDay(timestamp)
            console.log("startOfDay", startOfDay, day_timestamp)
            seriesData[vaccine].push({x: startOfDay, day: day, y: time_timestamp, time: time, centerName: center_name, dose1Quantity: available_capacity_dose1, dose2Quantitiy: available_capacity_dose2, vaccine: vaccine})
            console.log(seriesData)
        })

        let highchartsSeries = []

        Object.entries(seriesData).forEach(([key, value]) => {
            highchartsSeries.push({
                name: key,
                data: value,
            })
        })

        console.log('highchartSeries', highchartsSeries)
        this.setState({myChart: {series: highchartsSeries}})
    }
    
    render () {
        const {myChart} = this.state;
        
        return (
            <React.Fragment>
                <HighchartsReact highcharts = {Highcharts} options={myChart}/>
            </React.Fragment>
        )
    }
}
export default Graph