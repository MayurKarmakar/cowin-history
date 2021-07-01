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


const statesData = {"states":[{"state_id":1,"state_name":"Andaman and Nicobar Islands"},{"state_id":2,"state_name":"Andhra Pradesh"},{"state_id":3,"state_name":"Arunachal Pradesh"},{"state_id":4,"state_name":"Assam"},{"state_id":5,"state_name":"Bihar"},{"state_id":6,"state_name":"Chandigarh"},{"state_id":7,"state_name":"Chhattisgarh"},{"state_id":8,"state_name":"Dadra and Nagar Haveli"},{"state_id":37,"state_name":"Daman and Diu"},{"state_id":9,"state_name":"Delhi"},{"state_id":10,"state_name":"Goa"},{"state_id":11,"state_name":"Gujarat"},{"state_id":12,"state_name":"Haryana"},{"state_id":13,"state_name":"Himachal Pradesh"},{"state_id":14,"state_name":"Jammu and Kashmir"},{"state_id":15,"state_name":"Jharkhand"},{"state_id":16,"state_name":"Karnataka"},{"state_id":17,"state_name":"Kerala"},{"state_id":18,"state_name":"Ladakh"},{"state_id":19,"state_name":"Lakshadweep"},{"state_id":20,"state_name":"Madhya Pradesh"},{"state_id":21,"state_name":"Maharashtra"},{"state_id":22,"state_name":"Manipur"},{"state_id":23,"state_name":"Meghalaya"},{"state_id":24,"state_name":"Mizoram"},{"state_id":25,"state_name":"Nagaland"},{"state_id":26,"state_name":"Odisha"},{"state_id":27,"state_name":"Puducherry"},{"state_id":28,"state_name":"Punjab"},{"state_id":29,"state_name":"Rajasthan"},{"state_id":30,"state_name":"Sikkim"},{"state_id":31,"state_name":"Tamil Nadu"},{"state_id":32,"state_name":"Telangana"},{"state_id":33,"state_name":"Tripura"},{"state_id":34,"state_name":"Uttar Pradesh"},{"state_id":35,"state_name":"Uttarakhand"},{"state_id":36,"state_name":"West Bengal"}],"ttl":24}

const jharkhandDistrictId = 15;
const jhakhandDistrictData = {"districts":[{"district_id":242,"district_name":"Bokaro"},{"district_id":245,"district_name":"Chatra"},{"district_id":253,"district_name":"Deoghar"},{"district_id":257,"district_name":"Dhanbad"},{"district_id":258,"district_name":"Dumka"},{"district_id":247,"district_name":"East Singhbhum"},{"district_id":243,"district_name":"Garhwa"},{"district_id":256,"district_name":"Giridih"},{"district_id":262,"district_name":"Godda"},{"district_id":251,"district_name":"Gumla"},{"district_id":255,"district_name":"Hazaribagh"},{"district_id":259,"district_name":"Jamtara"},{"district_id":252,"district_name":"Khunti"},{"district_id":241,"district_name":"Koderma"},{"district_id":244,"district_name":"Latehar"},{"district_id":250,"district_name":"Lohardaga"},{"district_id":261,"district_name":"Pakur"},{"district_id":246,"district_name":"Palamu"},{"district_id":254,"district_name":"Ramgarh"},{"district_id":240,"district_name":"Ranchi"},{"district_id":260,"district_name":"Sahebganj"},{"district_id":248,"district_name":"Seraikela Kharsawan"},{"district_id":249,"district_name":"Simdega"},{"district_id":263,"district_name":"West Singhbhum"}],"ttl":24}

