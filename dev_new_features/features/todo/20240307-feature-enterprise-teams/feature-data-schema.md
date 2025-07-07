# Enterprise Teams Data Schema

## 1. Core Database Models

### 1.1 Team Model

The Team model represents a collaborative group within the platform.

```prisma
model Team {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String?
  logoUrl     String?
  ownerId     String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relationships
  owner       User        @relation("TeamOwner", fields: [ownerId], references: [id], onDelete: Restrict)
  members     TeamMember[]
  resources   TeamResource[]
  settings    TeamSettings?
  invitations TeamInvitation[]
  subscription TeamSubscription?

  @@index([ownerId])
  @@index([slug])
}
```

**Key Fields:**
- `id`: Unique identifier for the team
- `name`: Display name of the team
- `slug`: URL-friendly unique identifier used for routing
- `description`: Optional description of the team's purpose
- `logoUrl`: Optional URL to team's logo image
- `ownerId`: Reference to the user who owns the team
- `createdAt`: Timestamp of team creation
- `updatedAt`: Timestamp of last team update

**Relationships:**
- One-to-many with TeamMember (team has many members)
- Many-to-one with User (team has one owner)
- One-to-many with TeamResource (team has many resources)
- One-to-one with TeamSettings (team has one settings record)
- One-to-many with TeamInvitation (team has many invitations)
- One-to-one with TeamSubscription (team has one subscription)

**Indexes:**
- Index on `ownerId` to optimize queries for teams owned by a user
- Index on `slug` to optimize lookups by URL

### 1.2 TeamMember Model

The TeamMember model represents a user's membership in a team, including their role.

```prisma
model TeamMember {
  id        String    @id @default(cuid())
  teamId    String
  userId    String
  role      TeamRole  @default(MEMBER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relationships
  team      Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
}

enum TeamRole {
  OWNER
  ADMIN
  MEMBER
}
```

**Key Fields:**
- `id`: Unique identifier for the team membership
- `teamId`: Reference to the team
- `userId`: Reference to the user
- `role`: Enum representing the user's role in the team
- `createdAt`: Timestamp of when the user joined the team
- `updatedAt`: Timestamp of last membership update

**Relationships:**
- Many-to-one with Team (many members belong to one team)
- Many-to-one with User (many memberships can belong to one user)

**Constraints:**
- Unique constraint on `[teamId, userId]` to prevent duplicate memberships
- Cascade deletion when team is deleted
- Cascade deletion when user is deleted

**Indexes:**
- Index on `teamId` to optimize queries for team members
- Index on `userId` to optimize queries for user's team memberships

### 1.3 User Model Extensions

Extensions to the existing User model to support team functionality.

```prisma
model User {
  // Existing fields...
  
  // Team-related relationships
  teamMembers   TeamMember[]
  ownedTeams    Team[]       @relation("TeamOwner")
  teamInvitations TeamInvitation[]
}
```

**New Relationships:**
- One-to-many with TeamMember (user can be member of many teams)
- One-to-many with Team as "TeamOwner" (user can own many teams)
- One-to-many with TeamInvitation (user can have many invitations)

## 2. Supporting Models

### 2.1 TeamInvitation Model

The TeamInvitation model represents pending invitations to join a team.

```prisma
model TeamInvitation {
  id           String     @id @default(cuid())
  teamId       String
  email        String
  role         TeamRole   @default(MEMBER)
  token        String     @unique
  inviterId    String
  message      String?
  createdAt    DateTime   @default(now())
  expiresAt    DateTime
  status       InvitationStatus @default(PENDING)

  // Relationships
  team         Team       @relation(fields: [teamId], references: [id], onDelete: Cascade)
  inviter      User       @relation(fields: [inviterId], references: [id], onDelete: Cascade)

  @@unique([teamId, email])
  @@index([teamId])
  @@index([token])
  @@index([email])
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
}
```

**Key Fields:**
- `id`: Unique identifier for the invitation
- `teamId`: Reference to the team
- `email`: Email address of the invited user
- `role`: Proposed role for the invited user
- `token`: Unique token for secure invitation link
- `inviterId`: Reference to the user who created the invitation
- `message`: Optional personalized message
- `createdAt`: Timestamp of invitation creation
- `expiresAt`: Timestamp when the invitation expires
- `status`: Current status of the invitation

