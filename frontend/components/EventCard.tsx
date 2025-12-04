'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    status: string;
    maxAttendees?: number;
    registrations: any[];
    organizer: {
      name: string;
    };
  };
  onRegister?: (eventId: string) => void;
  isRegistered?: boolean;
}

export default function EventCard({ event, onRegister, isRegistered }: EventCardProps) {
  const isUpcoming = new Date(event.date) > new Date();
  const isFull = event.maxAttendees && event.registrations.length >= event.maxAttendees;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
            {event.maxAttendees && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.registrations.length}/{event.maxAttendees}
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Organized by {event.organizer.name}</span>
          {isUpcoming && onRegister && (
            <Button
              size="sm"
              onClick={() => onRegister(event.id)}
              disabled={isRegistered || isFull}
            >
              {isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

