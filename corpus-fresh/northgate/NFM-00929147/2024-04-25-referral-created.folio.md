---
folio: "0.1"
id: "01HWAW3HQ0AEG582SE57QGVWKB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929147"
effective: "2024-04-25T09:55:00-05:00"
recorded: "2024-04-25T09:56:12-05:00"
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

Thank you for seeing this pt, who has type 2 diabetes and hypertension. <ref id="referral">Referring for CKD evaluation and management: eGFR 50, UACR 191 mg/g.</ref>

Kidney function and albuminuria have been stable to slightly worse on recent labs. Pt is aware of the referral and agreeable. Please send your recommendations to our office and we will continue routine primary care follow-up.

Sincerely,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1738",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 191 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1738",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1738",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1738",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
