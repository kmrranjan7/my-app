import { BadgeCheck, IdCard, Mail, Phone, UserRound, Wrench } from "lucide-react";

import { Badge, Card, GhostButton, SectionHeading } from "@/components/dashboard/ui";

type ProfileField = Readonly<{
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly status: "Verified" | "Pending";
  readonly icon: typeof UserRound;
}>;

const profileFields: ReadonlyArray<ProfileField> = [
  {
    id: "name",
    label: "Candidate Name",
    value: "Amit Kumar",
    status: "Verified",
    icon: UserRound,
  },
  {
    id: "email",
    label: "Email Address",
    value: "amit.kumar@example.com",
    status: "Verified",
    icon: Mail,
  },
  {
    id: "phone",
    label: "Mobile Number",
    value: "+91 98765 43210",
    status: "Pending",
    icon: Phone,
  },
  {
    id: "id-proof",
    label: "Primary ID",
    value: "Aadhaar • XXXX-XXXX-4321",
    status: "Verified",
    icon: IdCard,
  },
];

function statusVariant(status: ProfileField["status"]) {
  if (status === "Verified") {
    return "success" as const;
  }

  return "warning" as const;
}

export default function ProfileManagementPanel() {
  return (
    <Card className="p-4">
      <SectionHeading
        title="Profile Management"
        subtitle="Manage personal details, identity information, and account verification"
        action={<GhostButton label="Edit Profile" onClick={() => undefined} />}
      />

      <div className="mt-4 space-y-3">
        {profileFields.map((field) => (
          <article
            key={field.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                {field.label}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <field.icon size={14} aria-hidden="true" />
                {field.value}
              </p>
            </div>

            <Badge label={field.status} variant={statusVariant(field.status)} />
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-blue-200/70 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/35 dark:text-blue-300">
        <p className="inline-flex items-center gap-1.5 font-semibold">
          <Wrench size={13} aria-hidden="true" />
          Profile completion tips
        </p>
        <ul className="mt-2 space-y-1 text-[0.78rem]">
          <li className="inline-flex items-center gap-1.5">
            <BadgeCheck size={12} aria-hidden="true" />
            Keep your email and mobile number updated for OTP-based login.
          </li>
          <li className="inline-flex items-center gap-1.5">
            <BadgeCheck size={12} aria-hidden="true" />
            Ensure ID details match application records to avoid rejection.
          </li>
        </ul>
      </div>
    </Card>
  );
}
