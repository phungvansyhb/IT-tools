export interface ToolSuiteProps {
  toolId: string;
  initialState?: Record<string, unknown> | null;
  onStateChange?: (state: Record<string, unknown>) => void;
  onRun?: () => void;
}
