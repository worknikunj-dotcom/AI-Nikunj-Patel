import { useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { useRcaStore } from './store/useRcaStore';
import { Incident } from './types';
import { Toast } from './components/Toast';
import { generateSuggestions } from './utils/ai';

const sevOrder = ['Low','Medium','High','Critical'];

export default function App() {
  const store = useRcaStore();
  const [tab, setTab] = useState<'Dashboard'|'Incidents'|'Create'>('Dashboard');
  const [toast, setToast] = useState('');
  const selected = store.incidents.find(i => i.id === store.selectedId);

  const filtered = useMemo(() => store.incidents.filter(i =>
    (!store.filters.severity || i.severity===store.filters.severity) &&
    (!store.filters.status || i.status===store.filters.status) &&
    (!store.filters.owner || i.owner===store.filters.owner) &&
    (`${i.title} ${i.description} ${i.tags.join(' ')}`.toLowerCase().includes(store.query.toLowerCase()))
  ), [store]);

  const bySeverity = sevOrder.map(s => ({ name:s, value: store.incidents.filter(i=>i.severity===s).length }));

  const createIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const incident: Incident = { id:`INC-${Date.now()}`, title:String(fd.get('title')), description:String(fd.get('description')), severity:fd.get('severity') as Incident['severity'], status:'Open', createdDate:new Date().toISOString().slice(0,10), owner:String(fd.get('owner')), tags:String(fd.get('tags')).split(',').map(t=>t.trim()).filter(Boolean), rootCauses:[], timeline:[], tasks:[], comments:[] };
    store.upsertIncident(incident); setToast('Incident created'); setTab('Incidents'); e.currentTarget.reset();
  };

  return <div className={`${store.darkMode ? 'dark bg-slate-950 text-slate-100':'bg-slate-50 text-slate-900'} min-h-screen`}>
    <header className="flex items-center justify-between border-b border-slate-700 p-4"><h1 className="text-xl font-bold">RCA Platform</h1><button onClick={store.toggleDarkMode} className="rounded bg-slate-800 px-3 py-1">Theme</button></header>
    <nav className="flex gap-2 p-4">{['Dashboard','Incidents','Create'].map(t=><button key={t} onClick={()=>setTab(t as never)} className="rounded bg-indigo-600 px-3 py-1">{t}</button>)}</nav>
    {tab==='Dashboard' && <section className="grid gap-4 p-4 md:grid-cols-2"><div className="rounded border p-4">Total {store.incidents.length} | Open {store.incidents.filter(i=>i.status!=='Resolved').length} | Critical {store.incidents.filter(i=>i.severity==='Critical').length}</div><div className="rounded border p-4">Most common root cause: {store.incidents.flatMap(i=>i.rootCauses).at(0)?.summary ?? 'N/A'}</div><div className="h-64 rounded border p-4"><ResponsiveContainer><BarChart data={bySeverity}><XAxis dataKey='name'/><YAxis/><Tooltip/><Bar dataKey='value' fill='#6366f1'/></BarChart></ResponsiveContainer></div><div className="h-64 rounded border p-4"><ResponsiveContainer><LineChart data={store.incidents.map((i,idx)=>({name:i.id,v:idx+1}))}><CartesianGrid strokeDasharray='3 3'/><XAxis dataKey='name'/><YAxis/><Tooltip/><Line dataKey='v' stroke='#22c55e'/></LineChart></ResponsiveContainer></div></section>}
    {tab==='Incidents' && <section className="grid gap-4 p-4 lg:grid-cols-3"><div className="lg:col-span-1 rounded border p-3"><input placeholder='Search' className='mb-2 w-full rounded border bg-transparent p-2' onChange={e=>store.setQuery(e.target.value)}/><div className='grid grid-cols-3 gap-2 mb-2'><select onChange={e=>store.setFilter('severity',e.target.value)} className='rounded border bg-transparent p-1'><option value=''>All Sev</option>{sevOrder.map(s=><option key={s}>{s}</option>)}</select><select onChange={e=>store.setFilter('status',e.target.value)} className='rounded border bg-transparent p-1'><option value=''>All Status</option>{['Open','In Progress','Resolved'].map(s=><option key={s}>{s}</option>)}</select><input placeholder='Owner' className='rounded border bg-transparent p-1' onChange={e=>store.setFilter('owner',e.target.value)}/></div>{filtered.map(i=><div key={i.id} className='mb-2 rounded border p-2 cursor-pointer' onClick={()=>store.selectIncident(i.id)}><div className='font-medium'>{i.title}</div><div className='text-xs'>{i.severity} • {i.status}</div></div>)}</div><div className='lg:col-span-2 rounded border p-4'>{selected ? <IncidentDetail incident={selected} onToast={setToast} /> : 'Select an incident'}</div></section>}
    {tab==='Create' && <form onSubmit={createIncident} className='mx-4 grid gap-3 rounded border p-4 md:max-w-2xl'><input name='title' required placeholder='Title' className='rounded border bg-transparent p-2'/><textarea name='description' required placeholder='Description' className='rounded border bg-transparent p-2'/><div className='grid grid-cols-2 gap-3'><select name='severity' className='rounded border bg-transparent p-2'>{sevOrder.map(s=><option key={s}>{s}</option>)}</select><input name='owner' required placeholder='Owner' className='rounded border bg-transparent p-2'/></div><input name='tags' placeholder='tags,comma,separated' className='rounded border bg-transparent p-2'/><button className='rounded bg-emerald-600 px-3 py-2'>Save Incident</button></form>}
    {toast && <Toast message={toast} />}
  </div>;
}

function IncidentDetail({ incident, onToast }: { incident: Incident; onToast: (m:string)=>void }) {
  const { addRootCause, addTask } = useRcaStore();
  const [loading, setLoading] = useState(false);
  return <div className='space-y-3'><h2 className='text-lg font-semibold'>{incident.title}</h2><p>{incident.description}</p><button className='rounded bg-violet-600 px-3 py-1' onClick={async ()=>{setLoading(true); const s=await generateSuggestions(incident.description); addRootCause(incident.id,{id:crypto.randomUUID(), method:'5 Whys', summary:s.causes[0], details:s.causes.join('; '), preventiveAction:s.preventive[0]}); setLoading(false); onToast('AI suggestions added');}}> {loading?'Generating...':'Generate RCA Suggestions'} </button><div><h3 className='font-medium'>Root Causes</h3>{incident.rootCauses.map(r=><div key={r.id} className='rounded border p-2 my-1'><div>{r.method}: {r.summary}</div><div className='text-xs'>{r.preventiveAction}</div></div>)}</div><div><button className='rounded bg-sky-700 px-2 py-1' onClick={()=>{addTask(incident.id,{id:crypto.randomUUID(),title:'Follow-up action',owner:incident.owner,dueDate:new Date().toISOString().slice(0,10),status:'Todo'}); onToast('Task created');}}>Add action item</button>{incident.tasks.map(t=><div key={t.id} className='text-sm'>{t.title} - {t.owner} - {t.status}</div>)}</div></div>;
}
