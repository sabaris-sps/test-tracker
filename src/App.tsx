import React, { useState, useEffect, useCallback, useRef } from "react";
import { TestEntry } from "./types";
import Dashboard from "./components/Dashboard";
import TestForm from "./components/TestForm";
import TestList from "./components/TestList";
import { MOCK_ENTRIES } from "./data/mockData";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BookOpen,
  Download,
  Upload,
  Trash2,
} from "lucide-react";

const App: React.FC = () => {
  const [entries, setEntries] = useState<TestEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "history">(
    "dashboard"
  );
  const [editingEntry, setEditingEntry] = useState<TestEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage or mock data on mount
  useEffect(() => {
    const saved = localStorage.getItem("test_track_entries_v2");
    if (saved && saved !== "[]") {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved entries", e);
        setEntries(MOCK_ENTRIES);
      }
    } else {
      setEntries(MOCK_ENTRIES);
    }
  }, []);

  // Save data to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("test_track_entries_v2", JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((entry: TestEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setActiveTab("history");
  }, []);

  const updateEntry = useCallback((updatedEntry: TestEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
    setEditingEntry(null);
    setActiveTab("history");
  }, []);

  const startEdit = useCallback((entry: TestEntry) => {
    setEditingEntry(entry);
    setActiveTab("add");
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingEntry(null);
    setActiveTab("history");
  }, []);

  const deleteEntry = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this test record?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `test_history_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          if (
            confirm("Importing will overwrite your current session. Continue?")
          ) {
            setEntries(json);
            setActiveTab("dashboard");
          }
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAllData = () => {
    if (
      confirm("DANGER: This will permanently delete all your data. Proceed?")
    ) {
      setEntries([]);
      localStorage.removeItem("test_track_entries_v2");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">
              TestTrack Pro
            </h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setEditingEntry(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("add");
                if (!editingEntry) setEditingEntry(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "add"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <PlusCircle size={20} />
              {editingEntry ? "Edit Test" : "Add Test"}
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                setEditingEntry(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "history"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <History size={20} />
              History
            </button>
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">
              Data Management
            </p>
            <div className="space-y-1">
              <button
                onClick={exportData}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all"
              >
                <Download size={18} /> Export JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all"
              >
                <Upload size={18} /> Import JSON
              </button>
              <button
                onClick={clearAllData}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 text-sm transition-all"
              >
                <Trash2 size={18} /> Clear Everything
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-indigo-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Quick Tip
              </p>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Download your JSON after every test to keep a permanent local
                backup.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <BookOpen className="text-white w-4 h-4" />
          </div>
          <h1 className="font-bold text-lg text-slate-800">TestTrack</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="p-2 text-slate-500 hover:text-indigo-600"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-indigo-600"
          >
            <Upload size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 shadow-2xl">
        <button
          onClick={() => {
            setActiveTab("dashboard");
            setEditingEntry(null);
          }}
          className={`flex flex-col items-center p-2 ${
            activeTab === "dashboard" ? "text-indigo-600" : "text-slate-500"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1 font-bold">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex flex-col items-center p-2 ${
            activeTab === "add" ? "text-indigo-600" : "text-slate-500"
          }`}
        >
          <PlusCircle size={20} />
          <span className="text-[10px] mt-1 font-bold">
            {editingEntry ? "Edit" : "Add"}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("history");
            setEditingEntry(null);
          }}
          className={`flex flex-col items-center p-2 ${
            activeTab === "history" ? "text-indigo-600" : "text-slate-500"
          }`}
        >
          <History size={20} />
          <span className="text-[10px] mt-1 font-bold">History</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && <Dashboard entries={entries} />}
        {activeTab === "add" && (
          <TestForm
            onAdd={addEntry}
            onUpdate={updateEntry}
            editingEntry={editingEntry}
            onCancel={cancelEdit}
          />
        )}
        {activeTab === "history" && (
          <TestList
            entries={entries}
            onDelete={deleteEntry}
            onEdit={startEdit}
          />
        )}
      </main>
    </div>
  );
};

export default App;
