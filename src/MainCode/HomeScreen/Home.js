import React, {useEffect, useState} from 'react';
import {Space} from 'antd'
import Header from '../../components/DashboardComponents/Header';
import Footer from '../../components/DashboardComponents/Footer';
import Sidebar from '../../components/DashboardComponents/Sidebar';
import PageContent from '../../components/DashboardComponents/PageContent';
import '../../components/DashboardComponents/dash.css'
import { useMenuContext } from '../SideBarLinkPage/Menus/MenuContext';
import { useNavigate } from 'react-router-dom';
import { Signin, GetNewToken } from '../Features/KitchenSlice';

function Home() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('/orders');
    const { auth, userData, refreshToken } = useMenuContext();
    const {intV, setIntV} = useState(10000)
    const navigate = useNavigate();
    
    useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        if (!userData){
            if(auth?.accesstoken === undefined){
                navigate('/signIn')
            } else if (auth?.accesstoken === null){
              navigate('/signIn')
            }
        }
      };

      fetchData();

      return () => {
          isMounted = false;
      };
    },[auth, navigate, userData]);

    useEffect(() => {
        const interval = setInterval(() => {
            const auth2 = localStorage.getItem('auth');
            console.log(auth2, userData, "Hello")
            if(userData && auth2 === null){
                GetNewToken({ Email: userData, UserId: userData }, refreshToken);
                
            }
        }, [intV])
        return clearInterval(interval)
    }, [userData, refreshToken])

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