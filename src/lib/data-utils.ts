export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail_path: string | null;
  date: string;
  tags: string[];
  read_time: string;
  author: string;
  likes: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  preview_image_path: string | null;
  tech_stack: string[];
  category: string;
  github_link?: string | null;
  live_demo_link?: string | null;
  x_link?: string | null;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image_path: string | null;
  verification_link?: string | null;
  credential_id?: string | null;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  social_links: Record<string, unknown>;
  skills: string[];
  stacks: Record<string, unknown>[];
  interests: string[];
  what_i_work_on: string;
  cv_path?: string | null;
}

export interface ApiError extends Error {
  status?: number;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://portfolio-e3ns.onrender.com";

function buildUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function ensureStaticPath(path: string): string {
  const trimmed = path.replace(/^\/+/, "");
  if (trimmed.startsWith("static/")) {
    return trimmed;
  }
  return `static/${trimmed}`;
}

export function buildAssetUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  return buildUrl(`/${ensureStaticPath(path)}`);
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const error: ApiError = new Error("Request failed");
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// Auth
export async function login(password: string): Promise<void> {
  await apiRequest("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
}

export async function logout(): Promise<void> {
  await apiRequest("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Blogs
export async function getBlogs(): Promise<Blog[]> {
  return apiRequest<Blog[]>("/blogs");
}

export async function getBlog(id: number): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}`);
}

export async function createBlog(formData: FormData): Promise<Blog> {
  return apiRequest<Blog>("/blogs", {
    method: "POST",
    body: formData,
  });
}

export async function updateBlog(
  id: number,
  formData: FormData
): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteBlog(id: number): Promise<void> {
  await apiRequest<void>(`/blogs/${id}`, { method: "DELETE" });
}

export async function likeBlog(id: number): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/like`, {
    method: "POST",
  });
}

// Projects
export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/projects");
}

export async function getProject(id: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`);
}

export async function createProject(formData: FormData): Promise<Project> {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: formData,
  });
}

export async function updateProject(
  id: number,
  formData: FormData
): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteProject(id: number): Promise<void> {
  await apiRequest<void>(`/projects/${id}`, { method: "DELETE" });
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  return apiRequest<Certification[]>("/certs");
}

export async function getCertification(id: number): Promise<Certification> {
  return apiRequest<Certification>(`/certs/${id}`);
}

export async function createCertification(
  formData: FormData
): Promise<Certification> {
  return apiRequest<Certification>("/certs", {
    method: "POST",
    body: formData,
  });
}

export async function updateCertification(
  id: number,
  formData: FormData
): Promise<Certification> {
  return apiRequest<Certification>(`/certs/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteCertification(id: number): Promise<void> {
  await apiRequest<void>(`/certs/${id}`, { method: "DELETE" });
}

// Profiles
export async function getProfiles(): Promise<Profile[]> {
  return apiRequest<Profile[]>("/profiles");
}

export async function getProfile(id: number): Promise<Profile> {
  return apiRequest<Profile>(`/profiles/${id}`);
}

export async function createProfile(
  data: Omit<Profile, "id">
): Promise<Profile> {
  return apiRequest<Profile>("/profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateProfile(
  id: number,
  data: Omit<Profile, "id">
): Promise<Profile> {
  return apiRequest<Profile>(`/profiles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(id: number): Promise<void> {
  await apiRequest<void>(`/profiles/${id}`, { method: "DELETE" });
}

export async function getPrimaryProfile(): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.length > 0 ? profiles[0] : null;
}

// CV
export async function getCvPath(): Promise<{ cv_path: string }> {
  return apiRequest<{ cv_path: string }>("/profiles/cv/path");
}

export async function uploadCv(formData: FormData): Promise<Profile> {
  return apiRequest<Profile>("/profiles/cv/upload", {
    method: "POST",
    body: formData,
  });
}
