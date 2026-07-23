import prisma from '../utils/db.js';

// @desc    Get all notifications for logged-in user
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat notifikasi'
    });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id
      },
      data: {
        isRead: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Notifikasi ditandai telah dibaca',
      data: {
        notification: updatedNotification
      }
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui notifikasi'
    });
  }
};

// @desc    Get count of unread notifications
// @route   GET /api/v1/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat jumlah notifikasi belum dibaca'
    });
  }
};
