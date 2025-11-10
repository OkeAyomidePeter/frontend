import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

import { buildAssetUrl } from "@/lib/data-utils";

interface CertificationCardProps {
  title: string;
  issuer: string;
  date: string;
  image_path: string | null;
  verification_link?: string | null;
  credential_id?: string | null;
}

export function CertificationCard({
  title,
  issuer,
  date,
  image_path,
  verification_link,
  credential_id,
}: CertificationCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = buildAssetUrl(image_path) ?? "https://placehold.co/600x400";

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>{issuer}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        {credential_id && (
          <p className="mt-2 text-xs text-muted-foreground">
            ID: {credential_id}
          </p>
        )}
      </CardContent>
      {verification_link && (
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="w-full">
            <a
              href={verification_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Verify Certificate
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
