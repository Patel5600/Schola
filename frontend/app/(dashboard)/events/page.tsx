'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { eventsAPI } from '@/lib/api';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [showUpcoming]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ upcoming: showUpcoming });
      setEvents(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await eventsAPI.register(eventId);
      toast.success('Successfully registered for event');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to register for event');
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and register for department events</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showUpcoming ? 'default' : 'outline'}
            onClick={() => setShowUpcoming(true)}
          >
            Upcoming
          </Button>
          <Button
            variant={!showUpcoming ? 'default' : 'outline'}
            onClick={() => setShowUpcoming(false)}
          >
            Past
          </Button>
          {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'admin') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No events found
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
              isRegistered={event.registrations?.some((r: any) => r.userId === user?.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

