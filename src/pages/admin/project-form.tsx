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
  createProject,
  getProject,
  updateProject,
} from "@/lib/data-utils";

type ProjectFormState = {
  title: string;
  description: string;
  category: string;
  techStackInput: string;
  githubLink: string;
  liveDemoLink: string;
  xLink: string;
};

const defaultState: ProjectFormState = {
  title: "",
  description: "",
  category: "",
  techStackInput: "",
  githubLink: "",
  liveDemoLink: "",
  xLink: "",
};

export function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // isEditing is true only if id exists and is not "new"
  const isEditing = Boolean(id && id !== "new");

  const [formState, setFormState] = useState<ProjectFormState>(defaultState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we're editing an existing item
    if (!isEditing || !id || id === "new") {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const project = await getProject(Number(id));
        if (!isMounted) return;
        setFormState({
          title: project.title,
          description: project.description,
          category: project.category,
          techStackInput: project.tech_stack.join(", "),
          githubLink: project.github_link ?? "",
          liveDemoLink: project.live_demo_link ?? "",
          xLink: project.x_link ?? "",
        });
        setExistingImage(project.preview_image_path ?? null);
      } catch (error) {
        console.error("Unable to load project", error);
        if (isMounted) {
          setError("Unable to load project");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const techStackArray = formState.techStackInput
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "techStackInput") {
      setFormState((prev) => ({ ...prev, techStackInput: value }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
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
    formData.append("description", formState.description);
    formData.append("category", formState.category);
    formData.append("tech_stack", JSON.stringify(techStackArray));
    if (formState.githubLink)
      formData.append("github_link", formState.githubLink);
    if (formState.liveDemoLink)
      formData.append("live_demo_link", formState.liveDemoLink);
    if (formState.xLink) formData.append("x_link", formState.xLink);
    if (imageFile) {
      formData.append("preview_image", imageFile);
    }

    try {
      if (isEditing && id) {
        await updateProject(Number(id), formData);
      } else {
        await createProject(formData);
      }
      navigate("/admin/projects");
    } catch (error) {
      console.error("Failed to save project", error);
      setError("Failed to save project. Please try again.");
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
          onClick={() => navigate("/admin/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update project details"
              : "Add a new project to your portfolio"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the information about your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground">Loading project...</p>
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewImage">
                  Preview Image{" "}
                  {isEditing ? "(upload to replace)" : "(optional)"}
                </Label>
                <Input
                  id="previewImage"
                  name="previewImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {existingImage && !imageFile && (
                  <img
                    src={
                      buildAssetUrl(existingImage) ??
                      "https://placehold.co/400x250"
                    }
                    alt="Current preview"
                    className="h-32 w-48 object-cover rounded-md border"
                  />
                )}
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    You can add an image later by editing this project
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                  placeholder="e.g., Web Development, AI/ML"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">
                  Tech Stack (comma-separated) *
                </Label>
                <Input
                  id="techStack"
                  name="techStackInput"
                  value={formState.techStackInput}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                  id="githubLink"
                  name="githubLink"
                  type="url"
                  value={formState.githubLink}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveDemoLink">Live Demo Link</Label>
                <Input
                  id="liveDemoLink"
                  name="liveDemoLink"
                  type="url"
                  value={formState.liveDemoLink}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xLink">X (Twitter) Link</Label>
                <Input
                  id="xLink"
                  name="xLink"
                  type="url"
                  value={formState.xLink}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update" : "Create"} Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/projects")}
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
