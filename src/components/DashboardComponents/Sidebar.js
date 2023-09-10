import React from 'react';
import './dash.css'
import { Menu } from 'antd';
import {AppstoreOutlined} from '@ant-design/icons'
import { ChatCircleDots, ClockCounterClockwise, CookingPot, ShoppingCart } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate()
    return (
        <div className='Sidebar'>
            <Menu
                className='custom-menu'
                onClick={(item) => {
                    //item.key
                    navigate(item.key)
                }}
                items={[
                    {
                        label: 'Dashboard',
                        icon: <AppstoreOutlined />,
                        key: '/dashboard'
                    },
                    {
                        label: 'Orders',
                        icon: <ShoppingCart/>,
                        key: '/orders',
                    },
                    {
                        label: 'Order History',
                        icon: <ClockCounterClockwise/>,
                        key: '/orderhistory',
                    },
                    {
                        label: 'Reviews',
                        icon: <ChatCircleDots/>,
                        key: '/reviews',
                    },
                    {
                        label: 'Menus',
                        icon: <CookingPot/>,
                        key: '/menus',
                    }
                ]}
            ></Menu>
        </div>
    )
}

export default Sidebar;