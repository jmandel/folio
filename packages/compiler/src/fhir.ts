// US Core target: structural checks of the emitted resources against the elements uscore.d.ts requires,
// and a projection back to app-view rows so the same keys and scorer apply (medications and labs).

const LOINC_ANALYTE: Record<string, string> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "9318-7": "uacr", "14959-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "53060-9": "bhb", "2746-6": "ph", "2744-1": "ph",
  "2021-4": "pco2", "3040-3": "lipase", "10839-9": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "2089-1": "ldl", "18262-6": "ldl",
};

export interface FhirCheck { resources: number; conformant: number; problems: Record<string, number> }

export function checkUsCore(out: any, patientLocal: string): FhirCheck {
  const problems: Record<string, number> = {};
  const bad = (k: string) => { problems[k] = (problems[k] ?? 0) + 1; return false; };
  let resources = 0, conformant = 0;
  const ids = new Set<string>();
  for (const r of Array.isArray(out?.medicationRequests) ? out.medicationRequests : []) {
    resources++;
    const ok = [
      r?.resourceType === "MedicationRequest" || bad("MR.resourceType"),
      (typeof r?.id === "string" && /^[A-Za-z0-9\-.]{1,64}$/.test(r.id) && !ids.has(`MR/${r.id}`)) || bad("MR.id"),
      r?.meta?.profile?.[0] === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest" || bad("MR.meta.profile"),
      ["active", "on-hold", "stopped", "unknown"].includes(r?.status) || bad("MR.status"),
      ["order", "plan"].includes(r?.intent) || bad("MR.intent"),
      typeof r?.reportedBoolean === "boolean" || bad("MR.reportedBoolean"),
      (r?.medicationCodeableConcept && (r.medicationCodeableConcept.text || r.medicationCodeableConcept.coding?.length)) || bad("MR.medication"),
      r?.subject?.reference === `Patient/${patientLocal}` || bad("MR.subject"),
      (r?.dosageInstruction ?? []).every((d: any) => !d?.doseAndRate?.[0]?.doseQuantity || d.doseAndRate[0].doseQuantity.system === "http://unitsofmeasure.org") || bad("MR.dose.system"),
    ].every(Boolean);
    if (typeof r?.id === "string") ids.add(`MR/${r.id}`);
    if (ok) conformant++;
  }
  for (const o of Array.isArray(out?.observations) ? out.observations : []) {
    resources++;
    const ok = [
      o?.resourceType === "Observation" || bad("Obs.resourceType"),
      (typeof o?.id === "string" && /^[A-Za-z0-9\-.]{1,64}$/.test(o.id) && !ids.has(`Obs/${o.id}`)) || bad("Obs.id"),
      o?.meta?.profile?.[0] === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab" || bad("Obs.meta.profile"),
      ["final", "preliminary"].includes(o?.status) || bad("Obs.status"),
      o?.category?.[0]?.coding?.some((c: any) => c?.system === "http://terminology.hl7.org/CodeSystem/observation-category" && c?.code === "laboratory") || bad("Obs.category"),
      o?.code?.coding?.some((c: any) => c?.system === "http://loinc.org" && typeof c?.code === "string") || bad("Obs.code.loinc"),
      o?.subject?.reference === `Patient/${patientLocal}` || bad("Obs.subject"),
      (typeof o?.effectiveDateTime === "string" && !Number.isNaN(Date.parse(o.effectiveDateTime)) && /[+-]\d\d:\d\d$|Z$/.test(o.effectiveDateTime)) || bad("Obs.effectiveDateTime"),
      (typeof o?.valueQuantity?.value === "number" && o.valueQuantity.system === "http://unitsofmeasure.org" && typeof o.valueQuantity.code === "string") || bad("Obs.valueQuantity"),
    ].every(Boolean);
    if (typeof o?.id === "string") ids.add(`Obs/${o.id}`);
    if (ok) conformant++;
  }
  return { resources, conformant, problems };
}

const MR_STATUS: Record<string, string> = { active: "active", "on-hold": "held", stopped: "stopped", completed: "stopped", unknown: "unknown" };
const UCUM_DOSE: Record<string, string> = { mg: "mg", ug: "mcg", mcg: "mcg", "[iU]": "units", "[IU]": "units", mL: "mL", "{tbl}": "tablet" };

/** FHIR output -> app-view rows (medications, labs) for scoring with the per-source keys. */
export function projectUsCore(out: any): { medications: any[]; labs: any[]; problems: []; allergies: []; vitals: [] } {
  const medications = (Array.isArray(out?.medicationRequests) ? out.medicationRequests : []).map((r: any) => {
    const cc = r?.medicationCodeableConcept ?? {};
    const text: string = cc.text ?? cc.coding?.[0]?.display ?? "";
    const paren = text.match(/\(([^()]+)\)\s*$/)?.[1];
    const ingCoding = (cc.coding ?? []).find((c: any) => c?.display && /^[a-z][a-z ]+$/.test(c.display));
    const dq = r?.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity;
    return {
      ingredient: ingCoding?.display ?? paren, drug_name: text, status: MR_STATUS[r?.status] ?? r?.status,
      ...(dq ? { dose: { value: dq.value, unit: UCUM_DOSE[dq.code] ?? dq.unit } } : {}),
      frequency: r?.dosageInstruction?.[0]?.timing?.code?.text,
      stop_reason: [r?.statusReason].flat().filter(Boolean).flatMap((s: any) => s?.coding ?? []).find((c: any) => c?.system === "urn:folio:stop-reason")?.code,
      status_since: r?.status === "active" ? undefined : undefined,
      evidence: [],
    };
  });
  const labs = (Array.isArray(out?.observations) ? out.observations : []).map((o: any) => {
    const loinc = (o?.code?.coding ?? []).find((c: any) => c?.system === "http://loinc.org")?.code;
    const analyte = LOINC_ANALYTE[loinc] ?? String(o?.code?.text ?? "").toLowerCase();
    const q = o?.valueQuantity ?? {};
    return {
      analyte, value: q.value, ...(q.comparator ? { comparator: q.comparator } : {}), unit: q.code === "mL/min/{1.73_m2}" ? "mL/min/1.73m2" : q.code,
      collected: o?.effectiveDateTime, status: o?.status, egfr_equation: o?.method?.text, loinc, evidence: [],
    };
  });
  return { medications, labs, problems: [], allergies: [], vitals: [] };
}
