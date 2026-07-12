"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, SectionHeading } from "@/components/dashboard/ui";
import type {
  CategoryChartItem,
  MonthlyTrendItem,
  RecruitmentChartItem,
  StatusChartItem,
} from "@/types/dashboard";

type AnalyticsSectionProps = Readonly<{
  readonly categoryData: ReadonlyArray<CategoryChartItem>;
  readonly statusData: ReadonlyArray<StatusChartItem>;
  readonly recruitmentData: ReadonlyArray<RecruitmentChartItem>;
  readonly monthlyTrend: ReadonlyArray<MonthlyTrendItem>;
}>;

const pieColors = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#10b981"];

export default function AnalyticsSection({
  categoryData,
  statusData,
  recruitmentData,
  monthlyTrend,
}: AnalyticsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <Card className="p-4">
        <SectionHeading title="Applications by Category" subtitle="Category-wise application volume" />
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="applications" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeading title="Applications by Status" subtitle="Pipeline distribution" />
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="status" innerRadius={56} outerRadius={92}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.status} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 xl:col-span-2">
        <SectionHeading title="Recruitment Statistics & Monthly Job Trends" subtitle="Vacancies, applications, results, and trend movement" />
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recruitmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vacancies" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="applications" stroke="#14b8a6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="results" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {monthlyTrend.map((item) => (
            <div key={item.month} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.month}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.jobs}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
