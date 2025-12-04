'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    type: 'offer' | 'request';
    tags: string[];
    createdAt: string;
    author: {
      name: string;
      email: string;
    };
  };
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{skill.title}</CardTitle>
            <CardDescription>
              {skill.type === 'offer' ? 'Offering' : 'Requesting'} • By {skill.author.name} •{' '}
              {format(new Date(skill.createdAt), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge variant={skill.type === 'offer' ? 'default' : 'secondary'}>
            {skill.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

