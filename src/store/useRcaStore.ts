import { create } from 'zustand';
import { Incident, RootCause, TaskItem } from '../types';
import { seedIncidents } from '../data/mockData';

interface RcaState {
  incidents: Incident[];
  query: string;
  filters: { severity: string; status: string; owner: string };
  selectedId?: string;
  darkMode: boolean;
  setQuery: (query: string) => void;
  setFilter: (k: 'severity' | 'status' | 'owner', v: string) => void;
  selectIncident: (id?: string) => void;
  upsertIncident: (incident: Incident) => void;
  deleteIncident: (id: string) => void;
  addRootCause: (incidentId: string, cause: RootCause) => void;
  addTask: (incidentId: string, task: TaskItem) => void;
  toggleDarkMode: () => void;
}

const STORAGE_KEY = 'rca-platform-v1';
const getInitial = (): Incident[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : seedIncidents;
};

export const useRcaStore = create<RcaState>((set) => ({
  incidents: getInitial(),
  query: '',
  filters: { severity: '', status: '', owner: '' },
  darkMode: true,
  setQuery: (query) => set({ query }),
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  selectIncident: (id) => set({ selectedId: id }),
  upsertIncident: (incident) => set((s) => {
    const incidents = s.incidents.some((i) => i.id === incident.id)
      ? s.incidents.map((i) => (i.id === incident.id ? incident : i))
      : [incident, ...s.incidents];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    return { incidents };
  }),
  deleteIncident: (id) => set((s) => {
    const incidents = s.incidents.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    return { incidents, selectedId: s.selectedId === id ? undefined : s.selectedId };
  }),
  addRootCause: (incidentId, cause) => set((s) => {
    const incidents = s.incidents.map((i) => i.id === incidentId ? { ...i, rootCauses: [...i.rootCauses, cause] } : i);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    return { incidents };
  }),
  addTask: (incidentId, task) => set((s) => {
    const incidents = s.incidents.map((i) => i.id === incidentId ? { ...i, tasks: [...i.tasks, task] } : i);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    return { incidents };
  }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode }))
}));
