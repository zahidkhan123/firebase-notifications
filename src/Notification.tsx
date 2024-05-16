import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { collection, onSnapshot, QuerySnapshot, QueryDocumentSnapshot, doc, updateDoc } from 'firebase/firestore';
import { firestore } from './FirebaseConfig';

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'notifications'), (snapshot: QuerySnapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(fetchedNotifications);
    });
  
    return () => unsubscribe();
  }, []);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const notificationRef = doc(firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      console.log("Notification marked as read successfully!");
    } catch (error) {
      console.error("Error marking notification as read: ", error);
    }
  };

  return (
    <List>
    {notifications.map(notification => (
      !notification.read && (
        <ListItem key={notification.id}>
          <ListItemText primary={notification.message} />
          <Button onClick={() => handleNotificationClick(notification.id)}>Mark as Read</Button>
        </ListItem>
      )
    ))}
  </List>
  );
}

export default Notification;
