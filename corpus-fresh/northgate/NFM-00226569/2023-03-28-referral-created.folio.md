---
folio: "0.1"
id: "01GWMD79H0RHYXAX533PC8XADN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2023-03-28T10:25:00-05:00"
recorded: "2023-03-28T10:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleagues,

I am writing about a patient with type 2 diabetes, essential hypertension and chronic kidney disease stage 3a. <ref id="referral">Most recent eGFR is 45 with UACR 51 mg/g; I would appreciate your evaluation and management of the CKD.</ref>

BP and glucose have been reasonably controlled in clinic. Please see the enclosed chart for labs and the current medication list.

Thank you for seeing this patient. Please send your recommendations back to me.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1674",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 51 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1674",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1674",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1674",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
