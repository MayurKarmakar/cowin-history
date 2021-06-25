import React from 'react'
import ScatterGraph from '../Graph/Graph'
import { NavLink } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { DateRangePicker, SingleCalender  } from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css';
import { invalid } from 'moment'


class GraphModal extends React.Component{

    state = {
        stateDistTabClass: "nav-link",
        distCenterTabClass: "nav-link",
        pincodeTabClass: "nav-link",
        selectedStateId: 'select',
        selectedDistrictId: '',
        inputPincode: '',
        districtList: [],
        activeFileterTab: '',
        activeFileterMenu: '',
        collectedData: '',
        selectedCenterName: '',
        suggestedCenters: [],
        selectedStateName: '',
        dateRangeArray: [],
        hasCenterWiseFilterError: true,
        isNoDataAvailable: '',
        OdishaDistricts: [
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
    
        ],
            
        JharkhandDistricts: [
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
        ],

    
    }
    
    distFilterTab1 = false

    stateSelectHandler = (e) => {
        // console.log("Selected State: ", e.target.value)
        let splitedValue = e.target.value.split(" ")
        let stateId = parseInt(splitedValue[0], 10)
        let stateName = splitedValue[1]
        // console.log("Selected State Name: ",stateName)
        let districtList = null
        if (stateId === 15){
            districtList = this.state.JharkhandDistricts
        }else if (stateId === 26){
            districtList = this.state.OdishaDistricts
        }


        let filteredDistrictList = [...districtList.map(item=>{
            return <option className='form-control' value={item['district_id']} key={item.district_id}>{item['district_name']}</option>
        })]
        
        this.setState({
            selectedStateId: stateId,
            districtList: filteredDistrictList,
            selectedStateName: stateName,
            hasCenterWiseFilterError: false
        })
    }


    onFocusHandler = () =>{
        this.setState({
            selectedStateId: null
        })
    }

    districtDataSearchHandler = (district_id) => {
        // let districtId = this.state.selectedDistrictId
        console.log("districtDataSearchHandler fired")
        let urlPath = `http://localhost:9000/slots/district_data/?district_id=${district_id}`

        axios.get(urlPath).then( res => {
            res.data.length !== 0?
            this.setState({
                collectedData: res.data,
                isNoDataAvailable: false
            }): this.setState({
                isNoDataAvailable: true
            })
        }).catch(err => {
            console.log(err)
        })
        }

    

    tab1distSelectHandler = (e) => {
        console.log("Selected District: ",e.target.value)
        let selectedDist = parseInt(e.target.value)
        this.setState({
            selectedDistrictId: selectedDist
        }, ()=>{
            this.districtDataSearchHandler(e.target.value)
        })
    }
    // autoSuggestionMaker = () => {

    // }
    pincodeInputHandler = (e) =>{
        // console.log("Pincode value: ", e.target.value)
        this.setState({
            inputPincode: e.target.value
        })
    }
    pincodeSearchHandler = () => {
        axios.get(`http://localhost:9000/slots/pincode/?pincode=${this.state.inputPincode}`).then(res => {
            res.data.length !== 0?
            this.setState({
                collectedData: res.data,
                isNoDataAvailable: false
            })
            : this.setState({
                isNoDataAvailable: true
            })
        }).catch(err => {
            console.log("ERR pincode: ",err)
        })
    }

    centerNameSearchHandler = (center_name) =>{
        let selectedState = this.state.selectedStateId
        let selectedCenterName = this.state.selectedCenterName
        let urlPath = `http://localhost:9000/slots/center_name/?state_id=${selectedState}/?center_name_like=${center_name}`

        axios.get(urlPath).then(res=>{
            res.data.length !== 0?
            this.setState({
                collectedData: res.data,
                isNoDataAvailable: false
            })
            : this.setState({isNoDataAvailable: true})
        }).catch(err =>{
            console.log(err)
        })
    }

    getDataByCenterName = () => {
        console.log("Selected center name: ", this.state.selectedCenterName)
    }
    onChange = (label) =>{
        // let {valueDict} = label.value
        console.log("label", label)
        console.log("Got label: ", label.label)
        console.log("Got value: ", label.value)
        console.log("Got value type: ", typeof(label.value))
        if (label.value !== undefined || label.value !== null){
            this.setState({
                selectedCenterName: label.value
            }, ()=>{
                this.getDataByCenterName()
            })
        }
    }

    loadOptions =async (textInput, callback) => {
        let collectedMatchedData = null
        await axios.get(`http://localhost:9000/slots/center_name?state_id=15&center_name_like=${textInput}`).then(res=>{
            res.data.length !== 0 ?
            this.setState({
                collectedData: res.data,
                isNoDataAvailable: false
            },()=>{
                console.log(this.state.collectedData)
            })
            : this.setState({isNoDataAvailable: true})
        }).catch(err=>{
            console.log(err)
        })
        callback(collectedMatchedData.map(i => ({label: i.center_name + '(' + i.district_id + ')', value: {center_name: i.center_name, district_id: i.district_id}, id: i.district_id})))

    }

