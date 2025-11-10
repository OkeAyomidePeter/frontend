import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPrimaryProfile } from "@/lib/data-utils";

const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  location: "",
  skills: [] as string[],
  interests: [] as string[],
};

export function About() {
  const [profileData, setProfileData] = useState(defaultProfile);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await getPrimaryProfile();
        if (profile && isMounted) {
          setProfileData({
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            location: profile.location,
            skills: profile.skills,
            interests: profile.interests,
          });
        }
      } catch (error) {
        console.error("Failed to load about profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { name, title, bio, skills, interests, location } = profileData;

  return (
    <div className="container px-4 py-12 space-y-12 text-center">
      {/* Profile Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
          <p className="text-xl text-muted-foreground">{title}</p>
          {location && <p className="text-muted-foreground">{location}</p>}
        </div>
        <p className="text-lg leading-7">{bio}</p>
      </section>

      <Separator />

      {/* Skills Highlights */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Skills Highlights</h2>
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              Technologies and tools I work with regularly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(skills ?? []).map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-sm py-1.5 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Personal Interests */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Personal Interests
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>What I Enjoy</CardTitle>
            <CardDescription>
              Things I'm passionate about outside of coding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(interests ?? []).map((interest: string) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="text-sm py-1.5 px-3"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
