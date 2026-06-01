export type AgentStatus = "idle" | "working" | "error";

export interface Agent {
  name: string;
  role: string;
  avatar: string;
  status: AgentStatus;
  description: string;
  last_active: string | null;
  capabilities: string[];
}

export interface ActivityEvent {
  agent: string;
  agent_name: string;
  message: string;
  kind: "info" | "start" | "success" | "complete" | "error";
  timestamp: string;
}

export interface AgentsStatusResponse {
  agents: Record<string, Agent>;
  recent_activity: ActivityEvent[];
}

export interface WsInitMessage {
  type: "init";
  agents: Record<string, Agent>;
  recent_activity: ActivityEvent[];
}