const odishaDistrictId = 26;
const odishaDistrictdata = {"districts":[{"district_id":445,"district_name":"Angul"},{"district_id":448,"district_name":"Balangir"},{"district_id":447,"district_name":"Balasore"},{"district_id":472,"district_name":"Bargarh"},{"district_id":454,"district_name":"Bhadrak"},{"district_id":468,"district_name":"Boudh"},{"district_id":457,"district_name":"Cuttack"},{"district_id":473,"district_name":"Deogarh"},{"district_id":458,"district_name":"Dhenkanal"},{"district_id":467,"district_name":"Gajapati"},{"district_id":449,"district_name":"Ganjam"},{"district_id":459,"district_name":"Jagatsinghpur"},{"district_id":460,"district_name":"Jajpur"},{"district_id":474,"district_name":"Jharsuguda"},{"district_id":464,"district_name":"Kalahandi"},{"district_id":450,"district_name":"Kandhamal"},{"district_id":461,"district_name":"Kendrapara"},{"district_id":455,"district_name":"Kendujhar"},{"district_id":446,"district_name":"Khurda"},{"district_id":451,"district_name":"Koraput"},{"district_id":469,"district_name":"Malkangiri"},{"district_id":456,"district_name":"Mayurbhanj"},{"district_id":470,"district_name":"Nabarangpur"},{"district_id":462,"district_name":"Nayagarh"},{"district_id":465,"district_name":"Nuapada"},{"district_id":463,"district_name":"Puri"},{"district_id":471,"district_name":"Rayagada"},{"district_id":452,"district_name":"Sambalpur"},{"district_id":466,"district_name":"Subarnapur"},{"district_id":453,"district_name":"Sundargarh"}],"ttl":24}

const karnatakaDistrictId = 16;
const karnatakaDistrictData = {"districts":[{"district_id":270,"district_name":"Bagalkot"},{"district_id":276,"district_name":"Bangalore Rural"},{"district_id":265,"district_name":"Bangalore Urban"},{"district_id":294,"district_name":"BBMP"},{"district_id":264,"district_name":"Belgaum"},{"district_id":274,"district_name":"Bellary"},{"district_id":272,"district_name":"Bidar"},{"district_id":271,"district_name":"Chamarajanagar"},{"district_id":273,"district_name":"Chikamagalur"},{"district_id":291,"district_name":"Chikkaballapur"},{"district_id":268,"district_name":"Chitradurga"},{"district_id":269,"district_name":"Dakshina Kannada"},{"district_id":275,"district_name":"Davanagere"},{"district_id":278,"district_name":"Dharwad"},{"district_id":280,"district_name":"Gadag"},{"district_id":267,"district_name":"Gulbarga"},{"district_id":289,"district_name":"Hassan"},{"district_id":279,"district_name":"Haveri"},{"district_id":283,"district_name":"Kodagu"},{"district_id":277,"district_name":"Kolar"},{"district_id":282,"district_name":"Koppal"},{"district_id":290,"district_name":"Mandya"},{"district_id":266,"district_name":"Mysore"},{"district_id":284,"district_name":"Raichur"},{"district_id":292,"district_name":"Ramanagara"},{"district_id":287,"district_name":"Shimoga"},{"district_id":288,"district_name":"Tumkur"},{"district_id":286,"district_name":"Udupi"},{"district_id":281,"district_name":"Uttar Kannada"},{"district_id":293,"district_name":"Vijayapura"},{"district_id":285,"district_name":"Yadgir"}],"ttl":24}

