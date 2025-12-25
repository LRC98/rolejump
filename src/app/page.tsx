"use client";

import { useMemo, useState } from "react";

type MatchResult = {
  role: { slug: string; title: string };
  score: number; // 0-100
  matchedSkills: string[];
  missingTopSkills: string[];
};

// A tiny list of common starting roles (expand later)
const ROLE_OPTIONS = [
  "Actuary",
  "Accountant",
  "Business Analyst",
  "Data Analyst",
  "Financial Analyst",
  "Investment Analyst",
  "Risk Analyst",
  "Consultant",
  "Software Engineer",
  "Operations Analyst",
];

// Mocked recommendations for a few roles (you’ll replace with a real API later)
const MOCK_RESULTS: Record<string, MatchResult[]> = {
  "Actuary": [
    {
      role: { slug: "data-analyst", title: "Data Analyst" },
      score: 82,
      matchedSkills: ["statistics", "python", "excel", "risk modelling"],
      missingTopSkills: ["sql", "dashboarding (Power BI/Looker)", "stakeholder comms"],
    },
    {
      role: { slug: "investment-analyst", title: "Investment Analyst" },
      score: 74,
      matchedSkills: ["valuation basics", "excel", "quant mindset"],
      missingTopSkills: ["equity research process", "DCF depth", "report writing"],
    },
    {
      role: { slug: "risk-manager", title: "Financial Risk Manager" },
      score: 70,
      matchedSkills: ["risk modelling", "controls", "governance exposure"],
      missingTopSkills: ["reg frameworks (Basel/Solvency)", "credit risk", "ALM"],
    },
  ],
  "Business Analyst": [
    {
      role: { slug: "product-analyst", title: "Product Analyst" },
      score: 78,
      matchedSkills: ["requirements", "process mapping", "stakeholders"],
      missingTopSkills: ["A/B testing", "sql", "product metrics"],
    },
    {
      role: { slug: "data-analyst", title: "Data Analyst" },
      score: 72,
      matchedSkills: ["excel", "reporting", "communication"],
      missingTopSkills: ["sql", "python", "visualisation (Tableau/Power BI)"],
    },
  ],
  "Accountant": [
    {
      role: { slug: "financial-analyst", title: "Financial Analyst" },
      score: 80,
      matchedSkills: ["financial statements", "excel modelling"],
      missingTopSkills: ["valuation", "forecasting", "kpis"],
    },
    {
      role: { slug: "operations-analyst", title: "Operations Analyst" },
      score: 68,
      matchedSkills: ["process discipline", "controls", "excel"],
      missingTopSkills: ["sql", "automation", "ops metrics"],
    },
  ],
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // simple client-side suggestions
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROLE_OPTIONS.slice(0, 7);
    return ROLE_OPTIONS.filter((r) => r.toLowerCase().includes(q)).slice(0, 7);
  }, [query]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const role = selectedRole || query.trim();
    if (!role) {
      setError("Please enter your current job role.");
      return;
    }

    setSubmitting(true);
    try {
      // For now, use the mocked results.
      // Later you'll call your API:
      // const res = await fetch("/api/match", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ role }) });
      // const data = await res.json(); setResults(data.results);

      const mock = MOCK_RESULTS[role] || [];
      // if no exact match in mock, pick a close one
      const fallbackKey =
        ROLE_OPTIONS.find((opt) => opt.toLowerCase() === role.toLowerCase()) || null;
      const data = mock.length ? mock : fallbackKey ? (MOCK_RESULTS[fallbackKey] || []) : [];

      if (!data.length) {
        setError(
          "No matches yet for that role (in this demo). Try Actuary, Business Analyst, or Accountant."
        );
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChooseSuggestion(s: string) {
    setQuery(s);
    setSelectedRole(s);
    setResults(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your next role from your <span className="text-blue-600">current job</span>
        </h1>
        <p className="mt-3 text-gray-700 max-w-2xl">
          Tell us your current role and we’ll suggest nearby careers, show what you already match,
          and highlight the gaps to close—plus starter resources.
        </p>

        {/* Role Input */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
          <label className="block text-sm font-medium text-gray-700">
            Your current job title
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedRole(null);
              }}
              placeholder="e.g., Actuary, Accountant, Business Analyst"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              aria-controls="role-suggestions"
            />
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul
                id="role-suggestions"
                className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow"
                role="listbox"
              >
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                      onClick={() => handleChooseSuggestion(s)}
                      role="option"
                      aria-selected={selectedRole === s}
                    >
                      <span>{s}</span>
                      {selectedRole === s && (
                        <span className="text-xs text-blue-600">selected</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Finding matches..." : "Find Matches"}
            </button>
            <span className="text-xs text-gray-500">
              Tip: try **Actuary**, **Business Analyst**, or **Accountant** for demo results.
            </span>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </form>

        {/* Results */}
        {results && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold">Top matches</h2>
            {results.length === 0 && (
              <div className="rounded-xl border bg-white p-6 text-gray-600">
                No matches yet—try a different role.
              </div>
            )}
            {results.map((res) => (
              <article
                key={res.role.slug}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{res.role.title}</h3>
                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                    aria-label={`match score ${res.score} percent`}
                  >
                    Match: <strong className="ml-1">{res.score}%</strong>
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">You already have</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {res.matchedSkills.length > 0 ? (
                        res.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-xs"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No direct matches yet</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Top gaps to close</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {res.missingTopSkills.length > 0 ? (
                        res.missingTopSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-xs"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">You’re already strong here</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Placeholder resources */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-700">Start here</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li className="text-sm">
                      <a
                        className="text-blue-600 hover:underline"
                        href="https://www.coursera.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Course directory
                      </a>{" "}
                      <span className="text-xs text-gray-500">(course)</span>
                    </li>
                    <li className="text-sm">
                      <a
                        className="text-blue-600 hover:underline"
                        href="https://www.edx.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        edX programs
                      </a>{" "}
                      <span className="text-xs text-gray-500">(course)</span>
                    </li>
                    <li className="text-sm">
                      <a
                        className="text-blue-600 hover:underline"
                        href="https://www.cfainstitute.org/en/programs/cfa"
                        target="_blank"
                        rel="noreferrer"
                      >
                        CFA program overview
                      </a>{" "}
                      <span className="text-xs text-gray-500">(exam/membership)</span>
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


