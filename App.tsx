
import React, { useState, useEffect, useCallback } from 'react';
import { TestEntry } from './types';
import Dashboard from './components/Dashboard';
import TestForm from './components/TestForm';
import TestList from './components/TestList';
import { LayoutDashboard, PlusCircle, History, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [entries, setEntries] = useState<TestEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history'>('dashboard');

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('test_track_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved entries", e);
      }
    }
  }, []);

  // Save data to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('test_track_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((entry: TestEntry) => {
    setEntries(prev => [entry, ...prev]);
    setActiveTab('history');
  }, []);

  const deleteEntry = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this test record?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl text-slate-800">TestTrack</h1>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'add' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PlusCircle size={20} />
              Add Test
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <History size={20} />
              History
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Quick Tip</p>
            <p className="text-sm text-slate-600">Review your "Concept not aware" entries to prioritize your study plan.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1 font-medium">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('add')} className={`flex flex-col items-center p-2 ${activeTab === 'add' ? 'text-indigo-600' : 'text-slate-500'}`}>
          <PlusCircle size={20} />
          <span className="text-[10px] mt-1 font-medium">Add New</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center p-2 ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-500'}`}>
          <History size={20} />
          <span className="text-[10px] mt-1 font-medium">History</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard entries={entries} />}
        {activeTab === 'add' && <TestForm onAdd={addEntry} />}
        {activeTab === 'history' && <TestList entries={entries} onDelete={deleteEntry} />}
      </main>
    </div>
  );
};

export default App;