**Relationships:**
- Many-to-one with Team (many invitations from one team)
- Many-to-one with User as inviter (many invitations from one user)

**Constraints:**
- Unique constraint on `[teamId, email]` to prevent duplicate invitations
- Cascade deletion when team is deleted
- Cascade deletion when inviter is deleted

**Indexes:**
- Index on `teamId` to optimize queries for team invitations
- Index on `token` to optimize lookups by invitation token
- Index on `email` to optimize lookups by recipient email

### 2.2 TeamSettings Model

The TeamSettings model stores configuration options for a team.

```prisma
model TeamSettings {
  id                   String    @id @default(cuid())
  teamId               String    @unique
  defaultResourceAccess AccessLevel @default(TEAM)
  allowMemberInvites   Boolean   @default(false)
  allowResourceCreation Boolean   @default(true)
  customThemeColor     String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  // Relationships
  team                 Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
}

enum AccessLevel {
  PRIVATE
  TEAM
  PUBLIC
}
```

**Key Fields:**
- `id`: Unique identifier for the settings record
- `teamId`: Reference to the team
- `defaultResourceAccess`: Default access level for new resources
- `allowMemberInvites`: Whether non-admin members can invite others
- `allowResourceCreation`: Whether non-admin members can create resources
- `customThemeColor`: Optional custom theme color for team branding
- `createdAt`: Timestamp of settings creation
- `updatedAt`: Timestamp of last settings update

**Relationships:**
- One-to-one with Team (settings belong to one team)

**Constraints:**
- Unique constraint on `teamId` to ensure one settings record per team
- Cascade deletion when team is deleted

### 2.3 TeamResource Model

The TeamResource model represents resources associated with a team.

```prisma
model TeamResource {
  id           String      @id @default(cuid())
  teamId       String
  name         String
  type         ResourceType
  accessLevel  AccessLevel @default(TEAM)
  creatorId    String
  content      Json?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relationships
  team         Team        @relation(fields: [teamId], references: [id], onDelete: Cascade)
  creator      User        @relation(fields: [creatorId], references: [id], onDelete: Restrict)

  @@index([teamId])
  @@index([creatorId])
  @@index([type])
}

enum ResourceType {
  DOCUMENT
  FOLDER
  TEMPLATE
  MEDIA
  OTHER
}
```

**Key Fields:**
- `id`: Unique identifier for the resource
- `teamId`: Reference to the team
- `name`: Display name of the resource
- `type`: Type of resource
- `accessLevel`: Access level controlling who can view the resource
- `creatorId`: Reference to the user who created the resource
- `content`: JSON field storing resource data (structure depends on resource type)
- `createdAt`: Timestamp of resource creation
- `updatedAt`: Timestamp of last resource update

**Relationships:**
- Many-to-one with Team (many resources belong to one team)
- Many-to-one with User as creator (many resources created by one user)

**Constraints:**
- Cascade deletion when team is deleted
- Restrict deletion of creator (prevent orphaned resources)

**Indexes:**
- Index on `teamId` to optimize queries for team resources
- Index on `creatorId` to optimize queries for user-created resources
- Index on `type` to optimize queries by resource type

### 2.4 TeamSubscription Model

The TeamSubscription model tracks billing and subscription information for teams.

```prisma
model TeamSubscription {
  id              String           @id @default(cuid())
  teamId          String           @unique
  plan            SubscriptionPlan @default(FREE)
  status          SubscriptionStatus @default(ACTIVE)
  seatLimit       Int              @default(5)
  usedSeats       Int              @default(1)
  customerId      String?          // External payment provider customer ID
  subscriptionId  String?          // External payment provider subscription ID
  trialEndsAt     DateTime?
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  // Relationships
  team            Team             @relation(fields: [teamId], references: [id], onDelete: Cascade)
}

enum SubscriptionPlan {
  FREE
  PRO
  BUSINESS
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  TRIALING
  CANCELED
  UNPAID
}
```

