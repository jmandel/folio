---
folio: "0.1"
id: "01HAYSZAA04Q0QZ335G4233296"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2023-09-22T11:00:00-05:00"
recorded: "2023-09-22T11:01:12-05:00"
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

Thank you for seeing this patient, who has chronic kidney disease along with type 2 diabetes and essential hypertension. <ref id="referral">eGFR 47 and UACR 88 mg/g today. Please evaluate and manage CKD.</ref>

Diabetes and blood pressure are being followed here in primary care. I would appreciate your recommendations on workup and on how best to protect kidney function going forward. Please send your notes back to me after the visit.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1168",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 88 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1168",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1168",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1168",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
