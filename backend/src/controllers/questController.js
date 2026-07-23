import prisma from '../utils/db.js';
import { createQuestSchema, updateQuestSchema } from '../utils/validation.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Create a new quest
// @route   POST /api/v1/quests
// @access  Private (Giver)
export const createQuest = async (req, res) => {
  try {
    const validation = createQuestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.flatten().fieldErrors
      });
    }

    const { title, description, category, location, deadline, compensation } = validation.data;

    // Start database transaction
    const quest = await prisma.$transaction(async (tx) => {
      // 1. Create Quest
      const newQuest = await tx.quest.create({
        data: {
          title,
          description,
          category,
          location,
          deadline: new Date(deadline),
          compensation,
          giverId: req.user.id,
          status: 'OPEN'
        }
      });

      // 2. Increment user's questsGiven count
      await tx.user.update({
        where: { id: req.user.id },
        data: { questsGiven: { increment: 1 } }
      });

      // 3. Log to Quest History
      await tx.questHistory.create({
        data: {
          questId: newQuest.id,
          status: 'OPEN',
          changedById: req.user.id
        }
      });

      return newQuest;
    });

    // Event A: Saat user membuat Quest
    await createNotification({
      userId: req.user.id,
      questId: quest.id,
      title: 'Quest Dipublikasikan',
      message: `Quest '${quest.title}' berhasil dipublikasikan.`
    });

    return res.status(201).json({
      success: true,
      message: 'Quest berhasil diposting!',
      data: { quest }
    });
  } catch (error) {
    console.error('Create quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memposting quest.'
    });
  }
};

// @desc    Get quest feed with filters & pagination
// @route   GET /api/v1/quests
// @access  Public
export const getQuestFeed = async (req, res) => {
  try {
    const {
      category,
      status = 'OPEN',
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build prisma query filters
    const where = {};

    // Filter by status (default is OPEN)
    if (status && status !== 'ALL') {
      where.status = status;
      if (status === 'OPEN') {
        where.deadline = {
          gt: new Date()
        };
      }
    }

    // Filter by category
    if (category && category !== 'ALL') {
      where.category = category;
    }

    // Filter by compensation price range
    if (minPrice || maxPrice) {
      where.compensation = {};
      if (minPrice) where.compensation.gte = parseFloat(minPrice);
      if (maxPrice) where.compensation.lte = parseFloat(maxPrice);
    }

    // Search query in title or description
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } }
      ];
    }

    // Sorting options
    let orderBy = { createdAt: 'desc' };
    if (sort === 'deadline') {
      orderBy = { deadline: 'asc' };
    } else if (sort === 'price_asc') {
      orderBy = { compensation: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { compensation: 'desc' };
    }

    // Fetch quests and count total
    const [quests, total] = await Promise.all([
      prisma.quest.findMany({
        where,
        orderBy,
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
    console.error('Get feed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil feed quest.'
    });
  }
};

// @desc    Get quest details
// @route   GET /api/v1/quests/:id
// @access  Public
export const getQuestDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({
      where: { id },
      include: {
        giver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            reputation: true,
            avatarUrl: true,
            bio: true
          }
        },
        taker: {
          select: {
            id: true,
            fullName: true,
            email: true,
            reputation: true,
            avatarUrl: true,
            qrisUrl: true,
            bio: true
          }
        },
        ratings: {
          include: {
            rater: {
              select: {
                fullName: true,
                avatarUrl: true
              }
            }
          }
        },
        history: {
          orderBy: { changedAt: 'asc' },
          include: {
            changedBy: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: { quest }
    });
  } catch (error) {
    console.error('Get detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil detail quest.'
    });
  }
};

// @desc    Update quest details
// @route   PUT /api/v1/quests/:id
// @access  Private (Giver owner)
export const updateQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    // Guard: Giver owner only & status must be OPEN
    if (quest.giverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak untuk mengedit quest ini.' });
    }

    if (quest.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Hanya quest berstatus OPEN yang dapat diedit.' });
    }

    const validation = updateQuestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.flatten().fieldErrors
      });
    }

    const updatedData = { ...validation.data };
    if (updatedData.deadline) {
      updatedData.deadline = new Date(updatedData.deadline);
    }

    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: updatedData
    });

    return res.status(200).json({
      success: true,
      message: 'Quest berhasil diperbarui!',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Update quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memperbarui quest.'
    });
  }
};

