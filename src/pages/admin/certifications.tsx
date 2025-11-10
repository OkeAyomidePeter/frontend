import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import {
  buildAssetUrl,
  deleteCertification,
  getCertifications,
  type Certification,
} from "@/lib/data-utils";

export function AdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const data = await getCertifications();
        if (isMounted) {
          setCertifications(data);
        }
      } catch (error) {
        console.error("Unable to load certifications", error);
        if (isMounted) {
          setError("Unable to load certifications");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCertifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    try {
      await deleteCertification(id);
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
    } catch (error) {
      console.error("Failed to delete certification", error);
      alert("Failed to delete certification. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground">Manage your certifications</p>
        </div>
        <Button onClick={() => navigate("/admin/certifications/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Loading certifications...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <Card key={cert.id}>
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                  src={
                    buildAssetUrl(cert.image_path) ??
                    "https://placehold.co/600x400"
                  }
                  alt={cert.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{cert.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {cert.issuer}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(cert.date).toLocaleDateString()}</span>
                </div>
                {cert.credential_id && (
                  <Badge variant="outline" className="text-xs mb-4">
                    ID: {cert.credential_id}
                  </Badge>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/certifications/${cert.id}`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
