// TypeScript interfaces derived from docs/api-reference/schemas/

export interface ToriiConfig {
  apiKey: string;
  baseUrl: string;
  mode: 'read-only' | 'full';
  scimApiKey?: string;
}

// ── Organization ──────────────────────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
  settings?: Record<string, unknown>;
  createdAt?: string;
}

// ── User ──────────────────────────────────────────────────────────────────────

export type LifecycleStatus = 'active' | 'offboarding' | 'offboarded';

export interface User {
  id: number;
  idOrg: number;
  firstName: string;
  lastName: string;
  email: string;
  creationTime: string;
  idRole: number;
  role: string;
  lifecycleStatus: LifecycleStatus;
  isDeletedInIdentitySources: boolean;
  isExternal: boolean;
  activeAppsCount: number;
  additionalEmails: string[];
  [key: string]: unknown; // c_ custom fields
}

export interface UsersListResponse {
  users: User[];
  aggregations?: unknown;
  count: number;
  total: number;
  nextCursor?: string | null;
}

// ── App ───────────────────────────────────────────────────────────────────────

export interface PrimaryOwner {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  lifecycleStatus: LifecycleStatus;
  status: string;
  isDeletedInIdentitySources: boolean;
}

export interface LicenseSummary {
  summary: {
    totalAmount: number;
    activeAmount: number;
    inactiveAmount: number;
    unassignedAmount: number;
    pricePerLicense?: { value: number; currency: string };
    annualCost?: { value: number; currency: string };
    potentialSavings?: { value: number; currency: string };
  };
  types: unknown[];
}

export interface App {
  id: number;
  name: string;
  isHidden?: boolean;
  primaryOwner?: PrimaryOwner;
  state?: string;
  url?: string;
  category?: string;
  description?: string;
  tags?: string;
  licenses?: LicenseSummary;
  [key: string]: unknown; // c_ custom fields
}

export interface AppsListResponse {
  apps: App[];
  aggregations?: unknown;
  count: number;
  total: number;
  nextCursor?: string | null;
}

// ── Contract ──────────────────────────────────────────────────────────────────

export interface Contract {
  id: number;
  name: string;
  idApp?: number;
  status?: string;
  [key: string]: unknown; // c_ custom fields
}

export interface ContractsListResponse {
  contracts: Contract[];
  count?: number;
  total?: number;
  nextCursor?: string | null;
}

// ── Role ──────────────────────────────────────────────────────────────────────

export interface Role {
  id: number;
  systemKey: string;
  name: string;
  description?: string;
  isAdmin: boolean;
  usersCount: number;
}

// ── Audit ─────────────────────────────────────────────────────────────────────

export interface AuditLog {
  performedBy: number;
  performedByFirstName: string;
  performedByLastName: string;
  performedByEmail: string;
  idTargetOrg: number;
  creationTime: string;
  type: string;
  requestDetails?: {
    path: string;
    method: string;
    remoteAddress: string;
  };
  properties?: Record<string, unknown>;
}

export interface AuditListResponse {
  audit: AuditLog[];
  nextCursor?: string | null;
  count?: number;
}

// ── User-App Relationship ─────────────────────────────────────────────────────

export interface UserApp {
  id: number;
  name: string;
  isUserRemovedFromApp: boolean;
  state?: string;
  [key: string]: unknown;
}

// ── SCIM ──────────────────────────────────────────────────────────────────────

export interface SCIMUser {
  schemas: string[];
  id: string;
  userName: string;
  name?: { familyName?: string; givenName?: string };
  active?: boolean;
  emails?: Array<{ primary?: boolean; value: string }>;
  userType?: string;
  meta?: { created?: string };
}

export interface SCIMListResponse {
  schemas: string[];
  totalResults: number;
  itemsPerPage: number;
  startIndex: number;
  Resources: SCIMUser[];
}

// ── File ──────────────────────────────────────────────────────────────────────

export interface FileEntity {
  id: number;
  path: string;
  type: string;
  size?: number;
}

// ── Workflow ──────────────────────────────────────────────────────────────────

export interface WorkflowActionExecution {
  workflowRunId?: number;
  actionStatus?: string;
  timestamp?: string;
  [key: string]: unknown;
}

// ── API error response ────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}
