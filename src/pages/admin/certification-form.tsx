import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, Save } from "lucide-react";
import {
  buildAssetUrl,
  createCertification,
  getCertification,
  updateCertification,
} from "@/lib/data-utils";

type CertificationFormState = {
  title: string;
  issuer: string;
  date: string;
  verificationLink: string;
  credentialId: string;
};

const defaultState: CertificationFormState = {
  title: "",
  issuer: "",
  date: new Date().toISOString().split("T")[0],
  verificationLink: "",
  credentialId: "",
};

export function CertificationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // isEditing is true only if id exists and is not "new"
  const isEditing = Boolean(id && id !== "new");

  const [formState, setFormState] =
    useState<CertificationFormState>(defaultState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we're editing an existing item
    if (!isEditing || !id || id === "new") {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCertification = async () => {
      try {
        setLoading(true);
        const cert = await getCertification(Number(id));
        if (!isMounted) return;
        setFormState({
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          verificationLink: cert.verification_link ?? "",
          credentialId: cert.credential_id ?? "",
        });
        setExistingImage(cert.image_path ?? null);
      } catch (error) {
        console.error("Unable to load certification", error);
        if (isMounted) {
          setError("Unable to load certification");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCertification();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("issuer", formState.issuer);
    formData.append("date", formState.date);
    if (formState.verificationLink) {
      formData.append("verification_link", formState.verificationLink);
    }
    if (formState.credentialId) {
      formData.append("credential_id", formState.credentialId);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEditing && id) {
        await updateCertification(Number(id), formData);
      } else {
        await createCertification(formData);
      }
      navigate("/admin/certifications");
    } catch (error) {
      console.error("Failed to save certification", error);
      setError("Failed to save certification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/certifications")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Certification" : "New Certification"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update certification details"
              : "Add a new certification"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certification Details</CardTitle>
          <CardDescription>
            Fill in the information about your certification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground">Loading certification...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formState.issuer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formState.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">
                  Certificate Image{" "}
                  {isEditing ? "(upload to replace)" : "(optional)"}
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {existingImage && !imageFile && (
                  <img
                    src={
                      buildAssetUrl(existingImage) ??
                      "https://placehold.co/600x400"
                    }
                    alt="Current certificate"
                    className="h-32 w-48 object-cover rounded-md border"
                  />
                )}
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    You can add a certificate image later by editing this entry
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationLink">Verification Link</Label>
                <Input
                  id="verificationLink"
                  name="verificationLink"
                  type="url"
                  value={formState.verificationLink}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  name="credentialId"
                  value={formState.credentialId}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update" : "Create"} Certification
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/certifications")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
