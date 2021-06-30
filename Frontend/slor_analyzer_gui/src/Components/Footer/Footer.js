import React from 'react';

import { NavLink } from 'react-router-dom';

export default function Footer(){
    return (
        <footer>
            <div className='bg-dark position-relative mt-auto'>
                <div className='container-fluid'>
                    {/* <div className='row'>
                        <div className='col-lg-4 text-center text-lg-right col-md-3 col-sm-6 text-light pt-3'>
                            <h4 className='footer-text text-end'>About</h4>
                            <ul className='list-unstyled'>
                                <li><p><NavLink to='/about/website' className='text-white'>Website</NavLink></p></li>
                            </ul>
                        </div>
                        <div className='col-lg-4 text-center text-lg-center pt-3 col-md-3 col-sm-6'>
                            <NavLink to='/contact' className='text-white lead'><h4>Contact Us</h4></NavLink>
                        </div>
                        <div className='col-lg-4 text-center text-lg-left pt-3 col-md-3 col-sm-6'>
                            <h4 className='text-white'>Mail Us</h4>
                            <ul className='list-unstyled text-white'>
                                <li><i className='fa fa-envelope mr-2'></i><p>support@collegepapers.in</p></li>
                            </ul>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col text-white text-center'>
                            <p>Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
                        </div>
                    </div> */}
                    <div className='row text-white pt-4 px-auto ml-lg-4'>
                        <div className='col-lg-4 col-md-3  d-flex justify-content-end flex-column align-self-start'>
                            <h4 className='font-weight-bold'>COVID Helpline</h4>
                            <p>Number: +91-11-23978046</p>
                            <p>Toll Free: 1075</p>
                        </div>
                        <div className='col-lg-4 col-md-3  d-flex justify-content-end flex-column align-self-start'>
                            <h4 className='font-weight-bold'>Useful Links</h4>
                            <p><NavLink to={{ pathname: "https://www.cowin.gov.in/home" }} target="_blank" className='text-white'>Book a slot</NavLink></p>
                        </div>
                        <div className='col-lg-4 col-md-3  d-flex justify-content-end flex-column align-self-start'>
                            <h4 className='font-weight-bold'>Contact us</h4>
                            <p><i className='fa fa-envelope mr-2'></i>Mail at:  support@cowinhistory.com</p>
                            <p><i className='fa fa-phone mr-2'></i>Call on:  + 91 7250622143</p>
                        </div>
                        {/* <hr color='white'/> */}
                    </div>
                    <div className='row'>
                        <div className='col text-center text-white align-bottom'>
                            <hr color='white'/>
                            <p>Copyright &copy; {new Date().getFullYear()}. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}