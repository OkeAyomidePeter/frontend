import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Twitter } from "lucide-react";

import { buildAssetUrl } from "@/lib/data-utils";

interface ProjectCardProps {
  title: string;
  description: string;
  preview_image_path: string | null;
  tech_stack: string[];
  category: string;
  github_link?: string | null;
  live_demo_link?: string | null;
  x_link?: string | null;
}

export function ProjectCard({
  title,
  description,
  preview_image_path,
  tech_stack,
  category,
  github_link,
  live_demo_link,
  x_link,
}: ProjectCardProps) {
  const previewUrl =
    buildAssetUrl(preview_image_path) ?? "https://placehold.co/800x600";
  const stack = Array.isArray(tech_stack) ? tech_stack : [];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={previewUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{category}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {stack.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{stack.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {github_link && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a
              href={github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          </Button>
        )}
        {live_demo_link && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a
              href={live_demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          </Button>
        )}
        {x_link && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={x_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) link"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
