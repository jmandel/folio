---
folio: "0.1"
id: "01JV34TEE01KDTEXH4JDKDSQ91"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2025-05-12T16:00:00-05:00"
recorded: "2025-05-12T16:01:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleagues,

Thank you for seeing this pt with <ref id="referral">eGFR 44 and UACR 31 mg/g, for CKD evaluation and management.</ref>

Pt has CKD stage 3a, type 2 diabetes and essential hypertension. Kidney function has drifted down over the past year. Metformin was reduced today for the eGFR. Recent labs are in the chart. Please send your recommendations after the visit.

Thank you,
Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0347",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 31 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0347",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0347",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0347",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
