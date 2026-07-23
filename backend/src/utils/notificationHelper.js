import prisma from './db.js';

/**
 * Creates a notification in the database for a specific user.
 * 
 * @param {Object} params
 * @param {string} params.userId - Receiver of the notification
 * @param {string|null} [params.questId] - Associated quest ID
 * @param {string} params.title - Title of the notification
 * @param {string} params.message - Body of the notification
 */
export async function createNotification({ userId, questId = null, title, message }) {
  try {
    if (!userId) return null;
    const notification = await prisma.notification.create({
      data: {
        userId,
        questId,
        title,
        message
      }
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}
