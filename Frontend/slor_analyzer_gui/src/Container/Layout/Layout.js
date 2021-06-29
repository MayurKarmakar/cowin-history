import React from 'react'
import Header from '../../Components/Header/Header'
import Graph from '../../Components/ScatterPlotGUI/GraphModal'
import Footer from '../../Components/Footer/Footer'


export default function Layout() {
    return (
        <React.Fragment>
            <Header/>
            <Graph/>
            <Footer/>
        </React.Fragment>
    )
}