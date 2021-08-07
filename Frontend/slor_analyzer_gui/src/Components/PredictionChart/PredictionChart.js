import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);


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

function getStartOfDay(timestamp){
    let day = new Date(timestamp)
    day.setHours(5, 30, 0, 0)
    return day.getTime()
}

const FormatTimeString = (value) => {
    let hours, minutes = null
    let divisionValue = (value/60)
    hours = Math.floor(divisionValue.toFixed(2))
    if (hours == 0){
        hours = 12
    }
    minutes = (divisionValue.toFixed(2) - hours)
    // console.log("Division value: ", divisionValue)
    // console.log("Hours: ", hours)
    // console.log("Minutes: ", minutes)
    if (minutes > 0.60){
        // hours += 1
        minutes = parseFloat(0.60 - (minutes - 0.60))
        // console.log("Minutes: ", minutes)
    }
    return hours <= 12 ? (hours.toString()+":"+minutes.toFixed(2).toString().split('.')[1]+" am") : ((hours - 12).toString()+":"+minutes.
    toFixed(2).toString().split('.')[1]+" pm")
}



class PredictionChart extends React.Component{

    state = {
        myChart: {
            chart: {
                type: 'columnrange',
                zoomType: 'xy'
            },
            title: {
                text: 'Predictions for vaccine slot availability events.'
            },

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
                    
                },
            },
            yAxis: {
                title: {
                    text: 'Time'
                },
                min: 0,
                max: 24*60,
                minRange: 1,
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
            tooltip: {
                formatter: function(){
                    // console.log("Options for tooltip: ",this.point.options)
                    let EventStartTime = FormatTimeString(this.point.options.low)
                    let EventEndTime = FormatTimeString(this.point.options.high)
                    // let EventRangeStartTime = (this.point.options.low/60).toFixed(2)
                    // let EventRangeEndTime = (this.point.options.high/60).toFixed(2)
                    // let EventRangeStartTimeFormat = EventRangeStartTime < 12?  EventRangeStartTime.toString().replace('.', ':')+' am': EventRangeStartTime.toString().replace('.',':')+' pm'
                    // let EventRangeEndTimeFormat = EventRangeEndTime < 12?  EventRangeEndTime.toString().replace('.', ':')+' am': EventRangeEndTime.toString().replace('.',':')+' pm'
                    // let EventRangeEndTime = formatAMPM(this.point[2])
                    return `Name: ${this.point.series.name} <br/>Predicted Time Range: ${EventStartTime} ~ ${EventEndTime}`
                }
            },
            plotOptions: {
                series: {
                    turboThreshold: 20000,
                    grouping: false
                },
                columnrange: {
                  
                }
                
            },
            series: []
        }
    }

    prepareDataforVisuals = (data) => {
        if (!data){
            return
        }
        // console.log("Prediciton Chart prepareDataforVisuals: ", data)
        let seriesData = {'EventsAverage': [], 'EventsRange': []}


        let highchartsSeries = []

        let timeStatistics = data['time_statistics_json']
        let forecasts = data['forecast_json'];

        forecasts.map(([dateString, prediction]) => {
            if (prediction == 1.0) {

                let timestamp = new Date(dateString).getTime()

                let x = timestamp
                let y = parseInt(timeStatistics.mean)
                let EventsRangeStartTime = new Date(x).se
                seriesData['EventsRange'].push([x, timeStatistics.min, timeStatistics.max])
                seriesData['EventsAverage'].push([x, timeStatistics.mean - timeStatistics.std, timeStatistics.mean + timeStatistics.std])
                // console.log("Series Data: ", seriesData)
            }
        })
        

        

        Object.entries(seriesData).forEach(([key, value]) => {
            if (key === 'EventsRange') {
                highchartsSeries.push({
                    name: key,
                    data: value,
                    pointWidth: 10,
                    visible: false
                })
            } else {
                highchartsSeries.push({
                    name: key,
                    data: value,
                    pointWidth: 35,
                })
            }
        })

        // console.log('highchartSeries', highchartsSeries)
        this.setState({myChart: {series: highchartsSeries}, isLoading: false})
    }





    componentDidUpdate = (prevProps, prevState, Snapshot) => {
        // console.log("this.props.predictionData: ", this.props.predictionData)
        if (prevProps.predictionData != this.props.predictionData){
            this.prepareDataforVisuals(this.props.predictionData)
        }
    }

    componentDidMount = () =>{
        // console.log("this.props.predictionData: ", this.props.predictionData)
        this.prepareDataforVisuals(this.props.predictionData)
    }

    render(){
        const {myChart} = this.state
        return (
            <div>
                {this.props.predictionData && <HighchartsReact highcharts = {Highcharts} options={myChart}/>}
            </div>
        )
    }
}

export default PredictionChart