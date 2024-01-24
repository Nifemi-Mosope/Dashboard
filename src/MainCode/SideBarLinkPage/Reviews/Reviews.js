import React, { useState, useEffect } from "react";
import "./Reviews.css";
import {
  HeartOutlined,
  DislikeOutlined,
  HeartFilled,
  DislikeFilled,
  SendOutlined
} from "@ant-design/icons";
import moment from "moment/moment";
import profileUserImage from '../../../components/DashboardComponents/Think.jpeg';
import { GetReviews } from "../../Features/KitchenSlice";
import { useMenuContext } from "../Menus/MenuContext";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [newCommentUserImage, setNewCommentUserImage] = useState(profileUserImage);
  const [hasReviews, setHasReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userData, auth } = useMenuContext();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (userData.Id) {
          const response = await GetReviews(userData, auth);
  
          if (Array.isArray(response.body) && response.body.length > 0) {
            setReviews(response.body);
            setHasReviews(true);
          } else {
            setReviews([]);
            setHasReviews(false);
          }
        } else {
          setReviews([]);
          setHasReviews(false);
        }
      } catch (error) {
        console.error(error);
        setReviews([]);
        setHasReviews(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, [userData.Id]);

  function formatTimestampToDateString(timestamp) {
    const date = new Date(timestamp);
    return `${date.toDateString()} ${date.toLocaleTimeString()}`;
  }
  
  const handleLikeClick = (index) => {
    const updatedReviews = [...reviews];
    if (!likedReviews[index]) {
      updatedReviews[index].likeCount += 1;
      updatedReviews[index].dislikeCount -= dislikedReviews[index] ? 1 : 0;
      setLikedReviews({ ...likedReviews, [index]: true });
      setDislikedReviews({ ...dislikedReviews, [index]: false });
    } else {
      updatedReviews[index].likeCount -= 1;
      setLikedReviews({ ...likedReviews, [index]: false });
    }
    setReviews(updatedReviews);
  };

  const handleDislikeClick = (index) => {
    const updatedReviews = [...reviews];
    if (!dislikedReviews[index]) {
      updatedReviews[index].dislikeCount += 1;
      updatedReviews[index].likeCount -= likedReviews[index] ? 1 : 0;
      setDislikedReviews({ ...dislikedReviews, [index]: true });
      setLikedReviews({ ...likedReviews, [index]: false });
    } else {
      updatedReviews[index].dislikeCount -= 1;
      setDislikedReviews({ ...dislikedReviews, [index]: false });
    }
    setReviews(updatedReviews);
  };

  const handleShowInputClick = () => {
    setShowInput(true);
  };

  const handleSendClick = () => {
    const timestamp = moment().format('MMMM Do YYYY, h:mm A');
    const newReviewObj = {
      Reviewer: userData.KitchenName,
      Review: newComment,
      userImage: newCommentUserImage,
      likeCount: 0,
      dislikeCount: 0,
      date: timestamp,
    };
    
    const updatedReviews = [...reviews, newReviewObj];
    
    setReviews(updatedReviews);
    setNewComment('');
    setShowInput(false);
    setIsButtonDisabled(true);
    setHasReviews(true);
  };
  

  const handleCommentInputChange = (e) => {
    const inputText = e.target.value;
    setNewComment(inputText);
    setIsButtonDisabled(inputText === '');
  };

  return (
    <div className="reviews-container">
      {loading ? (
        // Loading component
        <div style={{ fontFamily: 'sans-serif', fontSize: '1.2rem', textAlign: 'center', color: 'grey', marginLeft: '15rem', marginTop: '10rem' }}>
          Loading reviews...
        </div>
      ) : (
        hasReviews ? (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <div className="user-info">
                <img src={newCommentUserImage} alt={`${review.Reviewer}'s avatar`} />
                <div className="user-details">
                  <span className="username">{review.Reviewer}</span>
                  <span className="date">{moment(review.CreatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}</span>
                </div>
              </div>
              <p className="review-content">{review.Review}</p>
              <div className="review-actions">
                <span className={`like-count ${likedReviews[index] ? "active" : ""}`}>
                  {likedReviews[index] ? (
                    <>
                      <HeartFilled
                        style={{ color: "#c45628" }}
                        onClick={() => handleLikeClick(index)}
                      />
                      <span style={{ color: "#c45628", fontFamily: 'sans-serif' }}>{review.AgreeCount}</span>
                    </>
                  ) : (
                    <>
                      <HeartOutlined onClick={() => handleLikeClick(index)} />
                      <span style={{ fontFamily: 'sans-serif' }}>{review.AgreeCount}</span>
                    </>
                  )}
                </span>
                <span className={`dislike-count ${dislikedReviews[index] ? "active" : ""}`}>
                  {dislikedReviews[index] ? (
                    <>
                      <DislikeFilled
                        style={{ color: "#c45628" }}
                        onClick={() => handleDislikeClick(index)}
                      />
                      <span style={{ color: "#c45628", fontFamily: 'sans-serif' }}>{review.DisagreeCount}</span>
                    </>
                  ) : (
                    <>
                      <DislikeOutlined onClick={(() => handleDislikeClick(index))} />
                      <span style={{ fontFamily: 'sans-serif' }}>{review.DisagreeCount}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))          
        ) : (
          <div style={{fontFamily: 'sans-serif', fontSize: '1.2rem', textAlign: 'center', color: 'grey', marginLeft: '15rem', marginTop: '10rem'}}>
            No Reviews yet, Wait for your customers to say something about you
          </div>
        )
      )}
{/* 
      {showInput ? (
        <div className="add-comment active">
          <div className="comment-input">
            <input
              type="text"
              placeholder="Say Something ..."
              value={newComment}
              onChange={handleCommentInputChange}
              className="input-field"
              style={{width: '20rem'}}
            />
            <button
              className={`send-button ${isButtonDisabled ? "disabled-button" : ""}`}
              onClick={handleSendClick}
              disabled={isButtonDisabled}
              style={{width: '5rem', marginBottom: '1rem'}}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      ) : (
        <button className="add-comment-button" style={{marginTop: '50%', marginLeft: '201%'}} onClick={handleShowInputClick}>
          Say Something...
        </button>
      )} */}
    </div>
  );
}

export default Reviews;
