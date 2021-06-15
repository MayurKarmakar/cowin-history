import React from 'react'

export default function Dropdown (props) {

    if (props.name === 'state_district') {
        return (
            <div className='container justify-content-center'>
                <div className='justify-content-center d-flex'>
                    <h5 className='d-flex justify-content-start fw-bold'>State</h5>
                    <select className='form-select mb-4'>
                        <option value='Select state' defaultValue>Odisha</option>
                        <option value='Jharkhand'>Jharkhand</option>
                    </select>
                    <h5 className='d-flex justify-content-start fw-bold'>District</h5>
                    <select className='form-select'>
                        <option value='Select state' defaultValue>Odisha</option>
                        <option value='Jharkhand'>Jharkhand</option>
                    </select>
                </div>
            </div>
        )
        
    }else if (props.name === 'centre_name' || props.name === ''){
        return (
            <div className='justify-content-center d-flex'>
                <h5 className='d-flex justify-content-start fw-bold'>District</h5>
                <select className='form-select mb-4'>
                    <option value='Select state' defaultValue>Odisha</option>
                    <option value='Jharkhand'>Jharkhand</option>
                </select>
                <h5 className='d-flex justify-content-start fw-bold'>Center Name</h5>
                <select className='form-select'>
                    <option value='Select state' defaultValue>Odisha</option>
                    <option value='Jharkhand'>Jharkhand</option>
                </select>
            </div>
        )
    }
    
}
