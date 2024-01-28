import React from "react";
import { messaging } from "../../notifcations/firebase";
import { onMessage } from "firebase/messaging";
import { notification } from "antd";
import notificationSound from "../../message_tone.mp3";

const Notification = () => {
    onMessage(messaging, (payload) => {
      console.log(payload);
      notification.open({
        message: "New Order",
        description: "There is a new order",
      });
  
      // Add sound notification
      const audio = new Audio(notificationSound);
      audio.play();
    });
  
    return <></>;
  };
  
  export default Notification;
  