import React from 'react'
// import classes from './GraphCss.css'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';


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
        apiData: [],
        highchartsSeries: [],
        centersInSelectedDisctrict: null,
        isLoading: true,
        myChart: {
            time: {
                timezone: 'Asia/Kolkata'
            },
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Vaccination slot availability analysis.'
            },
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
                series: {
                    turboThreshold: 20000
                },
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                }
            },
            tooltip: {
                formatter: function () {

                    return `<strong>${this.point.vaccine}</strong><br/>Centre Name: ${this.point.centerName}<br/>Cost: ${this.point.cost} Dose 1: ${this.point.dose1Quantity} Dose 2: ${this.point.dose2Quantitiy}<br/>**Doses available on ${new Date(this.point.eventTimestampValue).getDate()}/
                                        ${new Date(this.point.eventTimestampValue).getMonth() + 1}/${new Date(this.point.eventTimestampValue).getFullYear()}`
                    
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

    componentDidUpdate = (prevProps, prevState, Snapshot) => {
        if(prevProps.dataObject !== this.props.dataObject){
            this.setState({
                apiData: this.props.dataObject,
                isLoading: true,
            },()=>{
                this.prepareDataforVisuals(this.state.apiData)
            })
        }
    }
    

    componentDidMount = () => {
        if(this.props.dataObject.length!==0){
            this.setState({
                apiData: this.props.dataObject,
                isLoading: true
            },()=>{
                this.prepareDataforVisuals(this.state.apiData)
            })
        }else{
            this.setState({
                apiData: [],
                isLoading: false
            })
        }
        // let getUrl = 'http://127.0.0.1:8000/slots/slotAvailabilityEvent/ '
        // axios.get(getUrl).then(res =>{
        //     console.log(res.data)
        //     this.prepareDataforVisuals(res.data)
            
        // }).catch(err=>{
        //     console.log(err)
        //     document.write("Error Happened")
        // })
        // this.setState({
        //     ...this.state,
        //     apiData: this.props.dataObject
        // }, ()=>{
        //     this.prepareDataforVisuals(this.state.apiData)
        // })
    }

    getStartOfDay = (timestamp) => {
        let day = new Date(timestamp)
        day.setHours(5, 30, 0, 0)
        return day.getTime()
    }
    prepareDataforVisuals = (data) => {
        console.log("prepareDataforVisuals: ", data)
        let seriesData = {}
        let vaccine = null
        let availableCapacityDose1 = null
        let availableCapacityDose2 = null
        let vaccineCost = null
        let eventTimestamp = null
        data.forEach(item  => {
            let event_details_json = JSON.parse(item['event_details_json'])
            // console.log("event_details_json VACCINE NAME: ", event_details_json['session'][0]['vaccine'])
            vaccine = event_details_json['session'][0]['vaccine']
            vaccine = event_details_json['session'][0]['vaccine']
            // console.log("VACCINE NAME: ",vaccine)
            availableCapacityDose1 = event_details_json['session'][0]['available_capacity_dose1']
            availableCapacityDose2 = event_details_json['session'][0]['available_capacity_dose2']
            vaccineCost = event_details_json['session'][0]['cost']
            eventTimestamp = event_details_json['session'][0]['timestamp'] * 1000

            let {timestamp, day, time, day_timestamp, time_timestamp, center_name} = item
            if (seriesData[vaccine] === undefined) {
                seriesData[vaccine] = []
            }                    


            let startOfDay = this.getStartOfDay(timestamp)
            // console.log("startOfDay", startOfDay, day_timestamp)
            
            seriesData[vaccine].push({x: startOfDay, day: day, y: time_timestamp, time: time, centerName: center_name, dose1Quantity: availableCapacityDose1, dose2Quantitiy: availableCapacityDose2, vaccine: vaccine,
                                    eventTimestampValue: eventTimestamp, cost: vaccineCost})
            // console.log("Series Data: ",seriesData)
        })

        let highchartsSeries = []

        Object.entries(seriesData).forEach(([key, value]) => {
            highchartsSeries.push({
                name: key,
                data: value,
            })
        })
        // console.log('highchartSeries', highchartsSeries)
        this.setState({myChart: {series: highchartsSeries}, isLoading: false})
    }
    render () {
        // console.log(this.state.dataObject)
        const {myChart} = this.state;      
        return (
            <React.Fragment>
                {this.state.isLoading?
                    <div>
                        <div class="spinner-border text-warning" role="status">
                            <span class="sr-only"></span>
                        </div>
                        <p>Please wait, your chart is loading.</p>
                    </div>:
                     null
                    }
                {this.state.apiData.length !== 0?
                <div>
                    <HighchartsReact highcharts = {Highcharts} options={myChart}/>: 
                </div>
                :
                <div class="alert alert-danger" role="alert">
                Sorry, no data available for the selected option.
              </div>
              }
            </React.Fragment>
        )
    }
}
export default Graph