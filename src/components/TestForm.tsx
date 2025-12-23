import React, { useState, useEffect } from "react";
import {
  TestEntry,
  SubjectPerformance,
  INITIAL_SUBJECT_PERFORMANCE,
  SubjectKey,
  SUBJECT_KEYS,
} from "../types";
import {
  calculateIncorrect,
  calculateAccuracy,
  aggregateTotal,
} from "../utils/calculations";
import { Save, AlertCircle, ChevronRight, ChevronLeft, X } from "lucide-react";

interface TestFormProps {
  onAdd: (entry: TestEntry) => void;
  onUpdate: (entry: TestEntry) => void;
  editingEntry: TestEntry | null;
  onCancel: () => void;
}

const TestForm: React.FC<TestFormProps> = ({
  onAdd,
  onUpdate,
  editingEntry,
  onCancel,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [testName, setTestName] = useState("");

  const [subjects, setSubjects] = useState<
    Record<SubjectKey, SubjectPerformance>
  >({
    physics: { ...INITIAL_SUBJECT_PERFORMANCE },
    chemistry: { ...INITIAL_SUBJECT_PERFORMANCE },
    maths: { ...INITIAL_SUBJECT_PERFORMANCE },
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const steps: (SubjectKey | "general")[] = [
    "general",
    "physics",
    "chemistry",
    "maths",
  ];

  // Sync form with editingEntry
  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setTestName(editingEntry.testName);
      setSubjects({
        physics: { ...editingEntry.physics },
        chemistry: { ...editingEntry.chemistry },
        maths: { ...editingEntry.maths },
      });
      setActiveStep(0);
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setTestName("");
      setSubjects({
        physics: { ...INITIAL_SUBJECT_PERFORMANCE },
        chemistry: { ...INITIAL_SUBJECT_PERFORMANCE },
        maths: { ...INITIAL_SUBJECT_PERFORMANCE },
      });
    }
  }, [editingEntry]);

  const handleSubjectChange = (
    subject: SubjectKey,
    field: keyof SubjectPerformance,
    value: number
  ) => {
    setSubjects((prev) => {
      const updatedSubj = { ...prev[subject], [field]: value };
      if (field === "marks" || field === "unattempted") {
        updatedSubj.incorrect = calculateIncorrect(
          updatedSubj.marks,
          updatedSubj.unattempted
        );
        updatedSubj.accuracy = calculateAccuracy(
          updatedSubj.unattempted,
          updatedSubj.incorrect
        );
      }
      return { ...prev, [subject]: updatedSubj };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = aggregateTotal(
      subjects.physics,
      subjects.chemistry,
      subjects.maths
    );

    const entry: TestEntry = {
      id: editingEntry ? editingEntry.id : crypto.randomUUID(),
      date,
      testName: testName || `Test on ${date}`,
      ...subjects,
      total,
    };

    if (editingEntry) {
      onUpdate(entry);
    } else {
      onAdd(entry);
    }
  };

  const currentSubject = steps[activeStep] as SubjectKey;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {editingEntry ? "Edit Test Record" : "New Combined Test Record"}
          </h2>
          <p className="text-slate-500">
            Enter performance data for Physics, Chemistry, and Mathematics.
          </p>
        </div>
        {editingEntry && (
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-xl border border-slate-200"
            title="Cancel editing"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mb-8 flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {steps.map((step, idx) => (
          <button
            key={step}
            type="button"
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeStep === idx
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeStep === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Test Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Test Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mock Test 05"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeStep > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span className="capitalize">{currentSubject}</span> Performance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Marks (out of 100)
                </label>
                <input
                  type="number"
                  value={subjects[currentSubject].marks}
                  onChange={(e) =>
                    handleSubjectChange(
                      currentSubject,
                      "marks",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Unattempted Qs (of 25)
                </label>
                <input
                  type="number"
                  value={subjects[currentSubject].unattempted}
                  onChange={(e) =>
                    handleSubjectChange(
                      currentSubject,
                      "unattempted",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: "Calculation", key: "calcError" },
                { label: "Misconception", key: "misconception" },
                { label: "Concept Gap", key: "conceptNotAware" },
                { label: "Reading Error", key: "readingError" },
                { label: "Extra Thinking", key: "extraThinking" },
                { label: "Lack of Time", key: "lackOfTime" },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </label>
                  <input
                    type="number"
                    value={
                      subjects[currentSubject][
                        item.key as keyof SubjectPerformance
                      ]
                    }
                    onChange={(e) =>
                      handleSubjectChange(
                        currentSubject,
                        item.key as keyof SubjectPerformance,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-2xl flex flex-wrap gap-8 items-center border border-indigo-100">
              <div>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Incorrect Qs
                </p>
                <p className="text-xl font-bold text-indigo-900">
                  {subjects[currentSubject].incorrect}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Accuracy
                </p>
                <p className="text-xl font-bold text-indigo-900">
                  {subjects[currentSubject].accuracy}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          {activeStep < 3 ? (
            <button
              type="button"
              onClick={() => setActiveStep((s) => Math.min(3, s + 1))}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2"
            >
              Next Subject <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Save size={20} />
              {editingEntry ? "Update Test" : "Save Full Test"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TestForm;
