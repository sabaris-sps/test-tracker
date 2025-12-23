import React, { useMemo, useState } from "react";
import { TestEntry, SubjectKey, SUBJECT_KEYS } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ComposedChart,
  Scatter,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Award,
  Frown,
  Info,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react";

interface DashboardProps {
  entries: TestEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [errorView, setErrorView] = useState<
    "total" | "physics" | "chemistry" | "maths"
  >("total");

  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const latest = sorted[sorted.length - 1];

    const avgMarks =
      entries.reduce((acc, curr) => acc + curr.total.marks, 0) / entries.length;
    const avgAccuracy =
      entries.reduce((acc, curr) => acc + curr.total.accuracy, 0) /
      entries.length;

    const calcSubjAvg = (key: SubjectKey) =>
      entries.reduce((acc, curr) => acc + curr[key].marks, 0) / entries.length;

    const trendData = sorted.map((e) => ({
      date: new Date(e.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      fullName: e.testName,
      total: e.total.marks,
      physics: e.physics.marks,
      chemistry: e.chemistry.marks,
      maths: e.maths.marks,
      accuracy: e.total.accuracy,
    }));

    const efficiencyData = entries.map((e) => ({
      name: e.testName,
      attempts: 75 - e.total.unattempted,
      accuracy: e.total.accuracy,
      marks: e.total.marks,
    }));

    return {
      latestMark: latest.total.marks,
      avgMarks: Math.round(avgMarks * 10) / 10,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      trendData,
      efficiencyData,
      subjectComparison: [
        {
          name: "Physics",
          avg: Math.round(calcSubjAvg("physics") * 10) / 10,
          color: "#6366f1",
        },
        {
          name: "Chemistry",
          avg: Math.round(calcSubjAvg("chemistry") * 10) / 10,
          color: "#0ea5e9",
        },
        {
          name: "Maths",
          avg: Math.round(calcSubjAvg("maths") * 10) / 10,
          color: "#10b981",
        },
      ],
    };
  }, [entries]);

  const errorAnalysis = useMemo(() => {
    if (entries.length === 0) return { radarData: [], contributionData: [] };

    const getErrorSet = (key: "total" | SubjectKey) => {
      const source = entries.map((e) => (key === "total" ? e.total : e[key]));
      return [
        {
          label: "Calculation",
          value: source.reduce((a, c) => a + c.calcError, 0),
        },
        {
          label: "Misconception",
          value: source.reduce((a, c) => a + c.misconception, 0),
        },
        {
          label: "Concept Gap",
          value: source.reduce((a, c) => a + c.conceptNotAware, 0),
        },
        {
          label: "Reading",
          value: source.reduce((a, c) => a + c.readingError, 0),
        },
        {
          label: "Extra Thinking",
          value: source.reduce((a, c) => a + c.extraThinking, 0),
        },
        {
          label: "Time Pressure",
          value: source.reduce((a, c) => a + c.lackOfTime, 0),
        },
      ];
    };

    const contributionData = [
      {
        type: "Calc",
        physics: entries.reduce((a, c) => a + c.physics.calcError, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.calcError, 0),
        maths: entries.reduce((a, c) => a + c.maths.calcError, 0),
      },
      {
        type: "Misc",
        physics: entries.reduce((a, c) => a + c.physics.misconception, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.misconception, 0),
        maths: entries.reduce((a, c) => a + c.maths.misconception, 0),
      },
      {
        type: "Gap",
        physics: entries.reduce((a, c) => a + c.physics.conceptNotAware, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.conceptNotAware, 0),
        maths: entries.reduce((a, c) => a + c.maths.conceptNotAware, 0),
      },
      {
        type: "Read",
        physics: entries.reduce((a, c) => a + c.physics.readingError, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.readingError, 0),
        maths: entries.reduce((a, c) => a + c.maths.readingError, 0),
      },
      {
        type: "Think",
        physics: entries.reduce((a, c) => a + c.physics.extraThinking, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.extraThinking, 0),
        maths: entries.reduce((a, c) => a + c.maths.extraThinking, 0),
      },
      {
        type: "Time",
        physics: entries.reduce((a, c) => a + c.physics.lackOfTime, 0),
        chemistry: entries.reduce((a, c) => a + c.chemistry.lackOfTime, 0),
        maths: entries.reduce((a, c) => a + c.maths.lackOfTime, 0),
      },
    ];

    return {
      radarData: getErrorSet(errorView),
      contributionData,
    };
  }, [entries, errorView]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-indigo-50 p-6 rounded-3xl mb-6">
          <Award size={64} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          No analytical data
        </h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm">
          Log your first combined test results to generate deep insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Combined Performance Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Holistic view of your preparation journey.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
          {(["total", "physics", "chemistry", "maths"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setErrorView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                errorView === v
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all hover:border-indigo-200">
          <div className="bg-indigo-50 p-2.5 rounded-2xl w-fit mb-4">
            <TrendingUp className="text-indigo-600 w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Average Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-black text-slate-900">
              {stats?.avgMarks}
            </h4>
            <span className="text-slate-400 text-sm font-medium">/ 300</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all hover:border-emerald-200">
          <div className="bg-emerald-50 p-2.5 rounded-2xl w-fit mb-4">
            <Award className="text-emerald-600 w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Avg Accuracy</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-black text-slate-900">
              {stats?.avgAccuracy}%
            </h4>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-500">
          <div className="bg-white/20 p-2.5 rounded-2xl w-fit mb-4">
            <Info className="text-white w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-white/80">Latest Result</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-black text-white">
              {stats?.latestMark}
            </h4>
            <span className="text-white/60 text-sm font-medium">/ 300</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Marks Progression */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={24} />
            Total Mark Progression
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  domain={[0, 300]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: 700, marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Error Profile Radar */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2 capitalize">
            <PieChart className="text-indigo-500" size={24} />
            {errorView} Profile
          </h3>
          <p className="text-slate-400 text-xs mb-8">
            Detailed error distribution for the selected category.
          </p>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={errorAnalysis.radarData}
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, "auto"]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Error Count"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-wise Performance Progression */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-indigo-500" size={24} />
              Subject-wise Deep Dive
            </h3>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>{" "}
                Physics
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>{" "}
                Chemistry
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>{" "}
                Mathematics
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="physics"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="chemistry"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="maths"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Source Attribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Filter className="text-indigo-500" size={24} />
            Error Source Attribution
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorAnalysis.contributionData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="type"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Bar
                  dataKey="physics"
                  stackId="a"
                  fill="#6366f1"
                  radius={[0, 0, 0, 0]}
                  barSize={24}
                  name="Physics"
                />
                <Bar
                  dataKey="chemistry"
                  stackId="a"
                  fill="#0ea5e9"
                  radius={[0, 0, 0, 0]}
                  barSize={24}
                  name="Chemistry"
                />
                <Bar
                  dataKey="maths"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 8, 8, 0]}
                  barSize={24}
                  name="Maths"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attempt Efficiency Correlation */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Activity className="text-indigo-500" size={24} />
            Accuracy vs. Attempt
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats?.efficiencyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="attempts"
                  label={{
                    value: "Questions Attempted",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  label={{
                    value: "Accuracy (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Tests" dataKey="accuracy" fill="#6366f1" />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  fill="#f5f3ff"
                  stroke="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed italic text-center px-4">
            Correlation between the quantity of questions tackled and the
            resulting accuracy. Aim for the top-right quadrant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
