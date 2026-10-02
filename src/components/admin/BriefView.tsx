import { BRIEF_FIELDS } from "@/lib/portal/brief-fields";
import type { ProjectBrief } from "@/lib/db/types";

/**
 * What the client said about their business.
 *
 * Reads from the same field definitions the portal form uses, so a question
 * added there appears here automatically rather than being silently dropped.
 */
export function BriefView({ brief }: { brief: ProjectBrief | null }) {
  const answered = BRIEF_FIELDS.filter((f) => brief?.[f.name]?.trim());

  return (
    <section className="border-2 border-edge rounded-lg bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-navy-text">Client brief</h2>
        <span className="text-sm text-muted">
          {answered.length} of {BRIEF_FIELDS.length} answered
        </span>
      </div>

      {answered.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted">
          The client has not filled anything in yet. They can add to it from
          their portal until you lock the brief.
        </p>
      ) : (
        <dl className="grid gap-4">
          {answered.map((f) => (
            <div key={f.name} className="border-l-4 border-edge pl-4">
              <dt className="text-sm font-semibold text-navy-text">{f.label}</dt>
              <dd className="mt-1 leading-relaxed whitespace-pre-wrap text-muted">
                {brief?.[f.name]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
