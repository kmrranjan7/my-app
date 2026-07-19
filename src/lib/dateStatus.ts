const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseDateSafe(value?: string): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;

  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/;
  const ymdMatch = ymd.exec(trimmed);
  if (ymdMatch) {
    const year = Number.parseInt(ymdMatch[1], 10);
    const month = Number.parseInt(ymdMatch[2], 10);
    const day = Number.parseInt(ymdMatch[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const dmyMatch = dmy.exec(trimmed);
  if (dmyMatch) {
    const day = Number.parseInt(dmyMatch[1], 10);
    const month = Number.parseInt(dmyMatch[2], 10);
    const year = Number.parseInt(dmyMatch[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDateOnly(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function formatDate(value?: string): string {
  const parsed = parseDateSafe(value);
  if (!parsed) return "To Be Announced";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getStatus(startDate?: string, endDate?: string): string {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(endDate);
  if (!start || !end) return "To Be Announced";

  const startOnly = toDateOnly(start);
  const endOnly = toDateOnly(end);
  if (startOnly.getTime() > endOnly.getTime()) return "To Be Announced";

  const today = toDateOnly(new Date());
  if (today.getTime() > endOnly.getTime()) return "Closed";

  const windowDays = Math.ceil((endOnly.getTime() - startOnly.getTime()) / MS_PER_DAY);
  return `${windowDays}d left`;
}

export function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("closed")) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  if (normalized.includes("to be announced")) {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  if (normalized.includes("last day")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  const dayMatch = /^(\d+)d left$/i.exec(status.trim());
  if (dayMatch) {
    const days = Number.parseInt(dayMatch[1], 10);
    if (days <= 7) return "border-rose-200 bg-rose-50 text-rose-700";
    if (days <= 15) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}