// @desc    Cancel quest (Giver owner, soft-delete style)
// @route   DELETE /api/v1/quests/:id
// @access  Private (Giver owner)
export const cancelQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    if (quest.giverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak untuk membatalkan quest ini.' });
    }

    if (quest.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Hanya quest berstatus OPEN yang dapat dibatalkan.' });
    }

    await prisma.$transaction([
      prisma.quest.update({
        where: { id },
        data: { status: 'CANCELLED' }
      }),
      prisma.questHistory.create({
        data: {
          questId: id,
          status: 'CANCELLED',
          changedById: req.user.id
        }
      })
    ]);

    // Event C Case 1: Saat quest dibatalkan oleh pembuat
    await createNotification({
      userId: req.user.id,
      questId: id,
      title: 'Quest Dibatalkan',
      message: `Quest '${quest.title}' telah dibatalkan.`
    });

    return res.status(200).json({
      success: true,
      message: 'Quest berhasil dibatalkan.'
    });
  } catch (error) {
    console.error('Cancel quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat membatalkan quest.'
    });
  }
};

// @desc    Take a quest (Taker)
// @route   POST /api/v1/quests/:id/take
// @access  Private
export const takeQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    // Guards
    if (quest.giverId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat mengambil quest buatan sendiri.' });
    }

    if (quest.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Quest sudah diambil atau tidak lagi tersedia.' });
    }

    // Limit check: Max 1 active quest (TAKEN or IN_PROGRESS)
    const activeQuest = await prisma.quest.findFirst({
      where: {
        takerId: req.user.id,
        status: { in: ['TAKEN', 'IN_PROGRESS'] }
      }
    });

    if (activeQuest) {
      return res.status(400).json({
        success: false,
        message: 'Anda memiliki quest aktif yang belum diselesaikan. Maksimal 1 quest aktif.'
      });
    }

    const updatedQuest = await prisma.$transaction(async (tx) => {
      // 1. Update Quest
      const updated = await tx.quest.update({
        where: { id },
        data: {
          status: 'TAKEN',
          takerId: req.user.id
        }
      });

      // 2. Increment user's questsTaken count
      await tx.user.update({
        where: { id: req.user.id },
        data: { questsTaken: { increment: 1 } }
      });

      // 3. Log to Quest History
      await tx.questHistory.create({
        data: {
          questId: id,
          status: 'TAKEN',
          changedById: req.user.id
        }
      });

      return updated;
    });

    // Event B: Saat quest diambil orang lain
    const taker = await prisma.user.findUnique({ where: { id: req.user.id } });
    await createNotification({
      userId: quest.giverId,
      questId: quest.id,
      title: 'Quest Diambil',
      message: `${taker.fullName} mengambil quest '${quest.title}'.`
    });

    return res.status(200).json({
      success: true,
      message: 'Quest berhasil diambil! Segera koordinasikan dengan pemberi quest.',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Take quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil quest.'
    });
  }
};

// @desc    Start quest work progress
// @route   POST /api/v1/quests/:id/start
// @access  Private (Taker owner)
export const startQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    if (quest.takerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda bukan pengerjaan quest ini.' });
    }

    if (quest.status !== 'TAKEN') {
      return res.status(400).json({ success: false, message: 'Quest harus berstatus TAKEN untuk dapat dikerjakan.' });
    }

    const updatedQuest = await prisma.$transaction(async (tx) => {
      const updated = await tx.quest.update({
        where: { id },
        data: { status: 'IN_PROGRESS' }
      });

      await tx.questHistory.create({
        data: {
          questId: id,
          status: 'IN_PROGRESS',
          changedById: req.user.id
        }
      });

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: 'Progress quest dimulai. Selamat bekerja!',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Start quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memulai quest.'
    });
  }
};