**Key Fields:**
- `id`: Unique identifier for the subscription
- `teamId`: Reference to the team
- `plan`: Current subscription plan
- `status`: Current subscription status
- `seatLimit`: Maximum number of team members allowed
- `usedSeats`: Current number of team members
- `customerId`: External payment provider customer ID
- `subscriptionId`: External payment provider subscription ID
- `trialEndsAt`: End date for trial period, if applicable
- `currentPeriodStart`: Start date of current billing period
- `currentPeriodEnd`: End date of current billing period
- `createdAt`: Timestamp of subscription creation
- `updatedAt`: Timestamp of last subscription update

**Relationships:**
- One-to-one with Team (subscription belongs to one team)

**Constraints:**
- Unique constraint on `teamId` to ensure one subscription per team
- Cascade deletion when team is deleted

## 3. Database Migrations

### 3.1 Initial Teams Migration

The initial migration will create the necessary tables for team functionality.

```sql
-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PRIVATE', 'TEAM', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('DOCUMENT', 'FOLDER', 'TEMPLATE', 'MEDIA', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'TRIALING', 'CANCELED', 'UNPAID');

-- CreateTable
CREATE TABLE "Team" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logoUrl" TEXT,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable (other tables)...

-- Add unique constraints and indexes
ALTER TABLE "Team" ADD CONSTRAINT "Team_slug_key" UNIQUE ("slug");
CREATE INDEX "Team_ownerId_idx" ON "Team"("ownerId");
CREATE INDEX "Team_slug_idx" ON "Team"("slug");

ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_userId_key" UNIQUE ("teamId", "userId");
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- Add foreign key constraints
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Other constraints...
```

## 4. Data Validation

### 4.1 Team Validation Schema (Zod)

```typescript
import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100, "Team name cannot exceed 100 characters"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().nullable(),
  logoUrl: z.string().url("Invalid logo URL").optional().nullable(),
});

export const teamUpdateSchema = teamSchema.partial();

export const teamMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});

export const teamInvitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).default('MEMBER'),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});

// Other validation schemas...
```

## 5. API Data Contracts

### 5.1 Team API Response Types

```typescript
// Team response type
export type TeamResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  userRole: 'OWNER' | 'ADMIN' | 'MEMBER';
};

// Team member response type
export type TeamMemberResponse = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
};

// Team invitation response type
export type TeamInvitationResponse = {
  id: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  inviter: {
    id: string;
    name: string;
  };
  createdAt: string;
  expiresAt: string;
};

// Other response types...
```

### 5.2 Team API Request Types

```typescript
// Create team request
export type CreateTeamRequest = {
  name: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
};

// Update team request
export type UpdateTeamRequest = {
  name?: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
};

// Invite member request
export type InviteMemberRequest = {
  email: string;
  role?: 'OWNER' | 'ADMIN' | 'MEMBER';
  message?: string;
};

// Update member role request
export type UpdateMemberRoleRequest = {
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
};

// Other request types...
```

## 6. Query Optimization

### 6.1 Common Queries

#### Get User's Teams with Role

```typescript
// Using Prisma
const getUserTeams = async (userId: string) => {
  return prisma.teamMember.findMany({
    where: {
      userId,
    },
    include: {
      team: {
        include: {
          _count: {
            select: {
              members: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
};
```

#### Get Team with Members

```typescript
// Using Prisma
const getTeamWithMembers = async (teamId: string) => {
  return prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          resources: true,
        },
      },
    },
  });
};
```

### 6.2 Performance Considerations

1. **Indexing Strategy**
   - Indexes on `teamId`, `userId` in TeamMember for fast membership lookups
   - Index on `ownerId` in Team for quickly finding teams owned by a user
   - Index on `slug` in Team for fast URL-based lookups
   - Indexes on foreign keys in all related tables

2. **Pagination for Large Data Sets**
   - Implement cursor-based pagination for teams, members, and resources lists
   - Example: Limit member lists to 50 per page

3. **Selective Loading**
   - Use Prisma's `select` to fetch only required fields
   - Use separate queries for rarely needed related data

4. **Optimized Joins**
   - Minimize nested includes in Prisma queries
   - Split complex queries into multiple simpler queries when appropriate

## 7. Data Access Patterns

### 7.1 Permission-Based Access Control

