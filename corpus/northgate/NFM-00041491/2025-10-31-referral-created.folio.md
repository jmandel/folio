---
folio: "0.1"
id: "01K8XP10N0YPXWJK6SD8ZKSPMW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00041491"
effective: "2025-10-31T12:45:00-05:00"
recorded: "2025-10-31T12:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">I am referring this patient for evaluation and management of chronic kidney disease. Most recent eGFR is 52 with UACR 10 mg/g.</ref>

The patient has CKD stage 3a, type 2 diabetes and essential hypertension. Kidney function has been stable on serial checks in our office. We would appreciate your input on further workup and long-term management.

Thank you for seeing this patient. Please send your recommendations to our office.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0242",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 52, UACR 10 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0242",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0242",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0242",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