// @desc    Complete quest work
// @route   POST /api/v1/quests/:id/complete
// @access  Private (Taker owner)
export const completeQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    if (quest.takerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda bukan pengerjaan quest ini.' });
    }

    if (quest.status !== 'IN_PROGRESS') {
      return res.status(400).json({ success: false, message: 'Hanya quest IN_PROGRESS yang dapat ditandai selesai.' });
    }

    const updatedQuest = await prisma.$transaction(async (tx) => {
      const updated = await tx.quest.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });

      await tx.questHistory.create({
        data: {
          questId: id,
          status: 'COMPLETED',
          changedById: req.user.id
        }
      });

      return updated;
    });

    // Event D: Saat quest selesai
    const taker = await prisma.user.findUnique({ where: { id: req.user.id } });
    // Notify Giver
    await createNotification({
      userId: quest.giverId,
      questId: id,
      title: 'Quest Selesai',
      message: `Quest '${quest.title}' telah diselesaikan oleh ${taker.fullName}.`
    });
    // Notify Taker
    await createNotification({
      userId: req.user.id,
      questId: id,
      title: 'Quest Selesai',
      message: `Anda berhasil menyelesaikan quest '${quest.title}'.`
    });

    return res.status(200).json({
      success: true,
      message: 'Quest ditandai selesai! Harap tunggu konfirmasi pembayaran dari pemberi quest.',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Complete quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menyelesaikan quest.'
    });
  }
};

// @desc    Cancel taken quest (Release)
// @route   POST /api/v1/quests/:id/release
// @access  Private (Taker owner)
export const cancelTake = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    if (quest.takerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda bukan pengerjaan quest ini.' });
    }

    if (quest.status !== 'TAKEN') {
      return res.status(400).json({ success: false, message: 'Quest hanya bisa dilepaskan jika berstatus TAKEN.' });
    }

    const updatedQuest = await prisma.$transaction(async (tx) => {
      // 1. Reset Quest
      const updated = await tx.quest.update({
        where: { id },
        data: {
          status: 'OPEN',
          takerId: null
        }
      });

      // 2. Decrement user's questsTaken count
      await tx.user.update({
        where: { id: req.user.id },
        data: { questsTaken: { decrement: 1 } }
      });

      // 3. Log to Quest History
      await tx.questHistory.create({
        data: {
          questId: id,
          status: 'OPEN',
          changedById: req.user.id
        }
      });

      return updated;
    });

    // Event C Case 2: Saat taker membatalkan pengambilan quest
    const taker = await prisma.user.findUnique({ where: { id: req.user.id } });
    // Notify Giver
    await createNotification({
      userId: quest.giverId,
      questId: id,
      title: 'Pengambilan Quest Dibatalkan',
      message: `${taker.fullName} membatalkan pengambilan quest '${quest.title}'.`
    });
    // Notify Taker
    await createNotification({
      userId: req.user.id,
      questId: id,
      title: 'Pengambilan Quest Dibatalkan',
      message: `Anda membatalkan pengambilan quest '${quest.title}'.`
    });

    return res.status(200).json({
      success: true,
      message: 'Pengambilan quest dibatalkan. Quest terbuka kembali untuk umum.',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Release quest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat membatalkan pengambilan quest.'
    });
  }
};

// @desc    Confirm quest payment
// @route   POST /api/v1/quests/:id/pay
// @access  Private (Giver owner)
export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    if (quest.giverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Hanya pemberi quest yang dapat mengonfirmasi pembayaran.' });
    }

    if (quest.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Pembayaran hanya bisa dikonfirmasi untuk quest berstatus COMPLETED.' });
    }

    if (quest.paymentConfirmed) {
      return res.status(400).json({ success: false, message: 'Pembayaran quest ini sudah pernah dikonfirmasi sebelumnya.' });
    }

    const updatedQuest = await prisma.$transaction(async (tx) => {
      const updated = await tx.quest.update({
        where: { id },
        data: { paymentConfirmed: true }
      });

      await tx.questHistory.create({
        data: {
          questId: id,
          status: 'COMPLETED',
          changedById: req.user.id
        }
      });

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi! Fase ulasan sekarang dibuka.',
      data: { quest: updatedQuest }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengonfirmasi pembayaran.'
    });
  }
};
