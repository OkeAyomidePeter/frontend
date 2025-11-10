import { useState, useEffect } from "react";
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
import { Save, Plus, Trash2 } from "lucide-react";
import {
  createProfile,
  getProfiles,
  updateProfile,
  type Profile,
} from "@/lib/data-utils";

interface ProfileFormState {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    facebook: string;
    instagram: string;
  };
  skills: string[];
  stacks: Array<{
    name: string;
    technologies: string[];
  }>;
  interests: string[];
  whatIWorkOn: string;
}

export function AdminProfile() {
  const [profileId, setProfileId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProfileFormState | null>(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [stackTechInputs, setStackTechInputs] = useState<
    Record<number, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profiles = await getProfiles();
        if (profiles.length > 0) {
          const profile = profiles[0];
          setProfileId(profile.id);
          const stackCollection = Array.isArray(profile.stacks)
            ? profile.stacks.map((stack) => ({
                name: typeof stack?.name === "string" ? stack.name : "",
                technologies: Array.isArray(stack?.technologies)
                  ? stack.technologies.map((tech: unknown) => String(tech))
                  : [],
              }))
            : [];
          const mappedProfile: ProfileFormState = {
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            email: profile.email,
            location: profile.location,
            socialLinks: {
              github: (profile.social_links.github as string) ?? "",
              linkedin: (profile.social_links.linkedin as string) ?? "",
              twitter: (profile.social_links.twitter as string) ?? "",
              portfolio: (profile.social_links.portfolio as string) ?? "",
              facebook: (profile.social_links.facebook as string) ?? "",
              instagram: (profile.social_links.instagram as string) ?? "",
            },
            skills: Array.isArray(profile.skills)
              ? profile.skills.map((skill: unknown) => String(skill))
              : [],
            stacks:
              stackCollection.length > 0
                ? stackCollection
                : [{ name: "", technologies: [] }],
            interests: Array.isArray(profile.interests)
              ? profile.interests.map((interest: unknown) => String(interest))
              : [],
            whatIWorkOn: profile.what_i_work_on ?? "",
          };
          setFormData(mappedProfile);
          setSkillsInput(mappedProfile.skills.join(", "));
          setInterestsInput(mappedProfile.interests.join(", "));
          // Initialize stack tech inputs
          const techInputs: Record<number, string> = {};
          mappedProfile.stacks.forEach((stack, index) => {
            techInputs[index] = stack.technologies.join(", ");
          });
          setStackTechInputs(techInputs);
        } else {
          const defaultProfile: ProfileFormState = {
            name: "",
            title: "",
            bio: "",
            email: "",
            location: "",
            socialLinks: {
              github: "",
              linkedin: "",
              twitter: "",
              portfolio: "",
              facebook: "",
              instagram: "",
            },
            skills: [],
            stacks: [
              {
                name: "",
                technologies: [],
              },
            ],
            interests: [],
            whatIWorkOn: "",
          };
          setFormData(defaultProfile);
          setStackTechInputs({ 0: "" });
        }
      } catch (error) {
        console.error("Unable to load profile data", error);
        setError("Unable to load profile data");
      }
    };

    fetchProfile();
  }, []);

  if (!formData) {
    return <div>Loading profile...</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [key]: value,
      },
    });
  };

  const handleStackChange = (index: number, field: string, value: string) => {
    const updatedStacks = [...formData.stacks];
    if (field === "name") {
      updatedStacks[index].name = value;
      setFormData({ ...formData, stacks: updatedStacks });
    } else if (field === "technologies") {
      // Update raw input value
      setStackTechInputs({ ...stackTechInputs, [index]: value });
      // Update actual technologies array (parse on change)
      updatedStacks[index].technologies = value
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);
      setFormData({ ...formData, stacks: updatedStacks });
    }
  };

  const handleAddStack = () => {
    const newIndex = formData!.stacks.length;
    setFormData({
      ...formData!,
      stacks: [...formData!.stacks, { name: "", technologies: [] }],
    });
    setStackTechInputs({ ...stackTechInputs, [newIndex]: "" });
  };

  const handleRemoveStack = (index: number) => {
    if (formData!.stacks.length > 1) {
      const updatedStacks = formData!.stacks.filter((_, i) => i !== index);
      setFormData({ ...formData!, stacks: updatedStacks });
      // Rebuild stack tech inputs with updated indices
      const newTechInputs: Record<number, string> = {};
      updatedStacks.forEach((stack, i) => {
        newTechInputs[i] = stack.technologies.join(", ");
      });
      setStackTechInputs(newTechInputs);
    }
  };

  const handleSkillsChange = (value: string) => {
    setSkillsInput(value);
    const skills = value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    setFormData({ ...formData, skills });
  };

  const handleInterestsChange = (value: string) => {
    setInterestsInput(value);
    const interests = value
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0);
    setFormData({ ...formData, interests });
  };

  const toApiPayload = (state: ProfileFormState): Omit<Profile, "id"> => ({
    name: state.name,
    title: state.title,
    bio: state.bio,
    email: state.email,
    location: state.location,
    social_links: state.socialLinks,
    skills: state.skills,
    stacks: state.stacks,
    interests: state.interests,
    what_i_work_on: state.whatIWorkOn,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    const payload = toApiPayload(formData);

    try {
      if (profileId !== null) {
        await updateProfile(profileId, payload);
      } else {
        const created = await createProfile(payload);
        setProfileId(created.id);
      }
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Update your profile information</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) =>
                  handleSocialLinkChange("github", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) =>
                  handleSocialLinkChange("linkedin", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  handleSocialLinkChange("twitter", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.socialLinks.portfolio}
                onChange={(e) =>
                  handleSocialLinkChange("portfolio", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  handleSocialLinkChange("facebook", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  handleSocialLinkChange("instagram", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Interests</CardTitle>
            <CardDescription>
              Your technical skills and personal interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated) *</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma-separated) *</Label>
              <Input
                id="interests"
                value={interestsInput}
                onChange={(e) => handleInterestsChange(e.target.value)}
                placeholder="e.g., Open Source, Machine Learning, Photography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatIWorkOn">What I Work On *</Label>
              <Textarea
                id="whatIWorkOn"
                name="whatIWorkOn"
                value={formData.whatIWorkOn}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Stacks</CardTitle>
            <CardDescription>
              Organize your technologies by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.stacks.map((stack, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">
                    Stack {index + 1}
                  </Label>
                  {formData.stacks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStack(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Stack Name *</Label>
                  <Input
                    value={stack.name}
                    onChange={(e) =>
                      handleStackChange(index, "name", e.target.value)
                    }
                    placeholder="e.g., Frontend, Backend, Mobile"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies (comma-separated) *</Label>
                  <Input
                    value={stackTechInputs[index] ?? ""}
                    onChange={(e) =>
                      handleStackChange(index, "technologies", e.target.value)
                    }
                    placeholder="e.g., React, Next.js, TypeScript"
                    required
                  />
                  {stack.technologies.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {stack.technologies.length} technology
                      {stack.technologies.length !== 1 ? "ies" : ""} added
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddStack}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tech Stack
            </Button>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </form>
    </div>
  );
}
