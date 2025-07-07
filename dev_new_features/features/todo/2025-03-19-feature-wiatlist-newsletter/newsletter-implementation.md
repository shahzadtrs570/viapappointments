// apps/marketing/src/components/NewsletterSection.tsx
import { NewsletterSignupForm } from "@package/ui/components/newsletter/NewsletterSignupForm";
import { useNewsletterSignup } from "@package/ui/hooks/useNewsletterSignup";

export function NewsletterSection() {
  const { subscribe } = useNewsletterSignup();
  
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <NewsletterSignupForm
            title="Stay Updated"
            description="Subscribe to our newsletter to get the latest updates, news, and special offers."
            onSubmit={subscribe}
            source="marketing_footer"
            tags={["website", "marketing"]}
            showNameField={true}
            buttonText="Subscribe Now"
          />
        </div>
      </div>
    </section>
  );
}

// Usage in a marketing page
// apps/marketing/src/app/page.tsx
import { NewsletterSection } from "@/components/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      {/* Other page content */}
      
      <NewsletterSection />
      
      {/* More page content */}
    </main>
  );
}

// Example of a compact newsletter form in the blog sidebar
// apps/marketing/src/components/BlogSidebar.tsx
import { NewsletterSignupForm } from "@package/ui/components/newsletter/NewsletterSignupForm";
import { useNewsletterSignup } from "@package/ui/hooks/useNewsletterSignup";

export function BlogSidebar() {
  const { subscribe } = useNewsletterSignup();
  
  return (
    <aside className="w-full lg:w-80">
      <div className="sticky top-24">
        <NewsletterSignupForm
          title="Subscribe to our Blog"
          description="Get notified when we publish new articles."
          onSubmit={subscribe}
          source="blog_sidebar"
          tags={["blog", "content"]}
          showNameField={false}
          buttonText="Subscribe"
          className="mb-8"
        />
        
        {/* Other sidebar content */}
      </div>
    </aside>
  );
}

// Example of a pop-up newsletter form
// apps/marketing/src/components/NewsletterPopup.tsx
import { useState, useEffect } from "react";
import { NewsletterSignupForm } from "@package/ui/components/newsletter/NewsletterSignupForm";
import { useNewsletterSignup } from "@package/ui/hooks/useNewsletterSignup";
import { X } from "lucide-react";
import { Button } from "@package/ui/components/ui/button";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { subscribe, success } = useNewsletterSignup();
  
  // Show popup after 30 seconds
  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenNewsletterPopup");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Close popup and remember the user's choice
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenNewsletterPopup", "true");
  };
  
  // After successful subscription, close popup and remember
  useEffect(() => {
    if (success) {
      handleClose();
    }
  }, [success]);
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-6">
          <NewsletterSignupForm
            title="Join Our Newsletter"
            description="Subscribe for exclusive content, tips, and updates delivered straight to your inbox."
            onSubmit={subscribe}
            source="popup"
            tags={["popup", "marketing"]}
            showNameField={true}
            buttonText="Subscribe"
          />
        </div>
      </div>
    </div>
  );
}
