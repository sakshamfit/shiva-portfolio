/** Re-mounts on every navigation, so the fallback page fade (no View Transitions) can replay. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-shell">{children}</div>;
}
