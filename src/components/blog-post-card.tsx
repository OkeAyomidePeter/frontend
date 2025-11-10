import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { buildAssetUrl } from "@/lib/data-utils";

interface BlogPostCardProps {
  id: number;
  title: string;
  excerpt: string;
  thumbnail_path: string | null;
  date: string;
  tags: string[];
  read_time: string;
}

export function BlogPostCard({
  id,
  title,
  excerpt,
  thumbnail_path,
  date,
  tags,
  read_time,
}: BlogPostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const thumbnailUrl =
    buildAssetUrl(thumbnail_path) ?? "https://placehold.co/800x600";
  const normalizedTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/blog/${id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {normalizedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{read_time}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