// const tamilNaduDistrictId = 31
// const tamilNaduDistrictData = {"districts":[{"district_id":779,"district_name":"Aranthangi"},{"district_id":555,"district_name":"Ariyalur"},{"district_id":578,"district_name":"Attur"},{"district_id":565,"district_name":"Chengalpet"},{"district_id":571,"district_name":"Chennai"},{"district_id":778,"district_name":"Cheyyar"},{"district_id":539,"district_name":"Coimbatore"},{"district_id":547,"district_name":"Cuddalore"},{"district_id":566,"district_name":"Dharmapuri"},{"district_id":556,"district_name":"Dindigul"},{"district_id":563,"district_name":"Erode"},{"district_id":552,"district_name":"Kallakurichi"},{"district_id":557,"district_name":"Kanchipuram"},{"district_id":544,"district_name":"Kanyakumari"},{"district_id":559,"district_name":"Karur"},{"district_id":780,"district_name":"Kovilpatti"},{"district_id":562,"district_name":"Krishnagiri"},{"district_id":540,"district_name":"Madurai"},{"district_id":576,"district_name":"Nagapattinam"},{"district_id":558,"district_name":"Namakkal"},{"district_id":577,"district_name":"Nilgiris"},{"district_id":564,"district_name":"Palani"},{"district_id":573,"district_name":"Paramakudi"},{"district_id":570,"district_name":"Perambalur"},{"district_id":575,"district_name":"Poonamallee"},{"district_id":546,"district_name":"Pudukkottai"},{"district_id":567,"district_name":"Ramanathapuram"},{"district_id":781,"district_name":"Ranipet"},{"district_id":545,"district_name":"Salem"},{"district_id":561,"district_name":"Sivaganga"},{"district_id":580,"district_name":"Sivakasi"},{"district_id":551,"district_name":"Tenkasi"},{"district_id":541,"district_name":"Thanjavur"},{"district_id":569,"district_name":"Theni"},{"district_id":554,"district_name":"Thoothukudi (Tuticorin)"},{"district_id":560,"district_name":"Tiruchirappalli"},{"district_id":548,"district_name":"Tirunelveli"},{"district_id":550,"district_name":"Tirupattur"},{"district_id":568,"district_name":"Tiruppur"},{"district_id":572,"district_name":"Tiruvallur"},{"district_id":553,"district_name":"Tiruvannamalai"},{"district_id":574,"district_name":"Tiruvarur"},{"district_id":543,"district_name":"Vellore"},{"district_id":542,"district_name":"Viluppuram"},{"district_id":549,"district_name":"Virudhunagar"}],"ttl":24}

const districtsData = {}

districtsData[jharkhandDistrictId] = jhakhandDistrictData
districtsData[odishaDistrictId] = odishaDistrictdata
districtsData[karnatakaDistrictId] = karnatakaDistrictData
// districtsData[tamilNaduDistrictId] = tamilNaduDistrictData


const createStateNameMap = () => {
    const stateNameMap = {}
    statesData.states.map((state) => {
        const stateId = state['state_id']
        const stateName = state['state_name']
        
        stateNameMap[stateId] = stateName
    })
    return stateNameMap
}

const stateNameMap = createStateNameMap()

const loadStatesOptions = () => {
    const statesOptions = Object.entries(districtsData).map(([k, v]) => {return {value: k, label: stateNameMap[k]}})
    console.log("statesOptions", statesOptions);
    return statesOptions;
}

const statesOptions = loadStatesOptions()

const createDistrictNameMap = () => {
    const districtNameMap = {}

    Object.entries(districtsData).map(([k, v]) => {
        v.districts.map((district) => {
            districtNameMap[district['district_id']] = district['district_name']
        })
    })

    return districtNameMap
}

const districtNameMap = createDistrictNameMap()

class GraphModal extends React.Component{

