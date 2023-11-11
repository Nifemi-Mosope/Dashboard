import React from 'react';
import './dash.css';
import quickeeImage from './Quickee.jpeg';
import { Badge, Image, Space, Typography } from 'antd';
import { MailOutlined, BellFilled } from '@ant-design/icons';
import { useMenuContext } from '../../MainCode/SideBarLinkPage/MenuContext';

function Header() {
  const { userData, image } = useMenuContext();
  const imageStyle = {
    width: '50px',
    borderRadius: '50%',
  };
  // console.log(image);

  return (
    <div className='Header'>
      <Image src={image && image.ImageUrl ? `http://192.168.127.144:85/Uploads/${image.ImageUrl}` : quickeeImage} style={imageStyle} />
      <Typography.Title style={{ fontFamily: 'sans-serif' }}>{userData ? userData.KitchenName : 'Loading...'}</Typography.Title>

      <div style={{ marginRight: '1%' }}>
        <Space size={26}>
          <Badge style={{ cursor: 'pointer' }}>
            <MailOutlined style={{ fontSize: '20px' }} />
          </Badge>
          <Badge style={{ cursor: 'pointer' }} >
            <BellFilled style={{ fontSize: '20px' }} />
          </Badge>
        </Space>
      </div>
    </div>
  );
}

export default Header;
