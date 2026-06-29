/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string; // agent id, or 'SYSTEM' / 'SMITH'
  message: string;
  level: LogLevel;
}

export enum StepStatus {
  PENDING = 'pending',
  OVERRIDE_REQUESTED = 'override_requested',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REJECTED = 'rejected',
}

export interface WorkflowStep {
  id: string;
  agentId: AgentId;
  taskName: string;
  input: string;
  status: StepStatus;
  output?: string;
  approvalRequired: boolean;
  startedAt?: string;
  completedAt?: string;
}

export enum WorkflowStatus {
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Workflow {
  id: string;
  title: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  finalReply?: string;
}

export type AgentId =
  | 'smith'
  | 'coder'
  | 'frontend'
  | 'backend'
  | 'supabase'
  | 'netlify'
  | 'devops'
  | 'qa'
  | 'security'
  | 'accessibility'
  | 'prompt-engineering'
  | 'marketing'
  | 'product-analytics'
  | 'technical-writing';

export interface AgentMeta {
  id: AgentId;
  name: string;
  role: string;
  accent: string;
  icon: string;
  approvalRequired: boolean;
  readmeFile: string;
}

export interface SystemConfig {
  anthropicApiKey: string;
  smithModel: string;
  specialistModel: string;
  maxTokens: number;
}

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string;
  sha?: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
