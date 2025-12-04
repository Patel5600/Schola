'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    description?: string;
    fileUrl: string;
    subject: string;
    semester: number;
    downloadCount: number;
    createdAt: string;
    author: {
      name: string;
    };
  };
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {note.title}
        </CardTitle>
        <CardDescription>
          {note.subject} • Semester {note.semester} • {note.downloadCount} downloads
        </CardDescription>
      </CardHeader>
      <CardContent>
        {note.description && <p className="text-sm text-muted-foreground mb-4">{note.description}</p>}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            By {note.author.name} • {format(new Date(note.createdAt), 'MMM d, yyyy')}
          </span>
          <Button size="sm" onClick={() => window.open(note.fileUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

