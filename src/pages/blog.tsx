import { useState, useEffect } from "react";
import { BlogPostCard } from "@/components/blog-post-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getBlogs, type Blog as BlogType } from "@/lib/data-utils";

export function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await getBlogs();
        if (isMounted) {
          setBlogData(data);
        }
      } catch (error) {
        console.error("Failed to load blog posts", error);
        if (isMounted) {
          setError("Failed to load blog posts");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = Array.from(
    new Set(
      blogData.flatMap((post) => (Array.isArray(post.tags) ? post.tags : []))
    )
  ).sort();

  const filteredPosts = blogData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(post.tags) ? post.tags : []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTag =
      selectedTag === null ||
      (Array.isArray(post.tags) && post.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="container px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, tutorials, and insights on web development and technology.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search posts by title, content, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            All Posts
          </Badge>
          {allTags.map((tag: string) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
