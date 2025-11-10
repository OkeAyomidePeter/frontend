import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, BookOpen, Award, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects, getBlogs, getCertifications } from "@/lib/data-utils";

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    blogs: 0,
    certifications: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [projects, blogs, certs] = await Promise.all([
          getProjects(),
          getBlogs(),
          getCertifications(),
        ]);
        if (isMounted) {
          setCounts({
            projects: projects.length,
            blogs: blogs.length,
            certifications: certs.length,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard counts", error);
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Projects",
      count: counts.projects,
      icon: FolderKanban,
      link: "/admin/projects",
      color: "text-blue-600",
    },
    {
      title: "Blog Posts",
      count: counts.blogs,
      icon: BookOpen,
      link: "/admin/blogs",
      color: "text-green-600",
    },
    {
      title: "Certifications",
      count: counts.certifications,
      icon: Award,
      link: "/admin/certifications",
      color: "text-purple-600",
    },
    {
      title: "Profile",
      count: 1,
      icon: User,
      link: "/admin/profile",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content from here
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground">
                    Total {stat.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
