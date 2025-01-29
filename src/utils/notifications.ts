import { notificationApi } from "@/services/api/notificationApi";

export const sendNotification = async ({
  userId,
  title,
  message,
  type,
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
}) => {
  try {
    await notificationApi.create({
      user_id: userId,
      title,
      message,
      type,
      read: false,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
