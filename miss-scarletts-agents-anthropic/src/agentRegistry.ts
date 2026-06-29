import type { AgentId, AgentMeta } from './types';

export const TED_META: AgentMeta = {
  id: 'ted',
  name: 'TED',
  role: 'Governing coordinator',
  accent: '#22d3ee',
  icon: 'Shield',
  approvalRequired: false,
  readmeFile: 'ted.README.md',
};

export const AGENTS: AgentMeta[] = [
  TED_META,
  { id: 'coder', name: 'Coder', role: 'Polyglot implementation specialist', accent: '#38bdf8', icon: 'Cpu', approvalRequired: false, readmeFile: 'coder.README.md' },
  { id: 'frontend', name: 'Frontend', role: 'UI and interaction specialist', accent: '#60a5fa', icon: 'Layers', approvalRequired: false, readmeFile: 'frontend.README.md' },
  { id: 'backend', name: 'Backend', role: 'Server logic and data contract specialist', accent: '#34d399', icon: 'Server', approvalRequired: false, readmeFile: 'backend.README.md' },
  { id: 'supabase', name: 'Supabase', role: 'Database and edge platform specialist', accent: '#22c55e', icon: 'Database', approvalRequired: true, readmeFile: 'supabase.README.md' },
  { id: 'netlify', name: 'Netlify', role: 'Deploy and release specialist', accent: '#f59e0b', icon: 'FolderGit2', approvalRequired: true, readmeFile: 'netlify.README.md' },
  { id: 'devops', name: 'DevOps', role: 'CI/CD and release safety specialist', accent: '#a78bfa', icon: 'GitBranch', approvalRequired: true, readmeFile: 'devops.README.md' },
  { id: 'qa', name: 'QA', role: 'Verification and regression specialist', accent: '#f472b6', icon: 'CheckCircle', approvalRequired: false, readmeFile: 'qa.README.md' },
  { id: 'security', name: 'Security', role: 'Secrets and trust-boundary specialist', accent: '#fb7185', icon: 'ShieldAlert', approvalRequired: true, readmeFile: 'security.README.md' },
  { id: 'accessibility', name: 'Accessibility', role: 'Semantic and WCAG specialist', accent: '#f59e0b', icon: 'UserCheck', approvalRequired: false, readmeFile: 'accessibility.README.md' },
  { id: 'prompt-engineering', name: 'Prompt Engineering', role: 'Instruction and tool-shaping specialist', accent: '#c084fc', icon: 'Sliders', approvalRequired: false, readmeFile: 'prompt-engineering.README.md' },
  { id: 'product-analytics', name: 'Product Analytics', role: 'Measurement and insight specialist', accent: '#eab308', icon: 'BarChart3', approvalRequired: false, readmeFile: 'product-analytics.README.md' },
  { id: 'technical-writing', name: 'Technical Writing', role: 'Documentation and recovery specialist', accent: '#14b8a6', icon: 'FileText', approvalRequired: false, readmeFile: 'technical-writing.README.md' },
];

export const SPECIALIST_IDS = AGENTS.filter((agent) => agent.id !== 'ted').map((agent) => agent.id as Exclude<AgentId, 'ted'>);

export const AGENT_GUIDES: Record<AgentId, string> = {
  ted: `TED governs the system, interprets intent, asks clarifying questions, and delegates work to specialists.
Use TED to define scope, split tasks, decide what needs approval, and turn specialist output into a plain-English plan.`,
  coder: `Coder implements code changes with a modern coding-agent loop: inspect, patch, verify, summarize.
Best for edits, refactors, bug fixes, and generating precise file-level change plans.`,
  frontend: `Frontend handles layout, interaction, motion, and component structure.
Best for UI polish, accessibility, responsive behavior, and interaction workflow.`,
  backend: `Backend handles API contracts, orchestration, data flow, and server logic.
Best for request handling, workflow state, and integration surfaces.`,
  supabase: `Supabase handles auth, database schema, policies, functions, and realtime data.
Best for persistence, row-level security, and data access design.`,
  netlify: `Netlify handles deploy settings, build config, redirects, environment variables, and function routing.
Best for static hosting, serverless functions, and custom domain setup.`,
  devops: `DevOps handles CI/CD, release safety, build validation, and deployment gates.
Best for rollout planning, automation, and operational checks.`,
  qa: `QA verifies behavior, regression risk, and acceptance criteria.
Best for test planning, expected outcomes, and failure analysis.`,
  security: `Security handles secrets, trust boundaries, access control, and unsafe behavior review.
Best for approval-sensitive tasks and privilege checks.`,
  accessibility: `Accessibility handles semantics, keyboard support, contrast, and assistive technology behavior.
Best for WCAG-minded UI review and interaction cleanup.`,
  'prompt-engineering': `Prompt Engineering shapes instructions, delegation format, and response constraints.
Best for clarifying intent, improving agent prompts, and tightening output structure.`,
  'product-analytics': `Product Analytics handles event design, success metrics, and behavior signals.
Best for instrumentation, funnels, and usage insight.`,
  'technical-writing': `Technical Writing handles docs, instructions, recovery steps, and user-facing explanations.
Best for README updates, onboarding, and clear plain-English summaries.`,
};