```typescript
// Check if user has access to team
const hasTeamAccess = async (userId: string, teamId: string, requiredRole?: TeamRole) => {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!membership) return false;
  
  if (requiredRole) {
    const roleHierarchy = { OWNER: 3, ADMIN: 2, MEMBER: 1 };
    return roleHierarchy[membership.role] >= roleHierarchy[requiredRole];
  }
  
  return true;
};

// Check if user can manage team members
const canManageTeamMembers = async (userId: string, teamId: string) => {
  return hasTeamAccess(userId, teamId, 'ADMIN');
};

// Check if user can delete team
const canDeleteTeam = async (userId: string, teamId: string) => {
  return hasTeamAccess(userId, teamId, 'OWNER');
};
```

### 7.2 Transaction Patterns

```typescript
// Create team with owner as first member (in transaction)
const createTeam = async (userId: string, data: CreateTeamRequest) => {
  return prisma.$transaction(async (tx) => {
    // Create team
    const team = await tx.team.create({
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        logoUrl: data.logoUrl,
        ownerId: userId,
      },
    });
    
    // Add owner as member
    await tx.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: 'OWNER',
      },
    });
    
    // Create default team settings
    await tx.teamSettings.create({
      data: {
        teamId: team.id,
      },
    });
    
    // Create free subscription
    await tx.teamSubscription.create({
      data: {
        teamId: team.id,
        plan: 'FREE',
        status: 'ACTIVE',
      },
    });
    
    return team;
  });
};
```

## 8. Migrations and Data Lifecycle

### 8.1 Migration Strategy

1. **Phased Approach**
   - Initial migration: Core team and member tables
   - Phase 2: Invitation system
   - Phase 3: Resource associations
   - Phase 4: Subscription and billing

2. **Backward Compatibility**
   - Add nullable columns for future expansion
   - Use default values for new required fields
   - Maintain existing indexes during schema updates

### 8.2 Data Cleanup

1. **Expired Invitations**
   - Scheduled job to mark invitations as expired
   - Purge expired invitations older than 30 days

2. **Orphaned Resources**
   - Restrict deletion of creators to prevent orphaned resources
   - Transfer ownership before user deletion

3. **Team Deletion**
   - Cascade deletion to all related records
   - Archive important data before permanent deletion

## 9. Security Considerations

### 9.1 Data Isolation

1. **Row-Level Security**
   - All team queries must validate user membership
   - Resources must check team membership and access level

2. **Secure Invitation Tokens**
   - Use secure random token generation
   - Set appropriate expiration times (7 days)
   - One-time use only

3. **Permission Boundaries**
   - Server-side validation of all role changes
   - Prevent role escalation attacks
   - Maintain at least one owner per team

### 9.2 Sensitive Data Handling

1. **Auditing**
   - Log all role changes
   - Track invitation creation and usage
   - Record team ownership transfers

2. **Payment Information**
   - Store minimal billing information
   - Use external provider's customer/subscription IDs
   - Follow PCI compliance requirements for payment processing

## 10. Future Schema Expansions

### 10.1 Potential Additions

1. **Advanced Permissions**
   ```prisma
   model TeamPermission {
     id             String @id @default(cuid())
     teamId         String
     resourceType   String
     roleName       String
     permissions    Json
     team           Team   @relation(fields: [teamId], references: [id], onDelete: Cascade)
   }
   ```

2. **Team Activity Tracking**
   ```prisma
   model TeamActivity {
     id             String @id @default(cuid())
     teamId         String
     userId         String
     activityType   String
     resourceId     String?
     metadata       Json?
     createdAt      DateTime @default(now())
     team           Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
     user           User @relation(fields: [userId], references: [id], onDelete: Cascade)
   }
   ```

3. **Custom Team Roles**
   ```prisma
   model TeamCustomRole {
     id           String @id @default(cuid())
     teamId       String
     name         String
     description  String?
     permissions  Json
     createdAt    DateTime @default(now())
     updatedAt    DateTime @updatedAt
     team         Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
     members      TeamMember[]
   }
   ```

### 10.2 Schema Evolution Strategy

1. **Extensible Enums**
   - Use string-based enums for values likely to expand
   - Add new enum values in non-breaking migrations

2. **Flexible JSON Fields**
   - Use JSON fields for extensible metadata
   - Create typed access patterns for JSON data

3. **Incremental Complexity**
   - Start with simple role-based permissions
   - Evolve to more granular permission system as needed
   - Plan for potential sharding of high-volume tables 