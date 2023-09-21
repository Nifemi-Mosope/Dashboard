import React, { useState } from "react";
import "./Reviews.css";
import {
  HeartOutlined,
  DislikeOutlined,
  HeartFilled,
  DislikeFilled,
} from "@ant-design/icons";
import moment from "moment/moment";

function Reviews() {
  // Sample review data
  const [reviews, setReviews] = useState([
    {
      username: "John Doe",
      date: "August 30, 2023",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      userImage: "https://via.placeholder.com/150",
      likeCount: 10,
      dislikeCount: 30,
    },
    {
      username: "Alice Smith",
      date: "August 29, 2023",
      content: "Pellentesque eget magna sit amet purus gravida consectetur.",
      userImage: "https://via.placeholder.com/150",
      likeCount: 10,
      dislikeCount: 30,
    },
  ]);

  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState('');

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
      userImage: 'dislikeCount',
      likeCount: 0,
      dislikeCount: 0,
      date: timestamp,
    };
    reviews.push(newReviewObj);

    setNewComment('');
    setShowInput(false);
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
            <span className={`like-count ${likedReviews[index] ? 'active' : ''}`}>
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
            <span className={`dislike-count ${dislikedReviews[index] ? 'active' : ''}`}>
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
      <div className={`add-comment ${showInput ? 'active' : ''}`}>
        {showInput ? (
          <div className="comment-input">
            <input
              type="text"
              placeholder="Type your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="send-button" onClick={handleSendClick}>
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

