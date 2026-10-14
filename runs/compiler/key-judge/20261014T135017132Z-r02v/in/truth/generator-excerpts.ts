  for (const s of saves) {
    const entries: MyMedPlan[] = [];
    for (const m of g.meds.filter((x) => x.setting !== "inpatient" && !x.history.some((h) => h.status === "entered-in-error"))) {
      const st = g.status(m, `${s}T12:00:00-05:00`);
      if (!st) continue;
      const d = drug(g.currentProduct(m, `${s}T12:00:00-05:00`));
      const stoppedRecently = st === "stopped" && m.history.some((h) => h.status === "stopped" && yrs(localDate(h.at), s) < 2);
      if (st !== "active" && st !== "held" && !stoppedRecently) continue;
      if (m.sensitive && r.chance(0.2)) continue;
      const typed = r.chance(0.3);
      entries.push({
        medId: m.id, name: typed ? (d.klass === "thiazide" ? "water pill" : d.brand ?? d.ingredient) : (d.brand && r.chance(0.4) ? d.brand : d.ingredient[0].toUpperCase() + d.ingredient.slice(1)),
        ...(typed ? {} : { picked: { rxnorm: d.scd ?? d.ingredientRx, display: d.scd ? d.scdName : d.ingredient } }),
        strengthText: d.form === "pen" ? (d.unit === "units/mL" ? "100 units/mL pen" : `${d.strength} mg pen`) : `${d.strength} mg`,
        howITakeIt: m.history.find((h) => h.takenAs)?.takenAs ?? (d.form === "pen" ? (d.klass === "glp1ra" ? "once a week, Sunday" : `${m.dose?.value ?? 10} units at bedtime`) : m.frequency === "BID" ? "morning and supper" : m.frequency === "QHS" ? "bedtime" : "morning"),
        status: st === "stopped" ? "stopped" : "taking",
        ...(st === "stopped" ? { stopped: localDate(m.history.filter((h) => h.status === "stopped").pop()!.at).slice(0, 7), note: m.history.filter((h) => h.status === "stopped").pop()!.reason } : {}),
        ...(st === "held" ? { note: "doctor told me to stop for now" } : {}),
      });
      m.visibility.P = m.visibility.P ?? "structured";
    }
    g.home.listSaves.push({ at: s, entries });
  }

// ---- Riverside ACE angioedema (population.ts 745-770)
      plan.push({ kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(lb) }, { kind: "lab", key: "trop_1", labIds: [trop.id] }, { kind: "lab", key: "trop_2", labIds: [trop2.id] });
      const acs = condA("acs", [{ at: edAt, status: "ruled-out", recordedBy: "A", label: "Chest pain, acute coronary syndrome ruled out", doc: "ed" }], { traps: ["T12"] });
      plan.push({ kind: "dx", conditionId: acs.id });
      const nf = nfFor("Acute coronary syndrome ruled out: two troponins <0.01 three hours apart and an ECG without ischemic changes.", "rule-out", [["ACS|acute coronary|ischemi|myocardial infarction|MI\\b"], ["ruled out|rule out|no evidence|negative|without"]], "negated", undefined, { traps: ["T12"] });
      facts.push(acs.id, trop.id, trop2.id, nf.id);
    } else {
      const lis = home(["acei"])[0] ?? g.startMed("lisinopril-20", at(`${addDays(date, -400)}T10:00`), "B", { vis: ax.homeVis });
      const ang = condA("angioedema", [{ at: edAt, status: "active", recordedBy: "A", label: "Angioedema, ACE inhibitor-associated", doc: "ed" }]);
      lis.history.push({ at: addMinutes(edAt, 30), status: "stopped", by: "A", stopReason: "adverse_reaction", reason: "angioedema", doc: "ed", instructions: "Do not take lisinopril or any ACE inhibitor again" });
      const steroid = inpatient("methylpred-iv", "methylprednisolone IV", "IV", "125 mg once", addMinutes(edAt, 25), addMinutes(edAt, 26));
      plan.push({ kind: "dx", conditionId: ang.id }, { kind: "inpatient-med", medId: steroid.id });
      const a = { id: g.uid("a"), substance: ingredientCoding("lisinopril-10")!, type: "allergy" as const, reaction: "angioedema of lips and tongue", reactions: ["Angioedema"], criticality: "high" as const,
        onset: date, recordedAt: at(`${weekday(addDays(date, r.int(4, 10)), r)}T${hhmm(r.int(9, 15), r.int(0, 59))}`), recordedBy: "B" as SourceKey, manifestation: ang.id, visibility: { B: "both" as const, A: "structured" as const } };
      if (ax.inB) {
        g.allergies.push(a);
        const e = g.bEncounter(addMinutes(a.recordedAt, -20), "ED follow-up: angioedema");
        e.documents[0].factIds.push(a.id, lis.id, ang.id);
        e.addressed = [{ conditionId: ang.id }];
        const alt = g.startMed("amlodipine-5", addMinutes(a.recordedAt, 3), "B", { reason: "replacing lisinopril (angioedema)", vis: ax.homeVis });
        e.documents[0].factIds.push(alt.id);
        lis.history.push({ at: addMinutes(a.recordedAt, 2), status: "stopped", by: "B", stopReason: "adverse_reaction", reason: "angioedema" });
      }
      g.aceiAvoid = true;
      facts.push(ang.id, lis.id);
    }
    docs.push({ key: "ed", kind: "ed-note", at: edAt, signedAt: edSigned, author: edDoc, factIds: facts, plan });
