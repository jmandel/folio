---
folio: "0.1"
id: "01KE0BC230NGV4SBABDWRMPV4E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2026-01-02T15:55:00-06:00"
recorded: "2026-01-02T15:56:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleague,

Thank you for seeing this patient with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 50 and UACR 147 mg/g at today's visit (1/2); referred for CKD evaluation and management.</ref>

BP today was 132/73 and K 4.4. A1c is 7%. Kidney function has drifted down slowly over the past couple of years while the albuminuria has risen.

Please send your recommendations to our office. Happy to answer any questions.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0166",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 147 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0166",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0166",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0166",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
