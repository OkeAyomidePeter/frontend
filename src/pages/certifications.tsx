import { useState, useEffect } from "react";
import { CertificationCard } from "@/components/certification-card";
import { getCertifications, type Certification } from "@/lib/data-utils";

export function Certifications() {
  const [certificationsData, setCertificationsData] = useState<Certification[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const data = await getCertifications();
        if (isMounted) {
          setCertificationsData(data);
        }
      } catch (error) {
        console.error("Failed to load certifications", error);
        if (isMounted) {
          setError("Failed to load certifications");
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

  const sortedCertifications = [...certificationsData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Certifications</h1>
        <p className="text-lg text-muted-foreground">
          Professional certifications and credentials I've earned.
        </p>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedCertifications.map((certification) => (
            <CertificationCard key={certification.id} {...certification} />
          ))}
        </div>
      )}
    </div>
  );
}
