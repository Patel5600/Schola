import { announcementService } from '../announcementService';
import prisma from '../../config/database';

// Mock Prisma
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    announcement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('AnnouncementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an announcement', async () => {
      const mockAnnouncement = {
        id: '1',
        title: 'Test Announcement',
        content: 'Test Content',
        authorId: 'author1',
        isPinned: false,
        createdAt: new Date(),
        author: {
          id: 'author1',
          name: 'Author',
          email: 'author@example.com',
        },
      };

      (prisma.announcement.create as jest.Mock).mockResolvedValue(mockAnnouncement);

      const result = await announcementService.create(
        {
          title: 'Test Announcement',
          content: 'Test Content',
        },
        'author1'
      );

      expect(prisma.announcement.create).toHaveBeenCalled();
      expect(result.title).toBe('Test Announcement');
      expect(result.authorId).toBe('author1');
    });
  });

  describe('getAll', () => {
    it('should return filtered announcements', async () => {
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Test 1',
          content: 'Content 1',
          isPinned: true,
          author: { id: '1', name: 'Author', email: 'author@example.com' },
        },
      ];

      (prisma.announcement.findMany as jest.Mock).mockResolvedValue(mockAnnouncements);

      const result = await announcementService.getAll({ pinned: true });

      expect(prisma.announcement.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].isPinned).toBe(true);
    });
  });
});

