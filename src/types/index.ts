export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface TaskItem {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
}

export interface RootCause {
  id: string;
  method: '5 Whys' | 'Fishbone';
  summary: string;
  details: string;
  preventiveAction: string;
}

export interface TimelineEvent {
  id: string;
  at: string;
  note: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  createdDate: string;
  owner: string;
  tags: string[];
  rootCauses: RootCause[];
  timeline: TimelineEvent[];
  tasks: TaskItem[];
  comments: { id: string; user: string; message: string; at: string }[];
}
