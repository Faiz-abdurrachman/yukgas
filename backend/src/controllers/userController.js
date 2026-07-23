import prisma from '../utils/db.js';
import { updateProfileSchema } from '../utils/validation.js';

// @desc    Get user public profile
// @route   GET /api/v1/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profil pengguna tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil profil pengguna.'
    });
  }
};

// @desc    Update user profile details
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.flatten().fieldErrors
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: validation.data,
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

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memperbarui profil.'
    });
  }
};

// @desc    Get current user's posted quests (given)
// @route   GET /api/v1/users/quests/given
// @access  Private
export const getMyQuestsGiven = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { giverId: req.user.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [quests, total] = await Promise.all([
      prisma.quest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          taker: {
            select: {
              fullName: true,
              reputation: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.quest.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        quests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get my quests given error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil riwayat posting quest.'
    });
  }
};

// @desc    Get current user's taken quests
// @route   GET /api/v1/users/quests/taken
// @access  Private
export const getMyQuestsTaken = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { takerId: req.user.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [quests, total] = await Promise.all([
      prisma.quest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          giver: {
            select: {
              fullName: true,
              reputation: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.quest.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        quests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get my quests taken error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil riwayat pengerjaan quest.'
    });
  }
};
