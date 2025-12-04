'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { announcementsAPI } from '@/lib/api';
import AnnouncementCard from '@/components/AnnouncementCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll({ role: user?.role });
      setAnnouncements(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with department news</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'admin') && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No announcements found
          </div>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        )}
      </div>
    </div>
  );
}

