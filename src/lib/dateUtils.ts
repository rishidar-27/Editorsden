/**
 * Utility functions for formatting and displaying timestamps across the application.
 */

export function getEditorLastActiveDate(editor?: {
  lastLogin?: string;
  lastProfileUpdate?: string;
  lastPortfolioUpdate?: string;
  createdAt?: string;
  updated_at?: string;
}): string {
  if (!editor) return '';

  const timestamps = [
    editor.lastLogin,
    editor.lastProfileUpdate,
    editor.lastPortfolioUpdate,
    (editor as any).updated_at,
    editor.createdAt,
  ]
    .filter(Boolean)
    .map((d) => new Date(d!).getTime())
    .filter((t) => !isNaN(t));

  if (timestamps.length === 0) return '';
  return new Date(Math.max(...timestamps)).toISOString();
}

/**
 * Returns true if the timestamp was within the last N minutes (default 15).
 */
export function isRecentlyActive(dateString?: string | null, minutesThreshold = 15): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  // Allow slight clock skew discrepancies (-600,000ms = -10 minutes)
  return diffMs >= -600000 && diffMs <= minutesThreshold * 60 * 1000;
}

/**
 * Checks if an editor is currently online based on their account status and recent activity.
 */
export function isEditorOnline(editor?: {
  active?: boolean;
  lastLogin?: string;
  lastProfileUpdate?: string;
  lastPortfolioUpdate?: string;
  updated_at?: string;
  createdAt?: string;
} | null, minutesThreshold = 15): boolean {
  if (!editor) return false;
  if (editor.active === false) return false;
  const activeIso = getEditorLastActiveDate(editor);
  return isRecentlyActive(activeIso, minutesThreshold);
}

/**
 * Formats a timestamp into a human-friendly relative string:
 * "Active now", "5m ago", "2h ago", "Yesterday", "3d ago", "2w ago", etc.
 */
export function formatLastActive(dateString?: string | null): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Allow small negative values for slight clock discrepancies
  if (diffMs < 0 && diffMs > -600000) return 'Active now';
  if (diffMs < 0) return 'Active now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 3) return 'Active now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

/**
 * Formats date into readable string like "Aug 18, 2026, 09:30 AM"
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
