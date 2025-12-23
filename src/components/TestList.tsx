import React from "react";
import { TestEntry, SubjectPerformance } from "../types";
import {
  Trash2,
  Calendar,
  Target,
  History,
  AlertCircle,
  Clock,
  Book,
  Glasses,
  Brain,
  Calculator,
  Pencil,
} from "lucide-react";

interface TestListProps {
  entries: TestEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: TestEntry) => void;
}

const TestList: React.FC<TestListProps> = ({ entries, onDelete, onEdit }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <History size={48} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          No test records found
        </h3>
        <p className="text-slate-500 text-center max-w-xs mt-1">
          Start adding your test results to build up your performance history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-800">Test History</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
          {entries.length} combined tests
        </span>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {entry.testName}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />{" "}
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-600">
                    Total: {entry.total.marks}/300
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                    <Target size={12} /> {entry.total.accuracy}% Accuracy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onEdit(entry)}
                  className="text-slate-400 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all"
                  title="Edit record"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all"
                  title="Delete record"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["physics", "chemistry", "maths"].map((subj) => {
                const s = entry[subj as keyof TestEntry] as SubjectPerformance;
                return (
                  <div
                    key={subj}
                    className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {subj}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900">
                          {s.marks}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium">
                          /100
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg border border-red-200 shadow-sm flex items-center gap-1">
                        <AlertCircle size={10} /> Err: {s.incorrect}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg border border-amber-200 shadow-sm flex items-center gap-1">
                        <Clock size={10} /> Left: {s.unattempted}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200 shadow-sm">
                        {s.accuracy}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-100">
                      {s.calcError > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Calculator size={10} /> Calc: {s.calcError}
                        </span>
                      )}
                      {s.misconception > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Brain size={10} /> Misc: {s.misconception}
                        </span>
                      )}
                      {s.conceptNotAware > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Book size={10} /> Gap: {s.conceptNotAware}
                        </span>
                      )}
                      {s.readingError > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Glasses size={10} /> Read: {s.readingError}
                        </span>
                      )}
                      {s.extraThinking > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Brain size={10} /> Think: {s.extraThinking}
                        </span>
                      )}
                      {s.lackOfTime > 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                          <Clock size={10} /> Time: {s.lackOfTime}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestList;
