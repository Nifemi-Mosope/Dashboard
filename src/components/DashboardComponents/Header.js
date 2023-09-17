import React from 'react';
import './dash.css'
import quickeeImage from './Quickee.jpeg'
import { Badge, Image, Space, Typography } from 'antd';
import { MailOutlined, BellFilled } from '@ant-design/icons';

function Header() {
    const imageStyle = {
        width: '50px',
        borderRadius: '50%',
    }
    return (
        <div className='Header'>
            <Image src={quickeeImage} style={imageStyle}></Image>
            <Typography.Title>QuicKee Restaurant</Typography.Title>
            <div style={{marginRight: '1%'}}>
                <Space size={26}>
                    <Badge style={{cursor: 'pointer'}}>
                        <MailOutlined style={{fontSize: '20px'}}/>
                    </Badge>
                    <Badge style={{cursor: 'pointer'}}>
                        <BellFilled style={{fontSize: '20px'}}/>
                    </Badge>
                </Space>
            </div>
        </div>
    )
}

export default Header;