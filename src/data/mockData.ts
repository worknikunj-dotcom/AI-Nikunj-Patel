import { Incident } from '../types';

export const seedIncidents: Incident[] = [
  {
    id: 'INC-1001',
    title: 'Payment gateway timeout spike',
    description: 'Checkout requests timing out during peak US traffic window.',
    severity: 'Critical',
    status: 'In Progress',
    createdDate: '2026-05-01',
    owner: 'Priya',
    tags: ['payments', 'latency'],
    rootCauses: [
      { id: 'rc1', method: '5 Whys', summary: 'Connection pool exhaustion', details: 'Autoscaling lagged behind burst traffic.', preventiveAction: 'Pre-warm instances and tune pool limits.' }
    ],
    timeline: [
      { id: 't1', at: '2026-05-01T12:15:00Z', note: 'Alert triggered' },
      { id: 't2', at: '2026-05-01T12:35:00Z', note: 'Mitigation rollout started' }
    ],
    tasks: [{ id: 'tk1', title: 'Tune DB pool', owner: 'Arjun', dueDate: '2026-05-08', status: 'In Progress' }],
    comments: []
  }
];
