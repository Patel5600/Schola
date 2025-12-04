'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { notesAPI } from '@/lib/api';
import NoteCard from '@/components/NoteCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSubject, setSearchSubject] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const filters: any = {};
      if (searchSubject) filters.subject = searchSubject;
      if (filterSemester) filters.semester = parseInt(filterSemester);
      
      const response = await notesAPI.getAll(filters);
      setNotes(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchSubject, filterSemester]);

  if (loading && notes.length === 0) {
    return <div className="text-muted-foreground">Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Access study materials and resources</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'admin') && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Note
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject..."
            value={searchSubject}
            onChange={(e) => setSearchSubject(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="number"
          placeholder="Semester"
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="w-32"
          min="1"
          max="8"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No notes found
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    </div>
  );
}

