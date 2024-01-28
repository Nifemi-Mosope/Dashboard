import React, {useEffect, useState} from 'react';
import {Space} from 'antd'
import Header from '../../components/DashboardComponents/Header';
import Footer from '../../components/DashboardComponents/Footer';
import Sidebar from '../../components/DashboardComponents/Sidebar';
import PageContent from '../../components/DashboardComponents/PageContent';
import '../../components/DashboardComponents/dash.css'
import { useMenuContext } from '../SideBarLinkPage/Menus/MenuContext';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('/orders');
    const { auth } = useMenuContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(auth?.accesstoken === undefined){
            navigate('/signIn')
        }
    },[auth])

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