---
folio: "0.1"
id: "01H3AG7F70YJX129BFD3XRYCNY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00423020"
effective: "2023-06-19T13:55:00-05:00"
recorded: "2023-06-19T13:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this patient, who has stage 3a CKD along with type 2 diabetes and essential hypertension. <ref id="referral">eGFR 45, UACR 86 mg/g: CKD evaluation and management.</ref>

Kidney function and albuminuria have drifted the wrong way over the last couple of years despite reasonable BP and glucose control. We would appreciate your assessment and recommendations for ongoing management. Recent labs and visit notes are available in the chart.

Please send your findings back to us and let us know if you want any further testing before the visit. We will continue to follow BP and diabetes here.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0223",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 86 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0223",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0223",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0223",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
