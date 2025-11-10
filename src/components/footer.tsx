import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Facebook, Instagram} from "lucide-react";
import { getPrimaryProfile } from "@/lib/data-utils";

const defaultProfile = {
  email: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
};

export function Footer() {
  const [profileData, setProfileData] = useState(defaultProfile);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await getPrimaryProfile();
        if (profile && isMounted) {
          setProfileData({
            email: profile.email,
            socialLinks: {
              github: (profile.social_links.github as string) ?? "",
              linkedin: (profile.social_links.linkedin as string) ?? "",
              twitter: (profile.social_links.twitter as string) ?? "",
              facebook: (profile.social_links.facebook as string) ?? "",
              instagram: (profile.social_links.instagram as string) ?? "",
            },
          });
        }
      } catch (error) {
        console.error("Failed to load footer profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { socialLinks, email } = profileData;

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invictus</h3>
            <p className="text-sm text-muted-foreground">
              Building to solve real world situations.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/certifications"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Certifications
              </Link>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex flex-col space-y-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Invictus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