    state = {
        stateDistTabClass: "nav-link",
        distCenterTabClass: "nav-link",
        pincodeTabClass: "nav-link",
        selectedStateId: '',
        selectedDistrictId: '',
        inputPincode: '',
        districtList: [],
        activeFileterTab: '',
        activeFileterMenu: '',
        dateRange: '',
        collectedData: '',
        selectedCenter: null,
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
        districts: {

        },
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
                selectedDistrict: item,
                selectedDistrictId: districtId,
            }, ()=>{
                this.updateChart()
            })
        }else{
            this.setState({
                selectedDistrictId: '',
                selectedDistrict: null
            }, ()=> this.updateChart())
        }
    }
    // autoSuggestionMaker = () => {
    // baseApiUrl = 'https://api.cowinhistory.com/slots/'
    baseApiUrl = 'http://localhost:8000/slots/'

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
    
            urlPath = `${this.baseApiUrl}district_data/?district_id=${selectedDistrictId}`
        }
        if (searchMode === 'center') {
            if (!selectedCenterName) {
                this.setState({
                    error: 'Please select the state and center name.'
                })
                return
            }

            urlPath = `${this.baseApiUrl}center/data/?district_id=${selectedDistrictId}&center_name=${selectedCenterName}`
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

            urlPath = `${this.baseApiUrl}pincode/?pincode=${inputPincode}`
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
                selectedCenterName: value.value.center_name,
                selectedCenter: value
            }, ()=>
                this.updateChart()
            )
            // this.dataForCenterSearchHandler(value.value.district_id, value.value.center_name)
        }else{
            this.setState({
                selectedCenterName: '',
                selectedDistrictId: '',
                selectedCenter: null
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
            await axios.get(`${this.baseApiUrl}center_name?state_id=${this.state.selectedStateId}&center_name_like=${textInput}`).then(res=>{
                collectedMatchedData = res.data
            }).catch(err=>{
                console.log(err)
            })
            callback(collectedMatchedData.map(i => ({label: i.center_name + '(' + districtNameMap[i.district_id] + ')', value: {center_name: i.center_name, district_id: i.district_id}, id: i.district_id})))
        }

    }

    loadStatesOptions = () => {
        const statesOptions = Object.entries(districtsData).map(([k, v]) => {return {value: k, label: stateNameMap[k]}})
        console.log("statesOptions", statesOptions);
        return statesOptions;
    }
    onStateChangeInCenter = (item) => {
        let stateId = ''
        
        console.log('onStateChangeInCenter', item)
        if (item) {
            stateId = item.value
        }
        
        this.setState({
            selectedStateId: stateId,
            selectedCenter: null,
            selectedCenterName: null
        }, () => this.updateChart())
        
    }

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

    

    onStateChange = (item) => {
        let districtList = []
        let stateId = ''
        if (item) {
            stateId = item.value
            districtList = districtsData[stateId].districts.map((v) => ({value: v['district_id'], label: v['district_name']}))
        }

        this.setState({
            districtList: districtList, 
            selectedDistrictId: '', 
            selectedDistrict: null, 
            selectedStateId: stateId
        },
        ()=>this.updateChart())
    }


    activeTabHandler = (e) => {
        console.log("Tab id: ", e.target.id)
        if (e.target.id === 'state-dist'){
            this.setState({
                distCenterTabClass: "nav-link",
                pincodeTabClass: "nav-link",
                stateDistTabClass: "nav-link active",
                activeFileterTab: 'state-dist',
                selectedDistrictId: '',
                selectedDistrict: null,
                selectedState: '',
                selectedStateName: '',
                inputPincode: '',
                selectedCenterName: '',
                showOverlay: true,
                selectedCenter: null,
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
                selectedStateId: '',
                selectedStateName: '',
                selectedDistrict: null,
                selectedCenterName: '',
                inputPincode: '', 
                showOverlay: true,   
                selectedCenter: null,        
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
                selectedDistrict: null,
                selectedCenterName: '',
                showOverlay: true,
                selectedCenter: null,
                searchMode: 'pincode'

            }, ()=>{
                this.updateChart()
            })
        }
    }
    componentDidUpdate = (prevProp, prevState) => {
    }

    componentDidMount = () => {
        window.scrollTo(0, 0)
        document.title = 'Cowinhistory'
        this.updateChart()
        this.setState({
            stateDistTabClass: "nav-link active",
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
                        <p className='lead'>
                            CowinHistory.com helps you to see the date and time of vaccine slot availability events in the past. We can use this data to predict the time when slots might be available for booking in future.
                        </p>
                        <hr/>
                        <div className='row'> 
                            <div className='col-lg-3 offset-1'>

                            </div>
                            <h5 class="d-flex fw-bold">Search by:</h5>
                            <div className='col-lg-3 col-md-12 col-sm-6 pt-4 pb-3'>
                                <nav class="nav flex-sm-row flex-lg-row flex-row flex-md-column nav-pills d-flex-xs justify-content-center">
                                    <NavLink class={this.state.stateDistTabClass} aria-current="page" id='state-dist' onClick={this.activeTabHandler} to="/">District</NavLink>
                                    <NavLink class={this.state.distCenterTabClass} id='center' onClick={this.activeTabHandler} to="/">Center Name</NavLink>
                                    <NavLink class={this.state.pincodeTabClass} id='pincode' onClick={this.activeTabHandler} to="/">Pincode</NavLink>
                                </nav>
                                {this.state.searchMode === 'state-dist'&&
                                            <div className='pt-3'>
                                            <label htmlFor="state-input" className='fw-bold'>State</label>
                                            {/* <select class="form-control" id="state-input" onChange={this.stateSelectHandler}>
                                                <option value='selectState'>Select a state</option>
                                                <option value={String(15)+' Jharkhand'} id='Jharkhand'>Jharkhand</option>
                                                <option value={String(26)+' Odisha'} id='Odisha'>Odisha</option>
                                            </select> */}
                                            <Select
                                                options={statesOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                onChange={this.onStateChange}
                                                menuPortalTarget={document.body} 
                                                placeholder='Select a state...'
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                            <label className='fom-label pt-3 fw-bold' htmlFor='dist-input'>District</label>
                                            <Select 
                                                value={this.state.selectedDistrict}
                                                options={this.state.districtList}
                                                isSearchable={true}
                                                onChange={this.tab1distSelectHandler}
                                                isClearable={true}
                                                placeholder = 'Select district...'
                                                menuPortalTarget={document.body} 
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                }
                                {this.state.searchMode === 'center' &&
                                    <div className='pt-3'>
                                    <label htmlFor="state-input" className='fw-bold'>State</label>
                                    <Select
                                        options={statesOptions}
                                        isSearchable={true}
                                        isClearable={true}
                                        onChange={this.onStateChangeInCenter}
                                        placeholder='Select a state...'
                                        menuPortalTarget={document.body} 
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <label className='fom-label fw-bold pt-3' htmlFor='center-input'>Centers</label>
                                    <AsyncSelect
                                            isClearable
                                            value={this.state.selectedCenter}
                                            placeholder='Type a center name here...'
                                            // onInputChange={this.onChange}
                                            onChange={this.onChange}
                                            loadOptions = {this.loadOptions}
                                            menuPortalTarget={document.body} 
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <small class="form-text text-muted">Type atleast <strong>3 characters</strong> to search for centers.</small>
                                </div>
                                }
                                {this.state.searchMode === 'pincode' && 
                                    <div>
                                    <div className='pt-3'>
                                        <label htmlFor="pincode-input" className='fw-bold'>Pincode</label>
                                        <input type="string" class="form-control" id="pincode-input" onChange={this.pincodeInputHandler} placeholder='Enter a valid pincode...'/>
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
                                }
                            </div>
                            <div className='col pt-4'>
                                <div className='d-flex-xs d-flex justify-content-lg-center justify-content-sm-center mb-2'>
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
                                          label: 'Last 15 Days',
                                          value: [startOfDay(subDays(new Date(), 14)), endOfDay(new Date())]
                                        }
                                      ]}
                                    defaultValue={[startOfDay(subDays(new Date(), 14)), endOfDay(new Date())]}
                                    //value={this.state.dateRange} 
                                    size='lg'
                                />
                            </div>
                            <div className='col pt-4'>

                        </div>
                        <div className='row pb-5'>
                            <div className='col-lg-12 col-sm-12 col-md-12 justify-content-start mt-5'>
                                <p className='d-flex justify-content-start text-danger'>**The chart will be shown only for the latest 1000 data points.</p>
                                <hr/>
                                <h3 className='mb-3'>Slot availability events chart</h3>
                                {this.state.error ? 
                                <>
                                    <div class="alert alert-warning" role="alert">{this.state.error}</div>
                                </>
                                :
                                    <LoadingOverlay
                                        active={this.state.isLoading}
                                        spinner={<BounceLoader />}
                                    >
                                    {this.state.collectedData.length !== 0? 
                                        <ScatterGraph dataObject={this.state.collectedData} stateName={stateNameMap[this.state.selectedStateId]} districtName={districtNameMap[this.state.selectedDistrictId]} 
                                        centerName={this.state.selectedCenterName} pincode={this.state.inputPincode} searchMode={this.state.searchMode} isShowOverlayTrue={this.state.showOverlay}/>
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
                    {/* <hr/> */}
                </div>
            </React.Fragment>
        )
    }
}
export default GraphModal