export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export type AvailabilityStatus = 'Full-Time' | 'Part-Time' | 'Weekends' | 'Not Available';

export type ProjectStatus = 'Assigned' | 'In Progress' | 'Ready for Review' | 'Approved' | 'Sent Back';

export type TaskType =
  | 'Reels Editing'
  | 'YouTube Editing'
  | 'Podcast Editing'
  | 'Motion Graphics'
  | 'Commercial Ads'
  | 'Corporate Videos'
  | 'Wedding Videos'
  | 'Color Grading'
  | 'Thumbnail Design';

export type Skill =
  | 'Reels Editing'
  | 'YouTube Editing'
  | 'Podcast Editing'
  | 'Motion Graphics'
  | 'Commercial Ads'
  | 'Corporate Videos'
  | 'Wedding Videos'
  | 'Color Grading'
  | 'Thumbnail Design';

export type Software =
  | 'Adobe Premiere Pro'
  | 'After Effects'
  | 'DaVinci Resolve'
  | 'Final Cut Pro'
  | 'Adobe Photoshop'
  | 'Adobe Audition'
  | 'CapCut';

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'video' | 'link';
  thumbnailUrl: string;
  link: string;
  featured: boolean;
}

export interface Editor {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  city: string;
  linkedin?: string;
  instagram?: string;
  portfolioLink?: string;
  experience: number;
  editingSoftware: Software[];
  skills: Skill[];
  availability: AvailabilityStatus;
  hoursPerWeek: number;
  bio: string;
  avatarUrl: string;
  portfolio: PortfolioItem[];
  verificationStatus: VerificationStatus;
  verificationFeedback?: string;
  verificationDocs: {
    resumeLink?: string;
    sampleWorkLinks: string[];
    portfolioLinks: string[];
  };
  active: boolean;
  lastLogin: string;
  lastProfileUpdate: string;
  lastPortfolioUpdate: string;
  isFeatured?: boolean;
  languages?: string[];
  timeZone?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  storageUsedBytes?: number;
  storageLimitBytes?: number;
  storageTier?: 'Free' | 'Pro_50GB' | 'Studio_200GB';
}

export interface EditorAsset {
  id: string;
  editorId: string;
  subtaskId?: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  r2Key: string;
  publicUrl: string;
  createdAt: string;
}

export interface DeliverableSubmission {
  id: string;
  version: number;
  fileName: string;
  fileSizeBytes: number;
  fileUrl: string;
  mimeType?: string;
  notes?: string;
  submittedAt: string;
  submittedByEditorId: string;
  status?: 'In Review' | 'Approved' | 'Sent Back';
  feedback?: string;
  feedbackGivenAt?: string;
}

export interface Subtask {
  id: string;
  projectId: string;
  title: string;
  taskType: TaskType;
  deadline: string;
  assignedEditorIds: string[];
  status: ProjectStatus;
  deliverableLink?: string;
  feedback?: string;
  deliverablesQueue?: DeliverableSubmission[];
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  subtasks: Subtask[];
}

export interface User {
  type: 'admin' | 'editor';
  editorId?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'verify' | 'reject' | 'assign' | 'approve' | 'send_back' | 'create_project' | 'register' | 'submit_review';
  message: string;
  timestamp: string;
}
