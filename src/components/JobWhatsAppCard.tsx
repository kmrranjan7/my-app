"use client";

import { Download, Share2 } from "lucide-react";

type Job = {
  postName: string;
  organization: string;
  state: string;
  qualification: string;
  seats: string;
  startDate: string;
  lastDate: string;
  status: string;
  applyLink: string;
};

export default function JobWhatsAppCard() {
  const job: Job = {
    postName: "SSC CGL 2026",
    organization: "SSC",
    state: "Bihar",
    qualification: "Graduate",
    seats: "N/A",
    startDate: "01-07-2026",
    lastDate: "31-07-2026",
    status: "31 Days Left",
    applyLink: "https://sarkariglobalresult.com/ssc-cgl-2026",
  };

  const shareOnWhatsApp = () => {
    const message = `
🔥 SarkariGlobalResult - Job Alert

✅ ${job.postName}

🏢 Organization: ${job.organization}
📍 State: ${job.state}
🎓 Qualification: ${job.qualification}
👥 Seats: ${job.seats}

📅 Start Date: ${job.startDate}
⏰ Last Date: ${job.lastDate}

🚨 Status: ${job.status}

👉 Apply Now:
${job.applyLink}
`;

    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div
        id="job-card"
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 p-6 text-white">
          <h1 className="text-3xl font-bold">
            SarkariGlobalResult
          </h1>
          <p className="mt-2 text-sm opacity-90">
            Latest Government Job Notification
          </p>
        </div>

        {/* Job Info */}
        <div className="p-6">
          <div className="mb-5">
            <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-bold text-blue-700">
              NEW JOB
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-800">
              {job.postName}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Info
              title="Organization"
              value={job.organization}
            />

            <Info title="State" value={job.state} />

            <Info
              title="Qualification"
              value={job.qualification}
            />

            <Info title="Seats" value={job.seats} />

            <Info
              title="Start Date"
              value={job.startDate}
            />

            <Info
              title="Last Date"
              value={job.lastDate}
            />
          </div>

          <div className="mt-5 rounded-xl bg-red-50 p-4 border border-red-200">
            <p className="font-semibold text-red-700">
              ⏰ {job.status}
            </p>
          </div>
            <a target="_blank"
            className="mt-6 flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-white font-bold hover:bg-green-700"
          >
            Apply Now
          </a>

          <div className="mt-8 border-t pt-5 flex gap-3">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-white font-bold hover:bg-[#1da851]"
            >
              <Share2 size={18} />
              WhatsApp Share
            </button>

            <button
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-bold"
            >
              <Download size={18} />
              Download Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}