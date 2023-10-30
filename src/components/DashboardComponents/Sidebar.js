import React, {useState} from 'react';
import './dash.css';
import { Menu, Modal } from 'antd';
import { AppstoreOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { ChatCircleDots, ClockCounterClockwise, CookingPot, ShoppingCart } from 'phosphor-react';
import { useMenuContext } from '../../MainCode/SideBarLinkPage/MenuContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setSelectedMenuItem }) {
    const {setUser} = useMenuContext()
    const navigate = useNavigate();
    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item.key);
    };
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const showLogoutModal = () => {
        setLogoutModalVisible(true);
    };
    
    const handleLogout = () => {
        setUser(null); // Clear user data
        setLogoutModalVisible(false);
        navigate('/signIn')
      };
    const logoutModal = (
        <Modal
            title="Logout"
            open={logoutModalVisible}
            onOk={handleLogout}
            onCancel={() => setLogoutModalVisible(false)}
            okText="Logout"
            cancelText="Cancel"
        >
            Are you sure you want to log out?
        </Modal>
    );

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
                        icon: <ShoppingCart />,
                        key: '/orders',
                    },
                    {
                        label: 'Order History',
                        icon: <ClockCounterClockwise />,
                        key: '/orderhistory',
                    },
                    {
                        label: 'Reviews',
                        icon: <ChatCircleDots />,
                        key: '/reviews',
                    },
                    {
                        label: 'Menus',
                        icon: <CookingPot />,
                        key: '/menus',
                    },
                    {
                        label: 'Settings',
                        icon: <SettingOutlined />,
                        key: '/settings',
                    },
                    {
                        label: 'Logout',
                        icon: <LogoutOutlined />,
                        onClick: showLogoutModal,
                    }
                ]}
                style={{ height: '688px' }}
            ></Menu>
            {logoutModal}
        </div>
    )
}

export default Sidebar;