// ---- SGLT2i DKA (population.ts 880-900)
    if (met) resumeAt(met, "dc", addMinutes(discharged, 30));
    if (raas && k0 >= 5) resumeAt(raas, "dc", addMinutes(discharged, 30));
    const lastDraw = dayDraws[dayDraws.length - 1];
    dcPlan.push({ kind: "dx", conditionId: dka.id, rank: "principal" }, ...(panc ? [{ kind: "dx" as const, conditionId: panc.id, rank: "secondary" as const }] : []),
      { kind: "vitals", vitalId: dcV.id }, { kind: "lab", panel: "BMP", key: "bmp_dc", labIds: pnLabs[pnLabs.length - 1].filter((x) => !g.labs.find((l) => l.id === x && l.analyte === "bhb")) }, { kind: "allergies" }, { kind: "home-meds" },
      { kind: "follow-up", key: "fu_pcp", with: "Primary care (Northgate Family Medicine)", when: "within 1 week", purpose: `Decide whether to restart ${drug(sg.product).ingredient}; recheck basic metabolic panel` });
    void lastDraw;
    dcFacts.push(precFact.id, dka.id, sg.id, ...(met ? [met.id] : []), ...(raas && k0 >= 5 ? [raas.id] : []), ...(panc ? [panc.id] : []));
    g.dkaHistory = true;
    // Primary-care follow-up: stop the SGLT2i for good, record the adverse reaction (T18), maybe sick-day rules.
    if (ax.inB) {
      const fu = at(`${weekday(addDays(dcDate, r.int(5, 12)), r)}T${hhmm(r.int(8, 15), r.pick([0, 15, 30, 45]))}`);
      const e = g.bEncounter(fu, "Hosp f/u");
      e.billingExtra = [{ icd10: "Z09", display: "Follow-up exam after completed treatment" }];
      if (ax.c.dm) e.addressed = [{ conditionId: ax.c.dm.id }];
      g.set(sg, addMinutes(fu, 22), "B", "stopped", { stopReason: "adverse_reaction", reason: "euglycemic DKA" });
      const a = { id: g.uid("a"), substance: sg.rxnorm!, type: "adverse-reaction" as const, reaction: "euglycemic diabetic ketoacidosis", reactions: ["Diabetic ketoacidosis"], criticality: "high" as const,
        onset: date, recordedAt: addMinutes(fu, 25), recordedBy: "B" as SourceKey, manifestation: dka.id, visibility: { B: "both" as const, A: "structured" as const }, traps: ["T18"] };
      g.allergies.push(a);
      e.documents[0].factIds.push(dka.id, sg.id, a.id);
      const sv = g.vitalSet(addMinutes(fu, -10), "B", g.clinicSbp(localDate(fu)), 78);
