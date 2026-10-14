---
folio: "0.1"
id: "01HWB2Z8Z03Y3PAYVN7X37S80S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00805315"
effective: "2024-04-25T11:55:00-05:00"
recorded: "2024-04-25T11:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this new patient of our practice. <ref id="referral">eGFR 43 and UACR 272 mg/g on labs from 4/23; referred for CKD evaluation and management.</ref>

The patient also has essential hypertension, and BP in the office today was 159/103, repeat 157/101. Potassium was 4.8 on 4/23. We would appreciate your help with workup, staging and recommendations for slowing progression and for BP management.

I will continue to see the patient here for primary care and will forward any further results. Please call with questions.

Sincerely,
Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0909",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 272 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0909",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0909",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
