import React, { useState } from 'react';
import { Layout, Row, Col, Card, Avatar, Button, Input, Popconfirm, message, Modal } from 'antd';
import { HeartOutlined, DislikeOutlined, HeartFilled, DislikeFilled, SendOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../../components/DashboardComponents/dash.css';;
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
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showEdit, setShowEdit] = useState(null);

  const handleLikeClick = (index) => {
    if (!likedReviews[index]) {
      setLikedReviews({ ...likedReviews, [index]: true });
      setDislikedReviews({ ...dislikedReviews, [index]: false });
      reviews[index].likeCount += 1;
      reviews[index].unLike -= dislikedReviews[index] ? 1 : 0;
    } else {
      setLikedReviews({ ...likedReviews, [index]: false });
      reviews[index].likeCount -= 1;
    }
  };

  const handleDislikeClick = (index) => {
    if (!dislikedReviews[index]) {
      setDislikedReviews({ ...dislikedReviews, [index]: true });
      setLikedReviews({ ...likedReviews, [index]: false });
      reviews[index].unLike += 1;
      reviews[index].likeCount -= likedReviews[index] ? 1 : 0;
    } else {
      setDislikedReviews({ ...dislikedReviews, [index]: false });
      reviews[index].unLike -= 1;
    }
  };

  const handleSaySomethingClick = () => {
    setShowInput(true);
  };

  const handleSendClick = () => {
    const timestamp = moment().format('MMMM Do YYYY, h:mm A');
    const newReviewObj = {
      name: 'QuicKee Restaurant',
      content: newComment,
      image: 'https://via.placeholder.com/150',
      likeCount: 0,
      unLike: 0,
      date: timestamp, // Include the timestamp here
    };
    reviews.push(newReviewObj);
  
    // Reset the review input and hide it
    setNewComment('');
    setShowInput(false);
  };

  const handleEditClick = (index) => {
    setShowEdit(index);
  };
  
  const handleDeleteClick = (index) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this review?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        // Handle deletion here
        reviews.splice(index, 1);
        setShowEdit(null);
        message.success('Review deleted successfully');
      },
      onCancel() {
        message.info('Review deletion cancelled');
      },
    });
  };
  

  return (
    <Layout>
      <Content className="content">
        <Row gutter={[16, 16]}>
          {reviews.map((review, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card className="review-card">
                <Meta
                  avatar={<Avatar src={review.image} className="review-avatar" />}
                  title={
                    <div className="review-header">
                      <div>{review.name}</div>
                      <div className="review-date-time">{review.date}</div>
                      {/* {index === showEdit && (
                        <>
                        <Button
                          icon={<EditOutlined />}
                          type="link"
                          className="edit-button"
                          onClick={() => handleEditClick(index)}
                        />
                        <Popconfirm
                          title="Are you sure you want to delete this review?"
                          onConfirm={() => handleDeleteClick(index)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            className="delete-button"
                          />
                        </Popconfirm>
                      </>
                      )} */}
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
          <Button type="primary" onClick={handleSaySomethingClick}>Say Something</Button>
        </div>
        {showInput && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Input
              placeholder="Type your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ width: '70%' }}
              addonAfter={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendClick}
                  disabled={!newComment.trim()}
                >
                  Send
                </Button>
              }
            />
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default Reviews;