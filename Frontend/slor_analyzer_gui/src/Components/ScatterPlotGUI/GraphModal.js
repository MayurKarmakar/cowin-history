import React from 'react'
import ScatterGraph from '../Graph/Graph'
import { NavLink } from 'react-router-dom'
import DropDown from '../Dropdown/DropDown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class GraphModal extends React.Component{

    state = {
        selecterType: null,
        currentTabMenu: null,
        selectedStartDate: null,
        selectedEndDate: null,
        selectedStateId: null,
        selectedDistrictId: null,
        selectedCentreName: null,
        filteredDistrictsAsPerState: null,
        dropdownData: {
            'Odisha': {
                'state_id': 26,
                'districts':[
                            {'district_id': 446, 'district_name': 'Khurda'},
                            {'district_id': 457, 'district_name': 'Cuttack'},
                            {'district_id': 458, 'district_name': 'Dhenkanal'},
                            {'district_id': 459, 'district_name': 'Jagatsinghpur'},
                            {'district_id': 471, 'district_name': 'Rayagada'},
                            {'district_id': 452, 'district_name': 'Sambalpur'},
                            {'district_id': 474, 'district_name': 'Jharsuguda'},
                            {'district_id': 456, 'district_name': 'Mayurbhanj'},
                            {'district_id': 460, 'district_name': 'Jajpur'},
                            {'district_id': 462, 'district_name': 'Nayagarh'},
                            {'district_id': 454, 'district_name': 'Bhadrak'},
                            {'district_id': 453, 'district_name': 'Sundargarh'},
                            {'district_id': 450, 'district_name': 'Kandhamal'},
                            {'district_id': 461, 'district_name': 'Kendrapara'},
                            {'district_id': 449, 'district_name': 'Ganjam'},
                            {'district_id': 473, 'district_name': 'Deogarh'},
                            {'district_id': 463, 'district_name': 'Puri'},
                            {'district_id': 455, 'district_name': 'Kendujhar'},
                            {'district_id': 464, 'district_name': 'Kalahandi'},
                            {'district_id': 466, 'district_name': 'Subrnapur'},
                            {'district_id': 465, 'district_name': 'Nuapada'},
                            {'district_id': 467, 'district_name': 'Gajapati'},
                            {'district_id': 451, 'district_name': 'Koraput'},
                            {'district_id': 472, 'district_name': 'Bargarh'},
                            {'district_id': 445, 'district_name': 'Angul'},
                            {'district_id': 447, 'district_name': 'Balasore'},
                            {'district_id': 473, 'district_name': 'Deogarh'}
                    
                        ]
                    },
            'Jharkhand': {
                    'state_id': 15,
                    'districts': [
                        {"district_id":242,"district_name":"Bokaro"},
                        {"district_id":245,"district_name":"Chatra"},
                        {"district_id":253,"district_name":"Deoghar"},
                        {"district_id":257,"district_name":"Dhanbad"},
                        {"district_id":258,"district_name":"Dumka"},
                        {"district_id":247,"district_name":"East Singhbhum"},
                        {"district_id":243,"district_name":"Garhwa"},
                        {"district_id":256,"district_name":"Giridih"},
                        {"district_id":262,"district_name":"Godda"},
                        {"district_id":251,"district_name":"Gumla"},
                        {"district_id":255,"district_name":"Hazaribagh"},
                        {"district_id":259,"district_name":"Jamtara"},
                        {"district_id":252,"district_name":"Khunti"},
                        {"district_id":241,"district_name":"Koderma"},
                        {"district_id":244,"district_name":"Latehar"},
                        {"district_id":250,"district_name":"Lohardaga"},
                        {"district_id":261,"district_name":"Pakur"},
                        {"district_id":246,"district_name":"Palamu"},
                        {"district_id":254,"district_name":"Ramgarh"},
                        {"district_id":240,"district_name":"Ranchi"},
                        {"district_id":260,"district_name":"Sahebganj"},
                        {"district_id":248,"district_name":"Seraikela Kharsawan"},
                        {"district_id":249,"district_name":"Simdega"},
                        {"district_id":263,"district_name":"West Singhbhum"}
                    ]
                },
                'centre_list': {

                }
            }
    }

    datePickerSelectedDate = (startDate, endDate) => {
        if (startDate){
            this.setState({ selectedStartDate: startDate})
        }else if (endDate){
            this.setState({ selectedEndDate: endDate})
        }
    }

    resetStartDate = () => {
        this.setState({
            selectedStartDate: null
        })
    }

    resetEndDate = () => {
        this.setState({
            selectedEndDate: null
        })
    }

    districtPopulator = () => {
        let stateSelectedId = this.state.selectedStateId
        console.log("selectedStateId: ",stateSelectedId)
        let districts = this.state.dropdownData

        let filteredDistrictList = null
        Object.entries(districts).forEach(([key, value]) => {
            console.log("State id: ",districts[key]['state_id'])
            if (districts[key]['state_id'] === stateSelectedId){
                console.log("State id Matched: ",stateSelectedId)
                console.log("DIst list: ",districts[key]['districts'])
                filteredDistrictList = districts[key]['districts'].map(item => {
                    return <option key={key.id} value={item['district_id']}>{item['district_name']}</option>
                })
            }
        })
        return filteredDistrictList
    }

    selectStateHandler = (event) => {
        let stateIdValue = parseInt(event.target.value, 10)
        console.log("Event value: ",stateIdValue)
        
        this.setState({
            selectedStateId: stateIdValue
        })
    }
    

    tabSelectorHandler = (e) => {
        if (e.target.value === 'state_dist'){
            this.setState({
                currentTabMenu: this.stateDistSelectorMenu
            })
        }else if (e.target.value === 'pincode'){
            this.setState({
                currentTabMenu: this.pincodeSelectorMenu
            })
        }
    }


    render(){
        return (
            <div className='d-flex-row justify-content-center m-5'>
                <h1>COVID-19 Vaccine's slot availability scatter plot graph.</h1>
                <div className='container-fluid shadow-lg p-3 mb-5 bg-white rounded mt-3'>
                    <div className='row'>
                        <div className='col-lg-2 col-md-3 col-sm-12'>
                            <ul class="nav nav-tabs">
                                <li className="nav-item">
                                    <NavLink class="nav-link active" value='state_dist' aria-current="page" onClick={(event) => this.tabSelectorHandler(event)} to="/" id="state_dist" >State & District</NavLink>
                                </li>
                                <br/>
                                <li class="nav-item">
                                <NavLink class="nav-link active" value='pincode' aria-current="page" onClick={(event) => this.tabSelectorHandler(event)} to="/" id="centre" >Pincode</NavLink>
                                </li>
                            </ul>
                            <br/>
                            <form>
                                <div class="form-group">
                                    <label for="exampleFormControlSelect1">Select State</label>
                                    <select class="form-control" id="exampleFormControlSelect1" onChange={this.selectStateHandler}>
                                        <option>Select State</option>
                                        <option value={15}>Jharkhand</option>
                                        <option value={26}>Odisha</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="exampleFormControlSelect2">Select District</label>
                                    <select class="form-control" id="exampleFormControlSelect2">
                                        <option>Select District</option>
                                        {this.districtPopulator()}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="exampleFormControlSelect2">Select Centre</label>
                                    <select class="form-control" id="exampleFormControlSelect2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                            </form>
                            <br/>
                            <form>
                                <div className='form-group'>
                                    <label for='startDateSelector'>Start Date</label>
                                    <DatePicker
                                        className='form-control'
                                        selected = {this.state.selectedStartDate}
                                        id = 'startDateSelector'
                                        onChange = {(date)=>{this.datePickerSelectedDate(date, null)}}
                                        dateFormat = "dd-MM-yyyy"
                                        maxDate = {new Date()}
                                        showYearDropdown
                                        scrollableMonthYearDropdown
                                    />
                                    <button type='button' className='btn btn-danger btn-sm offset-1' onClick={()=>{this.resetStartDate()}}>Reset</button>
                                </div>
                                <br/>
                                <div className='form-group'>
                                    <label for='endDateSelector'>End Date</label>
                                    <DatePicker
                                        className='form-control'
                                        id = 'endDateSelector'
                                        selected = {this.state.selectedEndDate}
                                        onChange = {(date) => this.datePickerSelectedDate(null, date)}
                                        dateFormat = "dd-MM-yyyy"
                                        maxDate = {new Date()}
                                        showYearDropdown
                                        scrollableMonthYearDropdown
                                    />
                                    <button type='button' className='btn btn-danger btn-sm offset-1' onClick={()=>{this.resetEndDate()}}>Reset</button>
                                </div>
                            </form>
                            <br/>
                            <input type='button' className='btn btn-primary btn-sm' value='Show'/>
                        </div>
                        <div className='col-lg-10 col-sm-12 col-md-9 justify-content-center'>
                            <ScatterGraph/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default GraphModal