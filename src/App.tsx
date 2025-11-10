import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin-layout";
import { Home } from "@/pages/home";
import { Projects } from "@/pages/projects";
import { Blog } from "@/pages/blog";
import { BlogPost } from "@/pages/blog-post";
import { Certifications } from "@/pages/certifications";
import { About } from "@/pages/about";
import { Contact } from "@/pages/contact";
import { CV } from "@/pages/cv";
import NotFoundPage from "@/pages/notfound";
import { AdminLogin } from "@/pages/admin/login";
import { AdminDashboard } from "@/pages/admin/dashboard";
import { AdminProjects } from "@/pages/admin/projects";
import { ProjectForm } from "@/pages/admin/project-form";
import { AdminBlogs } from "@/pages/admin/blogs";
import { BlogForm } from "@/pages/admin/blog-form";
import { AdminCertifications } from "@/pages/admin/certifications";
import { CertificationForm } from "@/pages/admin/certification-form";
import { AdminProfile } from "@/pages/admin/profile";
import { AdminCV } from "@/pages/admin/cv";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cv" element={<CV />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectForm />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/:id" element={<BlogForm />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="certifications/new" element={<CertificationForm />} />
            <Route path="certifications/:id" element={<CertificationForm />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="cv" element={<AdminCV />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
