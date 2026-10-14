// Clinicians at the four organizations. Real-world facts (who works where), shared by all patients.
// The hero's clinicians come from truth/HERO.md and the Stage 0 examples; the rest are invented.
// NPIs are deliberately invalid (fail the Luhn check) so they never collide with real ones.

import type { Staff } from "./model.ts";

export const STAFF: Staff[] = [
  // A: Riverside Regional Hospital
  { id: "rrh:hale", source: "A", name: "Marcus Hale, MD", role: "Emergency physician", npi: "40217" },
  { id: "rrh:okonjo", source: "A", name: "Adaeze Okonjo, MD", role: "Emergency physician", npi: "40388" },
  { id: "rrh:lindqvist", source: "A", name: "Erik Lindqvist, DO", role: "Emergency physician", npi: "40561" },
  { id: "rrh:raman", source: "A", name: "Priya Raman, MD", role: "Hospitalist", npi: "31884" },
  { id: "rrh:castellano", source: "A", name: "Luis Castellano, MD", role: "Hospitalist", npi: "31920" },
  { id: "rrh:whitaker", source: "A", name: "Grace Whitaker, MD", role: "Hospitalist", npi: "32017" },
  { id: "rrh:vasquez", source: "A", name: "Elena Vasquez, MD", role: "Endocrinologist", npi: "22905" },
  { id: "rrh:baptiste", source: "A", name: "Jean Baptiste, MD", role: "Cardiologist", npi: "22714" },
  { id: "rrh:sato", source: "A", name: "Kenji Sato, MD", role: "Nephrologist", npi: "22850" },
  // B: Northgate Family Medicine
  { id: "ngf:treyes", source: "B", name: "Teresa Reyes, MD", role: "Primary care physician", short: "treyes", npi: "1999000017" },
  { id: "ngf:dkhan", source: "B", name: "Daniel Khan, MD", role: "Primary care physician", short: "dkhan", npi: "1999000025" },
  { id: "ngf:mbrennan", source: "B", name: "Moira Brennan, DO", role: "Primary care physician", short: "mbrennan", npi: "1999000033" },
  { id: "ngf:jpatel", source: "B", name: "Jaya Patel, NP", role: "Nurse practitioner", short: "jpatel", npi: "1999000058" },
  { id: "ngf:nortiz", source: "B", name: "Nina Ortiz, RN", role: "Registered nurse", short: "nortiz" },
  { id: "ngf:kfoster", source: "B", name: "Kim Foster, RN", role: "Registered nurse", short: "kfoster" },
  // C: Lakeview Labs & Kidney Care
  { id: "lv:marsh", source: "C", name: "Helen Marsh, MD", role: "Nephrologist", npi: "1999000042" },
  { id: "lv:adeyemi", source: "C", name: "Tobi Adeyemi, MD", role: "Nephrologist", npi: "1999000066" },
];

export const staffById = new Map(STAFF.map((s) => [s.id, s]));

export function staff(id: string): Staff {
  const s = staffById.get(id);
  if (!s) throw new Error(`unknown staff ${id}`);
  return s;
}

/** "Teresa Reyes, MD" -> { first: "Teresa", last: "Reyes", cred: "MD" } */
export function nameParts(s: Staff): { first: string; last: string; cred: string } {
  const [full, cred = ""] = s.name.split(", ");
  const parts = full.split(" ");
  return { first: parts[0], last: parts.slice(1).join(" "), cred };
}
