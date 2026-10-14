---
folio: "0.1"
id: "01KQSV32J01HGE25EW3DBZWSJY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2026-05-04T10:52:00-05:00"
recorded: "2026-05-04T10:53:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

<ref id="referral">Referring this pt for nephrology review of declining eGFR and albuminuria, with a prior SGLT2 inhibitor euglycemic DKA. Would value your opinion on whether re-challenge is reasonable.</ref>

eGFR was 41 on 2/9, down from 54 on 2/7/22. UACR 320 mg/g on 2/9. Empagliflozin 10 mg daily was stopped after the euglycemic diabetic ketoacidosis and is listed as an adverse reaction. Currently on losartan 100 mg daily.

Thank you for seeing this pt.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0884",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR decline, albuminuria, prior SGLT2i euDKA - re-challenge?",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0884",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0884",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0884",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
