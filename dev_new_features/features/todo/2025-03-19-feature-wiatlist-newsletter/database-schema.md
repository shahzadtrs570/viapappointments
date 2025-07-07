// Add these models to your existing Prisma schema

// For newsletter subscribers
model NewsletterSubscriber {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  subscribedAt  DateTime  @default(now())
  isActive      Boolean   @default(true)
  source        String?   // Where they subscribed from
  tags          String[]  // For segmentation
  updatedAt     DateTime  @updatedAt // Add updatedAt for better tracking
  
  @@index([subscribedAt])
  @@index([isActive])
}

// For general lead capture across multiple services
model Lead {
  id            String    @id @default(cuid())
  email         String
  name          String?
  phone         String?
  company       String?
  message       String?   // Free-form message
  leadType      String    // Flexible string for lead type
  status        LeadStatus @default(NEW)
  source        String?   // Where the lead came from
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  metadata      Json?     // Additional fields based on lead type
  assignedTo    String?   // User ID for assigned team member
  
  @@index([leadType])
  @@index([status])
  @@index([createdAt])
  @@index([assignedTo])
  @@index([email]) // Add index for email lookups
}

// Only keep LeadStatus as an enum
enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
}
