// apps/marketing/src/components/ContactForm.tsx
// General contact form using the lead capture system
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture, LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

export function ContactForm() {
  const { submitLead } = useLeadCapture();
  
  return (
    <LeadCaptureForm
      title="Contact Us"
      description="Have questions or want to learn more? Reach out to our team."
      leadType={LEAD_TYPES.OTHER} // Use the constants for common types
      source="contact_page"
      onSubmit={submitLead}
      successMessage="Thanks for contacting us! We'll get back to you shortly."
      buttonText="Send Message"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={true}
    />
  );
}

// apps/marketing/src/components/MeetingRequestForm.tsx
// Schedule a meeting form
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture, LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

export function MeetingRequestForm() {
  const { submitLead } = useLeadCapture();
  
  // Define custom fields for meeting requests
  const customFields = [
    {
      id: "preferred_date",
      label: "Preferred Date",
      type: "date" as const,
      required: true,
      placeholder: "Select a date",
    },
    {
      id: "preferred_time",
      label: "Preferred Time",
      type: "select" as const,
      required: true,
      options: [
        { label: "Morning (9am - 12pm)", value: "morning" },
        { label: "Afternoon (12pm - 5pm)", value: "afternoon" },
        { label: "Evening (5pm - 8pm)", value: "evening" },
      ],
    },
    {
      id: "meeting_topic",
      label: "Meeting Topic",
      type: "text" as const,
      required: true,
      placeholder: "What would you like to discuss?",
    },
  ];
  
  return (
    <LeadCaptureForm
      title="Schedule a Meeting"
      description="Book a meeting with our team to discuss your needs."
      leadType={LEAD_TYPES.MEETING}
      source="meeting_page"
      onSubmit={submitLead}
      successMessage="We've received your meeting request and will confirm the details soon."
      buttonText="Request Meeting"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={false}
      customFields={customFields}
    />
  );
}

// apps/marketing/src/components/WorkshopRegistrationForm.tsx
// Workshop registration form
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture, LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

export function WorkshopRegistrationForm({ workshopId, workshopName }: { workshopId: string, workshopName: string }) {
  const { submitLead } = useLeadCapture();
  
  // Define custom fields for workshop registration
  const customFields = [
    {
      id: "job_role",
      label: "Job Role",
      type: "text" as const,
      required: true,
      placeholder: "Your position or role",
    },
    {
      id: "experience_level",
      label: "Experience Level",
      type: "select" as const,
      required: true,
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    {
      id: "dietary_requirements",
      label: "Dietary Requirements",
      type: "text" as const,
      required: false,
      placeholder: "Any food allergies or preferences",
    },
  ];
  
  const handleSubmit = async (values: any) => {
    // Add workshop information to the metadata
    return submitLead({
      ...values,
      leadType: LEAD_TYPES.WORKSHOP,
      metadata: {
        ...values.metadata,
        workshopId,
        workshopName,
      },
    });
  };
  
  return (
    <LeadCaptureForm
      title={`Register for ${workshopName}`}
      description="Secure your spot in our upcoming workshop."
      leadType={LEAD_TYPES.WORKSHOP}
      source="workshop_page"
      onSubmit={handleSubmit}
      successMessage="You're registered! We'll send you all the details by email."
      buttonText="Register Now"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={false}
      customFields={customFields}
    />
  );
}

// apps/marketing/src/components/ServiceInquiryForm.tsx
// Service inquiry form
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture, LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

export function ServiceInquiryForm({ service }: { service: string }) {
  const { submitLead } = useLeadCapture();
  
  // Define custom fields for service inquiries
  const customFields = [
    {
      id: "budget_range",
      label: "Budget Range",
      type: "select" as const,
      required: false,
      options: [
        { label: "Under $1,000", value: "under_1k" },
        { label: "$1,000 - $5,000", value: "1k_5k" },
        { label: "$5,000 - $10,000", value: "5k_10k" },
        { label: "Over $10,000", value: "over_10k" },
        { label: "Not sure yet", value: "unknown" },
      ],
    },
    {
      id: "timeline",
      label: "Desired Timeline",
      type: "select" as const,
      required: false,
      options: [
        { label: "As soon as possible", value: "asap" },
        { label: "Within 1 month", value: "1_month" },
        { label: "1-3 months", value: "1_3_months" },
        { label: "3+ months", value: "3plus_months" },
        { label: "No specific timeline", value: "no_timeline" },
      ],
    },
    {
      id: "project_details",
      label: "Project Details",
      type: "textarea" as const,
      required: true,
      placeholder: "Please describe your project or needs in detail",
    },
  ];
  
  const handleSubmit = async (values: any) => {
    // Add service information to the metadata
    return submitLead({
      ...values,
      leadType: LEAD_TYPES.SERVICE,
      metadata: {
        ...values.metadata,
        serviceName: service,
      },
    });
  };
  
  return (
    <LeadCaptureForm
      title={`Inquire About ${service}`}
      description="Tell us about your project, and we'll get back to you with more information."
      leadType={LEAD_TYPES.SERVICE}
      source="services_page"
      onSubmit={handleSubmit}
      successMessage="Thanks for your inquiry! We'll be in touch shortly to discuss your project."
      buttonText="Submit Inquiry"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={false}
      customFields={customFields}
    />
  );
}

// Example of a custom lead type not in the predefined constants
// apps/marketing/src/components/ProductDemoForm.tsx
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture } from "@package/ui/hooks/useLeadCapture";

export function ProductDemoForm({ productId, productName }: { productId: string, productName: string }) {
  const { submitLead } = useLeadCapture();
  
  // Define custom fields for product demos
  const customFields = [
    {
      id: "company_size",
      label: "Company Size",
      type: "select" as const,
      required: true,
      options: [
        { label: "1-10 employees", value: "1-10" },
        { label: "11-50 employees", value: "11-50" },
        { label: "51-200 employees", value: "51-200" },
        { label: "201-1000 employees", value: "201-1000" },
        { label: "1000+ employees", value: "1000+" },
      ],
    },
    {
      id: "preferred_demo_date",
      label: "Preferred Demo Date",
      type: "date" as const,
      required: true,
      placeholder: "Select a date",
    },
  ];
  
  const handleSubmit = async (values: any) => {
    // Use a custom lead type not in the predefined constants
    return submitLead({
      ...values,
      leadType: "product_demo", // Custom lead type
      metadata: {
        ...values.metadata,
        productId,
        productName,
      },
    });
  };
  
  return (
    <LeadCaptureForm
      title={`Request a Demo of ${productName}`}
      description="See our product in action with a personalized demo."
      leadType="product_demo" // Custom lead type as string
      source="product_page"
      onSubmit={handleSubmit}
      successMessage="Your demo request has been received! We'll be in touch to schedule it."
      buttonText="Request Demo"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={false}
      customFields={customFields}
    />
  );
}

// Example of usage in a page
// apps/marketing/src/app/contact/page.tsx
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="text-lg mb-12 text-center">
          We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>
        
        <ContactForm />
      </div>
    </main>
  );
}

// Example of a services page with inquiry form
// apps/marketing/src/app/services/[slug]/page.tsx
import { ServiceInquiryForm } from "@/components/ServiceInquiryForm";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  // In a real app, you would fetch service data based on the slug
  const service = {
    name: "Web Development",
    description: "Custom web development services for businesses of all sizes.",
    // Other service data...
  };
  
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          <p className="text-lg mb-6">{service.description}</p>
          
          {/* Service details content */}
        </div>
        
        <div>
          <ServiceInquiryForm service={service.name} />
        </div>
      </div>
    </main>
  );
}
