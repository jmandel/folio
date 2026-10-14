---
folio: "0.1"
id: "01FHX71670GQ53TT64Q0D6JCK4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00234334"
effective: "2021-10-13T11:15:00-05:00"
recorded: "2021-10-13T11:16:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this patient with chronic kidney disease, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 66 with UACR 629 mg/g; we would appreciate your evaluation and management of CKD.</ref>

Blood pressure remains above goal and diabetes is followed here. Recent labs are in the chart and we can send anything else you need.

Please send your recommendations back to us once the patient has been seen. Thank you for your help with their care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0761",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 66, UACR 629 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0761",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0761",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0761",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
