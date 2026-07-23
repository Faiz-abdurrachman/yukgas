import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak disediakan atau format salah.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');

    // Get user from DB (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        qrisUrl: true,
        reputation: true,
        questsGiven: true,
        questsTaken: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Pengguna tidak ditemukan.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kedaluwarsa. Silakan login kembali.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid.'
    });
  }
};
