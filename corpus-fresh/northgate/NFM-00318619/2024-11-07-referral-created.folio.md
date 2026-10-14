---
folio: "0.1"
id: "01JC3TK2S0BQ5B9GQ06VQP3XZM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2024-11-07T11:25:00-06:00"
recorded: "2024-11-07T11:26:12-06:00"
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

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension, followed here in primary care.

<ref id="referral">Most recent eGFR is 50 and UACR is 339 mg/g. Requesting CKD evaluation and management.</ref>

BP was 123/75 at today's visit. Recent labs are in the shared record. Please send your recommendations after the visit and call with any questions.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1764",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 339 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