    pincodeSelector = (
        <div>
            <div className='pt-3'>
                <label htmlFor="pincode-input" className='fw-bold'>Pincode</label>
                <input type="number" class="form-control" id="pincode-input" onChange={this.pincodeInputHandler} placeholder='Enter a valid pincode'/>
            </div>
            <button type="submit" class="btn btn-primary mt-2" onClick={this.pincodeSearchHandler}>Show Data</button>
        </div>
    )

    centerSelector = (
        <div>
            <label htmlFor="state-input" className='fw-bold'>State</label>
            <select class="form-control" id="state-input" onChange={this.stateSelectHandler} data-toggle="tooltip" >
                <option value='selectState'>Select a state</option>
                <option value={String(15)+'Jharkhand'}>Jharkhand</option>
                <option value={String(26)+'Odisha'}>Odisha</option>
            </select>
            <label className='fom-label pt-3 fw-bold' htmlFor='center-input'>Centers</label>
            <AsyncSelect
                    isClearable
                    placeholder='Type a center name here.'
                    onInputChange={this.onChange}
                    loadOptions = {this.loadOptions}
                />
            {/* {this.state.hasCenterWiseFilterError?
                <AsyncSelect
                    isClearable
                    // value = {this.state.suggestedCenters}
                    isDisabled
                    placeholder='Type a center name here.'
                    // onChange={this.onChange}
                    onInputChange={this.onChange}
                    loadOptions = {this.loadOptions}
                />
            :
                <AsyncSelect
                    isClearable
                    // value = {this.state.suggestedCenters}
                    placeholder='Type a center name here.'
                    // onChange={this.onChange}
                    onInputChange={this.onChange}
                    loadOptions = {this.loadOptions}
                />
            } */}
            
            {/* {this.autoSuggestionMaker()} */}
        </div>
    )

    getUTCDateString = (dateObj) =>{
        let date = new Date(dateObj).toISOString().slice(0, 19).replace('T', " ")
        date += '.000000'
        return date
    }
    
    dateRangeDataSearchHandler = (dateRange) => {
        console.log(dateRange)
        console.log(dateRange[0])
        console.log(dateRange[1])
        if (dateRange.length !== 0 && dateRange.length === 2){
            let startDate = new Date(dateRange[0])
            startDate.setHours(startDate.getHours()+5)
            startDate.setMinutes(startDate.getMinutes()+30)
            let startDateString = startDate.toISOString().split('T')[0]
            console.log("startDateString: ", startDateString)
            let endDate = new Date(dateRange[1])
            endDate.setHours(endDate.getHours()+5)
            endDate.setMinutes(endDate.getMinutes()+30)
            let endDateString = endDate.toISOString().split('T')[0]
            console.log("endDateString: ", endDateString)
            console.log("endDateString: ", endDateString)
            // let startDate = new Date(dateRange[0]).toISOString().split('T')[0]
            // console.log(startDate)
            // let endDate = new Date(dateRange[1]).toISOString().split('T')[0]
            // console.log(endDate)
            let urlPath = `http://localhost:9000/slots/date/range_filter?start_date=${startDateString}&end_date=${endDateString}`
            axios.get(urlPath).then(res=>{
                res.data.length !== 0?
                this.setState({
                    collectedData: res.data,
                    isNoDataAvailable: false
                })
                : this.setState({isNoDataAvailable: true})
            }).catch(err=>{
                console.log(err)
            })
        }else{
            this.setState({
                hasDateRangeSelectorError: true
            })
        }
    }

    // dateRangeHandler = (dateRange) => {
    //     console.log("DateRange: ", dateRange)
    //     console.log("Start date[0]: ",dateRange[1])
    //     console.log("end date[0]: ",dateRange[2])
    //     if(dateRange){
    //         this.setState({
    //             dateRangeArray: [new Date(dateRange[1]).toISOString().split('T')[0], new Date(dateRange[0]).toISOString().split('T')[0]]
    //         }, ()=>{
    //             this.dateRangeDataSearchHandler()
    //         })
    //     }
    // }

    stateSelector = (
        <div>
            <label htmlFor="state-input" className='fw-bold'>State</label>
            <select class="form-control" id="state-input" onChange={this.stateSelectHandler}>
                <option value='selectState'>Select a state</option>
                <option value={String(15)+' Jharkhand'} id='Jharkhand'>Jharkhand</option>
                <option value={String(26)+' Odisha'} id='Odisha'>Odisha</option>
            </select>
        </div>
    )

