import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfiles } from "@/lib/data-utils";

const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  email: "",
  location: "",
  social_links: {},
  skills: [] as string[],
  stacks: [] as Array<{ name: string; technologies: string[] }>,
  interests: [] as string[],
  what_i_work_on: "",
};

export function Home() {
  const [profileData, setProfileData] =
    useState<typeof defaultProfile>(defaultProfile);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profiles = await getProfiles();
        if (!isMounted) return;
        if (profiles.length > 0) {
          const rawProfile = profiles[0];
          setProfileData({
            ...defaultProfile,
            ...rawProfile,
            stacks: Array.isArray(rawProfile.stacks)
              ? rawProfile.stacks.map((stack: any) => ({
                  name: typeof stack?.name === "string" ? stack.name : "",
                  technologies: Array.isArray(stack?.technologies)
                    ? stack.technologies.map((tech: unknown) => String(tech))
                    : [],
                }))
              : [],
          });
        }
      } catch (error) {
        console.error("Failed to load home profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { name, title, skills, stacks, what_i_work_on } = profileData;
  const normalizedStacks = Array.isArray(stacks)
    ? stacks.map((stack) => ({
        name: typeof stack?.name === "string" ? stack.name : "",
        technologies: Array.isArray(stack?.technologies)
          ? stack.technologies.map((tech: unknown) => String(tech))
          : [],
      }))
    : [];

  return (
    <div className="container px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {name}
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">{title}</p>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          I'm Oke Ayomide Peter[Invictus], a software engineer focused on
          designing both simple and complex systems that solve real-world
          problems. I work with modern technologies across AI/ML and web3, and I
          care about building solutions that are scalable, reliable, and
          practical in production environments.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-colors dark:bg-primary dark:text-primary-foreground"
          >
            <Link to="/projects">My Work</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-black text-black bg-background/70 backdrop-blur dark:border-white dark:text-white dark:bg-background/40"
          >
            <Link to="/blog">My Blog</Link>
          </Button>
        </div>
      </section>

      {/* What I Work On */}
      <section className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">What I Work On</h2>
        <p className="text-lg text-muted-foreground ">{what_i_work_on}</p>
      </section>

      {/* Tech Stacks */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Tech Stacks
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {normalizedStacks.map((stack, index) => (
            <Card key={`${stack.name ?? "stack"}-${index}`}>
              <CardHeader>
                <CardTitle>{stack.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {(skills ?? []).map((skill: string) => (
            <Badge
              key={skill}
              variant="outline"
              className="text-sm py-1.5 px-3"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
