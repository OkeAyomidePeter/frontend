import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  SendHorizontal,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { getPrimaryProfile } from "@/lib/data-utils";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as
  | string
  | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
  | string
  | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as
  | string
  | undefined;

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

export function Contact() {
  const [profileData, setProfileData] = useState(defaultProfile);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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
        console.error("Failed to load contact profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const faqs = [
    {
      q: "What kind of projects do you work on?",
      a: "I build full-stack, AI/ML, Web3, and Rust-based systems—practical, scalable solutions for real problems.",
    },
    {
      q: "How can we collaborate?",
      a: "I'm open to working with innovators, startups, or teams tackling tough problems. Hit me up with your idea and we’ll see how to team up.",
    },
    {
      q: "Do you take on client work?",
      a: "Yes, I help clients with software, AI/ML, Web3, or scalable product development—tailored to your goals.",
    },
    {
      q: "What do you look for in a partner?",
      a: "Purpose-driven projects, clear communication, and impact. I like working with curious, goal-oriented people.",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus("idle");
    setFeedbackMessage(null);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setSubmitStatus("error");
      setFeedbackMessage(
        "Contact service is not configured. Please reach out via email."
      );
      setIsSending(false);
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
          sender_email: formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus("success");
      setFeedbackMessage(
        "Message sent successfully! We'll get back to you soon."
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again or use email directly.";
      setFeedbackMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-2">
          We'd love to hear from you. Reach out with questions, feedback, or
          support needs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
            {submitStatus === "success" && feedbackMessage && (
              <p className="text-sm text-green-600">{feedbackMessage}</p>
            )}
            {submitStatus === "error" && feedbackMessage && (
              <p className="text-sm text-red-600">{feedbackMessage}</p>
            )}
            <Button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 w-full"
            >
              <SendHorizontal className="w-4 h-4" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 className="font-medium">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
                {idx < faqs.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-3">Connect with us</p>
        <div className="flex justify-center gap-6">
          {profileData.socialLinks.github && (
            <a
              href={profileData.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {profileData.socialLinks.linkedin && (
            <a
              href={profileData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-blue-900"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {profileData.socialLinks.twitter && (
            <a
              href={profileData.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-blue-600"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          <a
            href={`mailto:${profileData.email}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          {profileData.socialLinks.facebook && (
            <a
              href={profileData.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {profileData.socialLinks.instagram && (
            <a
              href={profileData.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
