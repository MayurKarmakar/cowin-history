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
        isLoading: '',
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
                    let cost = null
                    this.point.cost == null? cost='No information': cost=this.point.cost
                    let s = `Centre Name: ${this.point.centerName}<br/>Cost: ${cost}<br/>`
                    let eventDetails = this.point.eventDetails;
                    this.point.eventDetailsJson.sessions.map((eventDetails) => {
                        s += `<b>${eventDetails.vaccine}</b><br/>**Doses available on ${new Date(eventDetails.timestamp).toISOString().slice(0, 10)}<br/>`
                        s += `Dose1 = ${eventDetails.available_capacity_dose1} Dose2 = ${eventDetails.available_capacity_dose2}<br/>`
                    })

                    return s                    
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
        console.log("Props received: [COmponent Did UPdate]", this.props.dataObject)
        if(prevProps.dataObject !== this.props.dataObject){
            this.setState({
                apiData: this.props.dataObject,
                isLoading: true,
            },()=>{
                // console.log("Is loading: ", this.state.isLoading)
                this.prepareDataforVisuals(this.state.apiData)
            })
        }

        if (prevProps !== this.props){
            this.setState({
                myChart: {
                    title: {
                        text: this.createChartTitle()
                    }
                }
            })
        }
    }
    
    createChartTitle = () => {
        let {stateName, districtName, centerName, pincode, searchMode} = this.props
        let title = ''

        if (searchMode == 'state-dist'){
            title += ` <b>State</b>: ${stateName} and <b>District</b>: ${districtName}`
        }else if (searchMode === 'center'){
            title += ` <b>State</b>: ${stateName} and <b>Center</b>: ${centerName}`
        }else if (searchMode === 'pincode'){
            title += ` <b>Pincode</b>: ${pincode}`
        }

        return title
    }

    componentDidMount = () => {
        console.log("Props received: [COmponent Did Mount]", this.props.dataObject)
        if(this.props.dataObject.length !== 0){
            this.setState({
                apiData: this.props.dataObject,
                isLoading: true,
                myChart: {
                    title: {
                        text: this.createChartTitle()
                    }
                }
            },()=>{
                // console.log("Is loading: ",this.state.isLoading)
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
        let seriesData = {'Events': []}

        data.forEach(item  => {
            let event_details_json = item['event_details_json']
            // console.log("event_details_json VACCINE NAME: ", event_details_json['sessions'][0]['vaccine'])
            // vaccine = event_details_json['sessions'][0]['vaccine']
            // vaccine = event_details_json['sessions'][0]['vaccine']
            // console.log("VACCINE NAME: ",vaccine)
            // availableCapacityDose1 = event_details_json['sessions'][0]['available_capacity_dose1']
            // availableCapacityDose2 = event_details_json['sessions'][0]['available_capacity_dose2']
            // vaccineCost = event_details_json['sessions'][0]['cost']
            // eventTimestamp = event_details_json['sessions'][0]['timestamp'] * 1000

            let {timestamp, day, time, day_timestamp, time_timestamp, center_name} = item

            let startOfDay = this.getStartOfDay(timestamp)
            // console.log("startOfDay", startOfDay, day_timestamp)
            
            seriesData['Events'].push({x: startOfDay, day: day, y: time_timestamp, time: time, centerName: center_name, eventDetailsJson: event_details_json})
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
            <div>
                {this.state.isLoading?
                 <div class="spinner-border text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
               : null}
                <HighchartsReact highcharts = {Highcharts} options={myChart}/>
            </div>
        )
    }
}
export default Graph