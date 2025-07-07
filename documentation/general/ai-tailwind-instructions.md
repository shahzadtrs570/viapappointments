# Instructions for AI Implementation of Tailwind Styles

## Key Instructions for the AI

When implementing my website content using NextJet's Tailwind system, please follow these guidelines:

1. **Use Theme Variables, Not Hardcoded Colors**
   ```jsx
   // CORRECT: Use theme-aware classes that reference CSS variables
   <div className="bg-background text-foreground hover:bg-secondary/10">
     <h1 className="text-primary font-bold">Heading</h1>
   </div>
   
   // INCORRECT: Avoid hardcoded colors
   <div className="bg-white text-gray-900 hover:bg-gray-100">
     <h1 className="text-blue-600 font-bold">Heading</h1>
   </div>
   ```

2. **Include Dark Mode Variants**
   ```jsx
   // Always include dark mode variants for color-related classes
   <div className="bg-white dark:bg-slate-900 text-black dark:text-white">
     <button className="bg-primary dark:bg-primary/80">
       Button
     </button>
   </div>
   ```

3. **Use ShadCN UI Components When Possible**
   ```jsx
   // Leverage existing components that already use the theme
   import { Button } from "@package/ui/button";
   import { Card } from "@package/ui/card";
   
   function MySection() {
     return (
       <Card>
         <Button variant="default">Primary Action</Button>
         <Button variant="outline">Secondary Action</Button>
       </Card>
     );
   }
   ```

4. **Follow the Class Order Pattern**
   ```jsx
   // Follow this ordering of Tailwind classes for consistency:
   <div className="
     // Layout (display, position, width, height)
     flex flex-col items-center justify-between
     // Spacing (margin, padding)
     p-6 my-8
     // Typography (text, font)
     text-lg font-medium
     // Visual (bg, text colors, borders)
     bg-card text-card-foreground border border-border
     // Effects (shadows, opacity)
     shadow-sm opacity-90
     // Interactive states (hover, focus)
     hover:bg-muted focus:ring-2
     // Responsive variants (last)
     md:flex-row lg:p-8
   ">
     Content
   </div>
   ```

5. **Use the Container Component for Layout**
   ```jsx
   import { Container } from "@package/ui/container";
   
   function Section() {
     return (
       <Container>
         <h2 className="text-2xl font-bold">Section Title</h2>
         {/* Content */}
       </Container>
     );
   }
   ```

6. **Use NextJet's Spacing Scale**
   ```jsx
   // Use consistent spacing from the theme
   <div className="space-y-4">  {/* Vertical spacing between children */}
     <div className="p-4">      {/* Padding on all sides */}
     <div className="mx-auto">  {/* Horizontal centering */}
     <div className="mt-8 mb-4"> {/* Margin top/bottom */}
   </div>
   ```

7. **Use Semantic Size Classes**
   ```jsx
   // For typography:
   <h1 className="text-4xl font-bold">  {/* Extra large heading */}
   <h2 className="text-3xl font-semibold">  {/* Large heading */}
   <h3 className="text-2xl font-medium">  {/* Medium heading */}
   <p className="text-base">  {/* Regular paragraph text */}
   <span className="text-sm text-muted-foreground">  {/* Small, muted text */}
   ```

8. **Reference Components from the Right Locations**
   ```jsx
   // ShadCN UI components from the UI package
   import { Button } from "@package/ui/button";
   
   // Marketing-specific components
  import { HeroSection } from "./_components/HeroSection/HeroSection"
   
   // logo from lucide-react
   import { Logo } from "lucide-react";
   ```

## When Creating New Components

When implementing new components for my marketing site content:

1. Create them in the appropriate directory structure:
   - `apps\marketing\src\app` for major page sections
   - `apps\marketing\src\app\(landing)\_components` for marketing-specific UI components


2. Use component composition pattern:
   ```jsx
   // Breaking down complex sections into smaller components
   function FeatureSection() {
     return (
       <section className="py-16 bg-background">
         <Container>
           <SectionHeading>Features</SectionHeading>
           <div className="grid md:grid-cols-3 gap-8 mt-12">
             <FeatureCard
               icon={<Icon1 />}
               title="Feature 1"
               description="Description here"
             />
             {/* More feature cards */}
           </div>
         </Container>
       </section>
     );
   }
   ```
