import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { buildAssetUrl, getPrimaryProfile, uploadCv } from "@/lib/data-utils";

export function AdminCV() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCvPath, setExistingCvPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCv = async () => {
      try {
        const profile = await getPrimaryProfile();
        if (profile && profile.cv_path && isMounted) {
          setExistingCvPath(profile.cv_path);
        }
      } catch (error) {
        console.error("Failed to load CV info", error);
      }
    };

    fetchCv();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }
      setCvFile(file);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setError("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("cv_file", cvFile);
      
      const updatedProfile = await uploadCv(formData);
      
      if (updatedProfile.cv_path) {
        setExistingCvPath(updatedProfile.cv_path);
        setCvFile(null);
        setSuccess(true);
        // Reset file input
        const fileInput = document.getElementById("cv-file") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error) {
      console.error("Failed to upload CV", error);
      setError("Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CV Management</h1>
        <p className="text-muted-foreground">
          Upload or update your CV (PDF only)
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <p>CV uploaded successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload CV</CardTitle>
          <CardDescription>
            Upload a new CV PDF file. This will replace the existing CV if one exists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-file">CV File (PDF only) *</Label>
              <Input
                id="cv-file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              {cvFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <Button type="submit" disabled={isUploading || !cvFile}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload CV"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {existingCvPath && (
        <Card>
          <CardHeader>
            <CardTitle>Current CV</CardTitle>
            <CardDescription>Preview or download the current CV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a
                  href={buildAssetUrl(existingCvPath) ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View CV
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={buildAssetUrl(existingCvPath) ?? ""}
                  download
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </div>
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <iframe
                src={buildAssetUrl(existingCvPath) ?? ""}
                className="w-full h-full"
                title="CV Preview"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

