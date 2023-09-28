import React from 'react';
import './dash.css'
import { Menu } from 'antd';
import {AppstoreOutlined, SettingOutlined} from '@ant-design/icons'
import { ChatCircleDots, ClockCounterClockwise, CookingPot, ShoppingCart } from 'phosphor-react';

function Sidebar({ setSelectedMenuItem }) {
    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item.key);
    };

    return (
        <div className='Sidebar'>
            <Menu
                className='custom-menu'
                onClick={handleMenuItemClick}
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
                    },
                    {
                        label: 'Settings',
                        icon: <SettingOutlined/>,
                        key: '/settings',
                    }
                ]}
            ></Menu>
        </div>
    )
}

export default Sidebar;