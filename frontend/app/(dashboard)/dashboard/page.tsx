'use client';

import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { announcementsAPI, eventsAPI, notesAPI } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    notes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [announcementsRes, eventsRes, notesRes] = await Promise.all([
          announcementsAPI.getAll({ role: user?.role }),
          eventsAPI.getAll({ upcoming: true }),
          notesAPI.getAll(),
        ]);
        setStats({
          announcements: announcementsRes.data.length,
          events: eventsRes.data.length,
          notes: notesRes.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's what's happening in your department</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest department updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you can attend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Notes</CardTitle>
            <CardDescription>Study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notes}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

