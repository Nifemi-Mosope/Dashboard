import React, { useState } from 'react';
import { Layout, Row, Col, Card, Avatar, Button } from 'antd';
import { HeartOutlined, DislikeOutlined, HeartFilled, DislikeFilled } from '@ant-design/icons';
import '../../components/DashboardComponents/dash.css';
const { Meta } = Card;

const { Content } = Layout;

const reviews = [
  {
    name: 'Oluwanifemi Ojinni',
    content: 'You guys didnt attend to me very well and i dont like it.',
    image: 'https://via.placeholder.com/150',
    likeCount: 30,
    unLike: 20,
    date: '30th August 2019',
  },
  {
    name: 'Alice Smith',
    content: 'I loved the ambiance and the delicious dishes.',
    image: 'https://via.placeholder.com/150',
    likeCount: 30,
    unLike: 20,
    date: '30th August 2019',
  },
  {
    name: 'Ella Brown',
    content: 'Amazing restaurant, highly recommended!',
    image: 'https://via.placeholder.com/150',
    likeCount: 30,
    unLike: 20,
    date: '30th August 2019',
  },
  {
    name: 'Ella Brown',
    content: 'Amazing restaurant, highly recommended!',
    image: 'https://via.placeholder.com/150',
    likeCount: 30,
    unLike: 20,
    date: '30th August 2019',
  },
  {
    name: 'Ella Brown',
    content: 'Amazing restaurant, highly recommended!',
    image: 'https://via.placeholder.com/150',
    likeCount: 30,
    unLike: 20,
    date: '30th August 2019',
  },
];

function Reviews() {
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});

  const handleLikeClick = (index) => {
    if (!likedReviews[index]) {
      setLikedReviews({ ...likedReviews, [index]: true });
      reviews[index].likeCount += 1;
    } else {
      setLikedReviews({ ...likedReviews, [index]: false });
      reviews[index].likeCount -= 1;
    }
  };

  const handleDislikeClick = (index) => {
    if (!dislikedReviews[index]) {
      setDislikedReviews({ ...dislikedReviews, [index]: true });
      reviews[index].unLike += 1;
    } else {
      setDislikedReviews({ ...dislikedReviews, [index]: false });
      reviews[index].unLike -= 1;
    }
  };

  return (
    <Layout>
      <Content className="content">
        <Row gutter={[16, 16]}>
          {reviews.map((review, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card className="review-card">
                <Meta
                  avatar={<Avatar src={review.image} />}
                  title={
                    <div className="review-title">
                     {review.name} &bull; {review.date}
                    </div>
                  }
                  description={<div className="review-description">{review.content}</div>}
                />
                <div className="review-actions">
                  <div className="action-count">
                    <span>{review.likeCount}</span>
                  </div>
                  <Button
                    icon={likedReviews[index] ? <HeartFilled style={{ color: '#c45628' }} /> : <HeartOutlined />}
                    size="large"
                    shape="circle"
                    className="like-button"
                    onClick={() => handleLikeClick(index)}
                  />
                  <div className="action-count">
                    <span>{review.unLike}</span>
                  </div>
                  <Button
                    icon={dislikedReviews[index] ? <DislikeFilled style={{ color: '#c45628' }} /> : <DislikeOutlined />}
                    size="large"
                    shape="circle"
                    className="dislike-button"
                    onClick={() => handleDislikeClick(index)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button type="primary">Say Something</Button>
        </div>
      </Content>
    </Layout>
  );
}

export default Reviews;
