import React, {useState} from 'react';
import {Space} from 'antd'
import Header from '../../components/DashboardComponents/Header';
import Footer from '../../components/DashboardComponents/Footer';
import Sidebar from '../../components/DashboardComponents/Sidebar';
import PageContent from '../../components/DashboardComponents/PageContent';
import '../../components/DashboardComponents/dash.css'

function Home() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('/orders');

    return (
        <div className='Home'>
            <Header />
            <Space className='SideandDisplay'>
                <Sidebar setSelectedMenuItem={setSelectedMenuItem} />
                <PageContent selectedMenuItem={selectedMenuItem} />
            </Space>
            <Footer/>
        </div>
    )
}

export default Home;