import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  createBlog,
  getBlog,
  updateBlog,
} from "@/lib/data-utils";

type BlogFormState = {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tagsInput: string;
  readTime: string;
  author: string;
  likes: string;
};

const defaultState: BlogFormState = {
  title: "",
  excerpt: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  tagsInput: "",
  readTime: "5 min",
  author: "",
  likes: "0",
};

export function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // isEditing is true only if id exists and is not "new"
  const isEditing = Boolean(id && id !== "new");

  const [formState, setFormState] = useState<BlogFormState>(defaultState);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );
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

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blog = await getBlog(Number(id));
        if (!isMounted) return;
        setFormState({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          date: blog.date,
          tagsInput: blog.tags.join(", "),
          readTime: blog.read_time,
          author: blog.author,
          likes: String(blog.likes ?? 0),
        });
        setExistingThumbnail(blog.thumbnail_path ?? null);
      } catch (error) {
        console.error("Unable to load blog post", error);
        if (isMounted) {
          setError("Unable to load blog post");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (value: string) => {
    setFormState((prev) => ({ ...prev, tagsInput: value }));
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setThumbnailFile(file);
  };

  const tagsArray = formState.tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("excerpt", formState.excerpt);
    formData.append("content", formState.content);
    formData.append("date", formState.date);
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("read_time", formState.readTime);
    formData.append("author", formState.author);
    formData.append("likes", formState.likes);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      if (isEditing && id) {
        await updateBlog(Number(id), formData);
      } else {
        await createBlog(formData);
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Failed to save blog post", error);
      setError("Failed to save blog post. Please try again.");
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
          onClick={() => navigate("/admin/blogs")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update blog post details" : "Create a new blog post"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Fill in the information about your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground">Loading post...</p>
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
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formState.excerpt}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  rows={15}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Supports markdown-like syntax: ## for headings, - for lists,
                  [video:youtube:ID] for videos, [image:URL] for images
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">
                  Thumbnail Image{" "}
                  {isEditing ? "(upload to replace)" : "(optional)"}
                </Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
                {existingThumbnail && !thumbnailFile && (
                  <img
                    src={
                      buildAssetUrl(existingThumbnail) ??
                      "https://placehold.co/800x600"
                    }
                    alt="Current thumbnail"
                    className="h-32 w-48 object-cover rounded-md border"
                  />
                )}
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    You can add a thumbnail later by editing this post
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="readTime">Read Time *</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formState.readTime}
                    onChange={handleChange}
                    placeholder="e.g., 5 min"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formState.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated) *</Label>
                <Input
                  id="tags"
                  value={formState.tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g., React, Web Development, Tutorial"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="likes">Initial Likes</Label>
                <Input
                  id="likes"
                  name="likes"
                  type="number"
                  min="0"
                  value={formState.likes}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update" : "Create"} Post
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/blogs")}
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
