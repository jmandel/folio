---
folio: "0.1"
id: "01F8G6HEB0ZZKBQVMH9KRPRCEH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2021-06-18T13:35:00-05:00"
recorded: "2021-06-18T13:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with chronic kidney disease stage 3b, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 40 with UACR 14 mg/g; I would appreciate your evaluation and help managing the CKD.</ref>

Kidney function has been stable but below normal over the past year. Blood pressure has been somewhat above goal despite titration, and diabetes remains under active adjustment. Recent labs are available in the chart. Please send your recommendations and I will continue to see the pt here for routine care.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0567",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 14 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0567",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0567",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0567",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
