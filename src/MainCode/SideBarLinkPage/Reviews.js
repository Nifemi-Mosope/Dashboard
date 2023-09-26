import React, { useState } from "react";
import "./Reviews.css";
import {
  HeartOutlined,
  DislikeOutlined,
  HeartFilled,
  DislikeFilled,
  SendOutlined
} from "@ant-design/icons";
import moment from "moment/moment";
import profileUserImage from '../../components/DashboardComponents/Quickee.jpeg'

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [newCommentUserImage, setNewCommentUserImage] = useState(profileUserImage);
  const [hasReviews, setHasReviews] = useState(false);

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
      username: 'QuicKee Restaurant',
      content: newComment,
      userImage: newCommentUserImage,
      likeCount: 0,
      dislikeCount: 0,
      date: timestamp,
    };
    reviews.push(newReviewObj);

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
      {hasReviews ? null : (
        <div style={{fontFamily: 'sans-serif', fontSize: '1.2rem', textAlign: 'center', color: 'grey', marginLeft: '15rem', marginTop: '10rem'}}>
          No Reviews yet, Click the button on your bottom right to get started
        </div>
      )}
      {reviews.map((review, index) => (
        <div key={index} className="review">
          <div className="user-info">
            <img src={review.userImage} alt={`${review.username}'s avatar`} />
            <div className="user-details">
              <span className="username">{review.username}</span>
              <span className="date">{review.date}</span>
            </div>
          </div>
          <p className="review-content">{review.content}</p>
          <div className="review-actions">
            <span className={`like-count ${likedReviews[index] ? "active" : ""}`}>
              {likedReviews[index] ? (
                <>
                  <HeartFilled
                    style={{ color: "#c45628" }}
                    onClick={() => handleLikeClick(index)}
                  />
                  <span style={{ color: "#c45628", fontFamily: 'sans-serif' }}>{review.likeCount}</span>
                </>
              ) : (
                <>
                  <HeartOutlined onClick={() => handleLikeClick(index)} />
                  <span style={{ fontFamily: 'sans-serif' }}>{review.likeCount}</span>
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
                  <span style={{ color: "#c45628", fontFamily: 'sans-serif'}}>{review.dislikeCount}</span>
                </>
              ) : (
                <>
                  <DislikeOutlined onClick={() => handleDislikeClick(index)} />
                  <span style={{ fontFamily: 'sans-serif' }}>{review.dislikeCount}</span>
                </>
              )}
            </span>
          </div>
        </div>
      ))}
      <div className={`add-comment ${showInput ? "active" : ""}`}>
        {showInput ? (
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
        ) : (
          <button className="add-comment-button" onClick={handleShowInputClick}>
            Say Something...
          </button>
        )}
      </div>
    </div>
  );
}

export default Reviews;
