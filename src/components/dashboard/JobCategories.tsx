import { Card, SectionHeading } from "@/components/dashboard/ui";
import type { JobCategory } from "@/types/dashboard";

type JobCategoriesProps = Readonly<{
  readonly categories: ReadonlyArray<JobCategory>;
}>;

export default function JobCategories({ categories }: JobCategoriesProps) {
  return (
    <Card className="p-4">
      <SectionHeading title="Job Categories" subtitle="Opportunities grouped by major government sectors" />
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{category.name}</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/45 dark:text-blue-300">
                {category.openPositions}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
