'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { skillsAPI } from '@/lib/api';
import SkillCard from '@/components/SkillCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'offer' | 'request' | undefined>();

  useEffect(() => {
    fetchSkills();
  }, [filterType]);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll({ type: filterType });
      setSkills(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Exchange</h1>
          <p className="text-muted-foreground">Share and discover skills within the community</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterType === undefined ? 'default' : 'outline'}
          onClick={() => setFilterType(undefined)}
        >
          All
        </Button>
        <Button
          variant={filterType === 'offer' ? 'default' : 'outline'}
          onClick={() => setFilterType('offer')}
        >
          Offers
        </Button>
        <Button
          variant={filterType === 'request' ? 'default' : 'outline'}
          onClick={() => setFilterType('request')}
        >
          Requests
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No skills found
          </div>
        ) : (
          skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
        )}
      </div>
    </div>
  );
}

