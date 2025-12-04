'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pin } from 'lucide-react';
import { format } from 'date-fns';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: string;
    author: {
      name: string;
      email: string;
    };
  };
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className={announcement.isPinned ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {announcement.isPinned && <Pin className="h-4 w-4 text-primary" />}
              {announcement.title}
            </CardTitle>
            <CardDescription>
              By {announcement.author.name} • {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}

