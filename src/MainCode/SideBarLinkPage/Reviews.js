import React, { useState } from "react";
import "./Reviews.css";
import {
  HeartOutlined,
  DislikeOutlined,
  HeartFilled,
  DislikeFilled,
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
    setIsButtonDisabled(true); // Disable the button after sending a comment
  };

  const handleCommentInputChange = (e) => {
    const inputText = e.target.value;
    setNewComment(inputText);
    setIsButtonDisabled(inputText === ''); // Disable the button if the input is empty
  };

  return (
    <div className="reviews-container">
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
                  <span>{review.likeCount}</span>
                </>
              ) : (
                <>
                  <HeartOutlined onClick={() => handleLikeClick(index)} />
                  <span>{review.likeCount}</span>
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
                  <span>{review.dislikeCount}</span>
                </>
              ) : (
                <>
                  <DislikeOutlined onClick={() => handleDislikeClick(index)} />
                  <span>{review.dislikeCount}</span>
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
              placeholder="Type your comment here"
              value={newComment}
              onChange={handleCommentInputChange}
              className="input-field"
            />
            <button
              className={`send-button ${isButtonDisabled ? "disabled-button" : ""}`}
              onClick={handleSendClick}
              disabled={isButtonDisabled}
            >
              Send
            </button>
          </div>
        ) : (
          <button className="add-comment-button" onClick={handleShowInputClick}>
            Add a Comment
          </button>
        )}
      </div>
    </div>
  );
}

export default Reviews;
