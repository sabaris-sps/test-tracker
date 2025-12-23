
import React, { useMemo } from 'react';
import { TestEntry } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { TrendingUp, Award, Frown, Info } from 'lucide-react';

interface DashboardProps {
  entries: TestEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1];
    
    const avgMarks = entries.reduce((acc, curr) => acc + curr.total.marks, 0) / entries.length;
    const avgAccuracy = entries.reduce((acc, curr) => acc + curr.total.accuracy, 0) / entries.length;
    const totalIncorrect = entries.reduce((acc, curr) => acc + curr.total.incorrect, 0);

    // Subject comparisons
    const calcSubjAvg = (key: 'physics' | 'chemistry' | 'maths') => 
      entries.reduce((acc, curr) => acc + curr[key].marks, 0) / entries.length;

    return {
      latestMark: latest.total.marks,
      avgMarks: Math.round(avgMarks * 10) / 10,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      totalIncorrect,
      trendData: sorted.map(e => ({
        date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        marks: e.total.marks,
        accuracy: e.total.accuracy
      })),
      subjectComparison: [
        { name: 'Physics', avg: Math.round(calcSubjAvg('physics') * 10) / 10 },
        { name: 'Chemistry', avg: Math.round(calcSubjAvg('chemistry') * 10) / 10 },
        { name: 'Maths', avg: Math.round(calcSubjAvg('maths') * 10) / 10 },
      ]
    };
  }, [entries]);

  const errorData = useMemo(() => {
    if (entries.length === 0) return [];
    const totals = entries.reduce((acc, curr) => ({
      calc: acc.calc + curr.total.calcError,
      misc: acc.misc + curr.total.misconception,
      concept: acc.concept + curr.total.conceptNotAware,
      reading: acc.reading + curr.total.readingError,
      think: acc.think + curr.total.extraThinking,
      time: acc.time + curr.total.lackOfTime
    }), { calc: 0, misc: 0, concept: 0, reading: 0, think: 0, time: 0 });

    return [
      { subject: 'Calculation', value: totals.calc },
      { subject: 'Misconception', value: totals.misc },
      { subject: 'Concept Gap', value: totals.concept },
      { subject: 'Reading', value: totals.reading },
      { subject: 'Extra Thinking', value: totals.think },
      { subject: 'Time Pressure', value: totals.time },
    ];
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-indigo-50 p-6 rounded-3xl mb-6">
          <Award size={64} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No data available</h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm">Log your first combined test results to see detailed analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Test Analysis</h2>
        <p className="text-slate-500 mt-1">Total score trends and subject-wise insights.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-50 p-2 rounded-xl"><TrendingUp className="text-indigo-600 w-5 h-5" /></div>
          </div>
          <p className="text-sm font-medium text-slate-500">Avg Total Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-bold text-slate-900">{stats?.avgMarks}</h4>
            <span className="text-slate-400 text-sm">/ 300</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-2 rounded-xl"><Award className="text-emerald-600 w-5 h-5" /></div>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Accuracy</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-bold text-slate-900">{stats?.avgAccuracy}%</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-50 p-2 rounded-xl"><Frown className="text-rose-600 w-5 h-5" /></div>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Incorrects</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-bold text-slate-900">{stats?.totalIncorrect}</h4>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg border border-indigo-700">
          <div className="flex items-center justify-between mb-4 text-white/80">
            <div className="bg-white/20 p-2 rounded-xl"><Info className="text-white w-5 h-5" /></div>
          </div>
          <p className="text-sm font-medium text-white/70">Latest Total</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-bold text-white">{stats?.latestMark}</h4>
            <span className="text-white/60 text-sm">/ 300</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Combined Score Progress</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 300]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="marks" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Averages</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.subjectComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="avg" radius={[8, 8, 0, 0]} barSize={50}>
                  {stats?.subjectComparison.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#0ea5e9', '#10b981'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Aggregated Error Analysis</h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={errorData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Total Errors" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
