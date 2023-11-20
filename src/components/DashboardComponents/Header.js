import React, { useState, useEffect } from 'react';
import './dash.css';
import quickeeImage from './Quickee.jpeg';
import { Badge, Image, Rate, Space, Typography } from 'antd';
import { MailOutlined, BellFilled } from '@ant-design/icons';
import { useMenuContext } from '../../MainCode/SideBarLinkPage/MenuContext';
import { GetReviews } from '../../MainCode/Features/KitchenSlice';

function Header() {
  const { userData, image, auth } = useMenuContext();
  const [totalReviews, setTotalReviews] = useState(0);
  const storedKitchenImageUrl = localStorage.getItem('kitchenImageUrl');
  const imageStyle = {
    width: '50px',
    borderRadius: '50%',
  };

  const fetchReviews = async () => {
    try {
      const response = await GetReviews(userData, auth);
      if (response && response.code === 200) {
        const reviewsResponse = response.body;
        const totalReviewsReceived = reviewsResponse ? reviewsResponse.length : 0;
        setTotalReviews(totalReviewsReceived);
        localStorage.setItem('totalReviews', totalReviewsReceived.toString());
      }
    } catch (error) {
      console.error("Error fetching kitchen reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [userData.Id, auth]);

  const getKitchenImageUrl = () => {
    if (userData && userData.KitchenImage) {
      return `http://192.168.226.144:85/Uploads/${userData.KitchenImage}`;
    }
    return quickeeImage;
  };

  const kitchenImageUrl = getKitchenImageUrl();

  if (kitchenImageUrl !== storedKitchenImageUrl) {
    localStorage.setItem('kitchenImageUrl', kitchenImageUrl);
  }

  return (
    <div className='Header'>
      <Image src={kitchenImageUrl} style={imageStyle} />
      <Typography.Title style={{ fontFamily: 'sans-serif', marginLeft: '5%' }}>{userData ? userData.KitchenName : 'Loading...'}</Typography.Title>

      <div style={{ marginRight: '3%' }}>
        <Space size={26}>
          <Rate />
          <Badge count={totalReviews} style={{ cursor: 'pointer' }}>
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
