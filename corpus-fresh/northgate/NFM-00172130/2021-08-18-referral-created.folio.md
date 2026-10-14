---
folio: "0.1"
id: "01FDCV1TV0PQE9SDRGHQ6RSDFC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2021-08-18T09:35:00-05:00"
recorded: "2021-08-18T09:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleagues,

<ref id="referral">I am referring this patient for CKD evaluation and management; eGFR 44 and UACR 90 mg/g today.</ref>

Pt has chronic kidney disease stage 3b with type 2 diabetes and essential hypertension. Kidney function has been stable around this level since late 2020, and albuminuria is persistent. BP was above goal at today's visit. A1c is 6.9%.

Thank you for seeing this pt. Please send your recommendations and I will continue to follow in primary care.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0398",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 90 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0398",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0398",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0398",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