    activeTabHandler = (e) => {
        console.log("Tab id: ", e.target.id)
        if (e.target.id === 'state-dist'){
            this.setState({
                distCenterTabClass: "nav-link",
                pincodeTabClass: "nav-link",
                stateDistTabClass: "nav-link active",
                activeFileterTab: 'state-dist',
                selectedDistrictId: '',
                selectedState: '',
                selectedStateName: '',
                inputPincode: '',

                
            })
            
        }else if (e.target.id === 'center'){
            this.setState({
                distCenterTabClass: "nav-link active",
                pincodeTabClass: "nav-link",
                stateDistTabClass: "nav-link",
                activeFileterTab: 'center',
                selectedDistrictId: '',
                selectedState: '',
                selectedStateName: '',
                inputPincode: '',            })
        }else if (e.target.id === 'pincode'){
            this.setState({
                distCenterTabClass: "nav-link",
                pincodeTabClass: "nav-link active",
                stateDistTabClass: "nav-link",
                activeFileterTab: 'pincode',
                selectedState: '',
                selectedStateName: '',
                inputPincode: '',
                selectedDistrictId: ''
            })
        }
    }
    componentDidUpdate = (prevProp, prevState) => {
        if (prevState.selectedStateId !== this.state.selectedStateId){
            this.setState({
                hasCenterWiseFilterError: false
            })
        }
    }

    componentDidMount = () => {
        document.title = 'abc'
        // })
        let getUrl = 'http://127.0.0.1:9000/slots/slotAvailabilityEvent/ '
        axios.get(getUrl).then(res =>{
            console.log(res.data)
            // this.prepareDataforVisuals(res.data)
            this.setState({
                activeFileterMenu: this.stateSelector,
                stateDistTabClass: "nav-link active",
                activeFileterTab: 'state-dist',
                // collectedData: apiData
                collectedData: res.data
            })   
        }).catch(err=>{
            console.log(err)
            document.write("Error Happened")
        })
        
    }


    render(){
        console.log("Collected Data: ", this.state.collectedData)
        console.log("x array value: ", this.x)
        return (
            <>
            <div className='row justify-content-center m-5'>
                <h1>COVID-19 Vaccine's slot availability scatter plot graph.</h1>
                <div className='container-fluid shadow-lg p-3 mb-5 bg-white rounded mt-3'>
                    <div className='row'>
                        <h5 class="d-flex fw-bold">Search by:</h5>
                        <div className='col-lg-4 col-md-12 col-sm-6 pt-4 '>
                            <nav class="nav flex-sm-column flex-lg-row flex-xs-column nav-pills d-flex-xs justify-content-center">
                                <NavLink class={this.state.stateDistTabClass} aria-current="page" id='state-dist' onClick={this.activeTabHandler} to="/">State-Dist.</NavLink>
                                <NavLink class={this.state.distCenterTabClass} id='center' onClick={this.activeTabHandler} to="/">Center Name</NavLink>
                                <NavLink class={this.state.pincodeTabClass} id='pincode' onClick={this.activeTabHandler} to="/">Pincode</NavLink>
                            </nav>
                            {this.state.activeFileterTab === 'state-dist'?this.state.activeFileterMenu:null}
                            {this.state.activeFileterTab === 'state-dist'?
                                <div>
                                    <label className='fom-label pt-3 fw-bold' htmlFor='dist-input'>District</label>
                                    <select class="form-select" id='dist-input' value={this.state.selectedDistrictId} onChange={this.tab1distSelectHandler}>
                                        <option>Select a district</option>
                                        {this.state.districtList !== null ?this.state.districtList.map(item => {
                                            return item
                                        }):null}
                                    </select>
                                </div>
                            :null}
                            {this.state.activeFileterTab === 'center'? this.centerSelector:null}
                            {this.state.activeFileterTab === 'pincode'? this.pincodeSelector: null}
                        </div>
                        <div className='col-lg-4'>

                        </div>
                        <div className='col-lg-4 pt-4 d-flex flex-column flex-lg-row'>

                            <div className='col'>
                                <div className='d-flex-xs justify-content-center d-flex align-items-center'>
                                    <h5 className='fw-bold'>Filter by date: </h5>
                                </div>
                            </div>
                            <div className='col'>
                                <div className='col'>
                                    <DateRangePicker
                                        placeholder='Select the start and end date.'
                                        onChange={this.dateRangeDataSearchHandler}
                                        showOneCalendar={true}
                                        placement="autoVerticalEnd"
                                    />
                                </div>
                            </div>
                            <div className='col'>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-12 col-sm-12 col-md-12 justify-content-between mt-5'>
                            <ScatterGraph dataObject={this.state.collectedData} isNoData={this.state.isNoDataAvailable}/>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
            </>
        )
    }
}
export default GraphModal