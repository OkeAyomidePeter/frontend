import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, AlertCircle } from "lucide-react";
import { buildAssetUrl, getCvPath } from "@/lib/data-utils";

export function CV() {
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCv = async () => {
      try {
        setIsLoading(true);
        const data = await getCvPath();
        if (isMounted) {
          setCvPath(data.cv_path);
        }
      } catch (error) {
        console.error("Failed to load CV", error);
        if (isMounted) {
          setError("CV not available");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCv();

    return () => {
      isMounted = false;
    };
  }, []);

  const cvUrl = cvPath ? buildAssetUrl(cvPath) : null;

  if (isLoading) {
    return (
      <div className="container px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading CV...</p>
      </div>
    );
  }

  if (error || !cvUrl) {
    return (
      <div className="container px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              CV Not Available
            </CardTitle>
            <CardDescription>
              The CV is currently not available. Please check back later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Curriculum Vitae</h1>
          <p className="text-muted-foreground mt-2">
            View or download my CV
          </p>
        </div>
        <Button asChild>
          <a
            href={cvUrl}
            download
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[calc(100vh-12rem)]">
            <iframe
              src={cvUrl}
              className="w-full h-full border-0"
              title="CV Preview"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="outline" asChild>
          <a
            href={cvUrl}
            download
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Download CV
          </a>
        </Button>
      </div>
    </div>
  );
}

