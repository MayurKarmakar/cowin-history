import React from 'react'
import Header from '../../Components/Header/Header'
import Graph from '../../Components/ScatterPlotGUI/GraphModal'


export default function Layout() {
    return (
        <React.Fragment>
            <Header/>
            <Graph/>
        </React.Fragment>
    )
}