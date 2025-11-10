import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <Ghost className="w-16 h-16 text-muted-foreground mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div>
        <Link to="/">
          <Button className="bg-primary text-white dark:bg-primary-foreground ">
            Go back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
