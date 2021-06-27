import React from 'react'
import ScatterGraph from '../Graph/Graph'
import { NavLink } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import axios from 'axios'
import { DateRangePicker, SingleCalender  } from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css';
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import {startOfDay, endOfDay, addDays, subDays} from 'date-fns'

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
        dateRange: '',
        collectedData: '',
        selectedCenterName: '',
        suggestedCenters: [],
        startDateString: '',
        endDateString: '',
        selectedStateName: '',
        dateRangeArray: [],
        hasError: false,
        isNoDataAvailable: '',
        isLoading: false,
        searchMode: 'state-dist',
        error: '',
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


        // let filteredDistrictList = [...districtList.map(item=>{
        //     return <option className='form-control' value={item['district_id']} key={item.district_id}>{item['district_name']}</option>
        // })]
        
        districtList = districtList.map((district) => {return {value: district['district_id'], label: district['district_name']}})
        this.setState({
            selectedStateId: stateId,
            districtList: districtList,
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
        // console.log("districtDataSearchHandler fired")
        

        // axios.get(urlPath).then( res => {
        //     res.data.length !== 0?
        //     this.setState({
        //         collectedData: res.data,
        //         isNoDataAvailable: false,
        //         showOverlay: false
        //     }): this.setState({
        //         isNoDataAvailable: true,
        //         showOverlay: false,
        //         collectedData: []
        //     })
        // }).catch(err => {
        //     console.log(err)
        // })

    }

    

    tab1distSelectHandler = (item) => {
        if (item != null){
            let districtId = parseInt(item.value)
            this.setState({
                selectedDistrictId: districtId,
            }, ()=>{
                this.updateChart()
            })
        }else{
            this.setState({
                selectedDistrictId: ''
            }, ()=> this.updateChart())
        }
    }
    // autoSuggestionMaker = () => {
    updateChart = () => {
        let {searchMode, selectedDistrictId, inputPincode, selectedCenterName, startDateString, endDateString} = this.state

        let urlPath = ''
        if (searchMode === 'state-dist') {
            if (!selectedDistrictId) {
                this.setState({
                    error: 'Please select the state and district.'
                })
                return
            }
    
            urlPath = `http://api.cowinhistory.com/slots/district_data/?district_id=${selectedDistrictId}`
        }
        if (searchMode === 'center') {
            if (!selectedCenterName) {
                this.setState({
                    error: 'Please select the state and center name.'
                })
                return
            }

            urlPath = `http://api.cowinhistory.com/slots/center/data/?district_id=${selectedDistrictId}&center_name=${selectedCenterName}`
        }
        if (searchMode === 'pincode') {
            if (!inputPincode) {
                this.setState({
                    error: 'Please select the pincode'
                })
                return
            }

            const pincodePattern = /^\d{6}$/;

            if (!pincodePattern.test(inputPincode.trim())) {
                this.setState({
                    error: 'Please enter a valid pincode.'
                })
                return
            }

            urlPath = `http://api.cowinhistory.com/slots/pincode/?pincode=${inputPincode}`
        }


        if (!startDateString || !endDateString) {
            this.setState({
                error: 'Please select a date range.'
            })
            return
        }
        
        urlPath += `&start_date=${startDateString}&end_date=${endDateString}`

        this.setState({
            isLoading: true
        })

        axios.get(urlPath).then(res => {
            this.setState({
                collectedData: res.data,
                error: '',
                isLoading: false
            })
        }).catch(err => {
            this.setState({
                error: 'Unknown error happened. Please refresh the page to continue.',
                isLoading: false
            })
            console.log(err)
        })
    }
    // }
    pincodeInputHandler = (e) =>{
        // console.log("Pincode value: ", e.target.value)
        this.setState({
            inputPincode: e.target.value,
        })
    }

    pincodeSearchHandler = () => {
        if(!isNaN(this.state.inputPincode)){
            axios.get(`http://127.0.0.1:8000/slots/pincode/?pincode=${this.state.inputPincode}`).then(res => {
                res.data.length !== 0?
                this.setState({
                    collectedData: res.data,
                    isNoDataAvailable: false,
                    showOverlay: false
                })
                : this.setState({
                    isNoDataAvailable: true
                })
            }).catch(err => {
                console.log("ERR pincode: ",err)
            })
        }
    }

    dataForCenterSearchHandler = (district_id, center_name) =>{
        // this.updateChart(this.state.)
        // let selectedDistrict = district_id
        // let selectedCenterName = center_name
        // let urlPath = `http://127.0.0.1:8000/slots/center/data/?district_id=${district_id}&center_name=${center_name}`

        // axios.get(urlPath).then(res=>{
        //     this.setState({
        //         collectedData: res.data,
        //         isNoDataAvailable: false,
        //         showOverlay: false,
        //     })
        // }).catch(err =>{
        //     console.log(err)
        // })
    }

    getDataByCenterName = () => {
        console.log("Selected center name: ", this.state.selectedCenterName)
    }
    onChange = (value) =>{
        // let {valueDict} = label.value
        // console.log("label", value.value)
        // console.log("Got label: ", value.value)
        // console.log("Got value: ", value.value)
        // console.log(value)
        if (value !== null){
            this.setState({
                selectedDistrictId: value.value.district_id,
                selectedCenterName: value.value.center_name
            }, ()=>
                this.updateChart()
            )
            // this.dataForCenterSearchHandler(value.value.district_id, value.value.center_name)
        }else{
            this.setState({
                selectedCenterName: '',
                selectedDistrictId: ''
            }, ()=>
                this.updateChart()
            )
        }
        // console.log("Got value type: ", value.value.center_name)
        // if (value.value !== undefined || value.value !== null){
        //     this.setState({
        //         selectedCenterName: value.value
        //     }, ()=>{
        //         this.getDataByCenterName()
        //     })
        // }
    }

    loadOptions =async (textInput, callback) => {
        let collectedMatchedData = null
        if(textInput.length >= 3){
            await axios.get(`http://localhost:8000/slots/center_name?state_id=15&center_name_like=${textInput}`).then(res=>{
                collectedMatchedData = res.data
            }).catch(err=>{
                console.log(err)
            })
            callback(collectedMatchedData.map(i => ({label: i.center_name + '(' + i.district_id + ')', value: {center_name: i.center_name, district_id: i.district_id}, id: i.district_id})))
        }

    }

    pincodeSelector = (
        <div>
            <div className='pt-3'>
                <label htmlFor="pincode-input" className='fw-bold'>Pincode</label>
                <input type="string" class="form-control" id="pincode-input" onChange={this.pincodeInputHandler} placeholder='Enter a valid pincode'/>
            </div>
            {this.state.isPincodeFilterError?
                <div value={this.state.isPincodeFilterError}>
                    <small class="form-text text-muted">The pincode entered seems <strong>not to be a valid pincode</strong>. Try again with a valid pincode.</small>
                    <button type="submit" class="btn btn-primary mt-3" onClick={this.pincodeSearchHandler} disabled>Show Data</button>
                </div>
                : 
                <button type="submit" class="btn btn-primary mt-3" onClick={this.updateChart}>Show Data</button>
            }
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
                    // onInputChange={this.onChange}
                    onChange={this.onChange}
                    loadOptions = {this.loadOptions}
            />
            <small class="form-text text-muted">Type atleast first <strong>3 characters</strong> of the center name to get the most <strong>relevant</strong> data.</small>
        </div>
    )

    getUTCDateString = (dateObj) =>{
        let date = new Date(dateObj).toISOString().slice(0, 19).replace('T', " ")
        date += '.000000'
        return date
    }
    
    dateRangeDataSearchHandler = (dateRange) => {
        console.log("Date range data", dateRange)
        console.log("Date range data 1",dateRange[0])
        console.log("Date range data 2",dateRange[1])
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
            // let urlPath = `http://localhost:8000/slots/date/range_filter?start_date=${startDateString}&end_date=${endDateString}`
            this.setState({
                startDateString: startDateString,
                endDateString: endDateString,
            }, () => {
                this.updateChart()
            })
                // axios.get(urlPath).then(res=>{
                //     res.data.length !== 0?
                //     : this.setState({collectedData: [], showOverlay:false})
                // }).catch(err=>{
                //     console.log(err)
                // })
        }else{
            this.setState({
                startDateString: '',
                endDateString: ''

            }, ()=>{
                this.updateChart()
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
                showOverlay: true,

                searchMode: 'state-dist'

            }, ()=>{
                this.updateChart()
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
                inputPincode: '', 
                showOverlay: true,           
                searchMode: 'center'

            }, ()=>{
                this.updateChart()
            })
        }else if (e.target.id === 'pincode'){
            this.setState({
                distCenterTabClass: "nav-link",
                pincodeTabClass: "nav-link active",
                stateDistTabClass: "nav-link",
                activeFileterTab: 'pincode',
                selectedState: '',
                selectedStateName: '',
                inputPincode: '',
                selectedDistrictId: '',
                showOverlay: true,
                searchMode: 'pincode'

            }, ()=>{
                this.updateChart()
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
        document.title = 'Cowinhistory'
        this.updateChart()
        this.setState({
            activeFileterMenu: this.stateSelector,
            stateDistTabClass: "nav-link active",
            activeFileterTab: 'state-dist',
            showOverlay: true,
            // collectedData: apiData
            // collectedData: res.data
        }) 
        this.dateRangeDataSearchHandler([startOfDay(subDays(new Date(), 14)), endOfDay(new Date())])
        // })
        // let getUrl = 'http://localhost:8000/slots/updateChartlotAvailabilityEvent/'
        // axios.get(getUrl).then(res =>{
        //     console.log(res.data)
        //     // this.prepareDataforVisuals(res.data)
        //     this.setState({
        //         activeFileterMenu: this.stateSelector,
        //         stateDistTabClass: "nav-link active",
        //         activeFileterTab: 'state-dist',
        //         // collectedData: apiData
        //         collectedData: res.data
        //     })   
        // }).catch(err=>{
        //     console.log(err)
        //     document.write("Error Happened")
        // })
        
    }


    render(){

        return (
            <React.Fragment>
                <div className='row justify-content-center d-lg-block m-2 m-md-5 m-lg-5'>
                    <h1>COVID-19 Vaccine History</h1>
                    <div className='container-fluid p-3 mb-5 bg-white rounded mt-3'>
                        <div className='row'> 
                            <div className='col-lg-3 offset-1'>

                            </div>
                            <h5 class="d-flex fw-bold">Search by:</h5>
                            <div className='col-lg-3 col-md-12 col-sm-6 pt-4 '>
                                <nav class="nav flex-sm-row flex-lg-row flex-row flex-md-column nav-pills d-flex-xs justify-content-center">
                                    <NavLink class={this.state.stateDistTabClass} aria-current="page" id='state-dist' onClick={this.activeTabHandler} to="/">District</NavLink>
                                    <NavLink class={this.state.distCenterTabClass} id='center' onClick={this.activeTabHandler} to="/">Center Name</NavLink>
                                    <NavLink class={this.state.pincodeTabClass} id='pincode' onClick={this.activeTabHandler} to="/">Pincode</NavLink>
                                </nav>
                                {this.state.activeFileterTab === 'state-dist'?this.state.activeFileterMenu:null}
                                {this.state.activeFileterTab === 'state-dist'?
                                    <div>
                                        <label className='fom-label pt-3 fw-bold' htmlFor='dist-input'>District</label>
                                        <Select 
                                            options={this.state.districtList}
                                            isSearchable={true}
                                            onChange={this.tab1distSelectHandler}
                                            isClearable={true}
                                        />
                                        {/* <select class="form-select" id='dist-input' value={this.state.selectedDistrictId} onChange={this.tab1distSelectHandler}>
                                            <option>Select a district</option>
                                            {this.state.districtList !== null ?this.state.districtList.map(item => {
                                                return item
                                            }):null}
                                        </select> */}
                                    </div>
                                :null}
                                {this.state.activeFileterTab === 'center'? this.centerSelector:null}
                                {this.state.activeFileterTab === 'pincode'? this.pincodeSelector: null}
                            </div>
                            <div className='col'>

                            </div>
                            <div className='col pt-4'>

                                <div className='d-flex-xs d-flex mb-2'>
                                    <h5 className='fw-bold'>Select date range: </h5>
                                </div>
                                <DateRangePicker
                                    placeholder='Select the start and end date.'
                                    onChange={this.dateRangeDataSearchHandler}
                                    showOneCalendar={true}
                                    placement="autoVerticalEnd"
                                    ranges= {[
                                        {
                                          label: 'today',
                                          value: [startOfDay(new Date()), endOfDay(new Date())]
                                        },
                                        {
                                          label: 'yesterday',
                                          value: [
                                            startOfDay(addDays(new Date(), -1)),
                                            endOfDay(addDays(new Date(), -1))
                                          ]
                                        },
                                        {
                                          label: 'last15Days',
                                          value: [startOfDay(subDays(new Date(), 14)), endOfDay(new Date())]
                                        }
                                      ]}
                                    defaultValue={[startOfDay(subDays(new Date(), 14)), endOfDay(new Date())]}
                                    //value={this.state.dateRange} 
                                    size='lg'
                                />
                        </div>
                        <div className='row'>
                            <div className='col-lg-12 col-sm-12 col-md-12 justify-content-between mt-5'>

                                {this.state.error ? 
                                <>
                                    <div class="alert alert-primary" role="alert">{this.state.error}</div>
                                </>
                                :
                                    <LoadingOverlay
                                        active={this.state.isLoading}
                                        spinner={<BounceLoader />}
                                    >
                                    {this.state.collectedData.length !== 0? 
                                        <ScatterGraph dataObject={this.state.collectedData} isShowOverlayTrue={this.state.showOverlay}/>
                                    : 
                                        <div class="alert alert-danger" role="alert">
                                            Sorry, we don't have data for your selection now.
                                        </div>    
                                    }
                                    </LoadingOverlay>
                                }
                                {/* {this.state.showOverlay && this.state.activeFileterTab === 'state-dist'?
                                    <div class="alert alert-primary" role="alert">
                                        Please proceed with selecting a <strong>state</strong> and a <strong>district</strong> to see
                                        the COVID-19 vaccine slot availability graph of the requested region.
                                    </div>
                                :
                                    null
                                }
                                {this.state.showOverlay && this.state.activeFileterTab === 'center'?
                                    <div class="alert alert-primary" role="alert">
                                        Please proceed with selecting a <strong>state</strong> and a <strong>center</strong> to see
                                        the COVID-19 vaccine slot availability graph of the requested region.
                                    </div>
                                :
                                    null
                                }
                                {this.state.showOverlay && this.state.activeFileterTab === 'pincode'?
                                    <div class="alert alert-primary" role="alert">
                                        Please proceed with typing a valid <strong>pincode</strong> to see
                                        the COVID-19 vaccine slot availability graph of the requested region.
                                    </div>
                                :
                                    null
                                // <ScatterGraph dataObject={this.state.collectedData}/>
                                // <ScatterGraph dataObject={this.state.collectedData} isShowOverlayTrue={this.state.showOverlay}/>
                                } */}

                            </div>
                        </div>
                    </div>
                </div>        
                <hr/>
                
            </div>
            </React.Fragment>
        )
    }
}
export default GraphModal