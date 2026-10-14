---
folio: "0.1"
id: "01G8BY7A30J38YD8VDR7FPXQGC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2022-07-19T14:15:00-05:00"
recorded: "2022-07-19T14:16:12-05:00"
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

<ref id="referral">I would appreciate your evaluation and management of this patient with chronic kidney disease. Most recent eGFR is 45 with UACR 332 mg/g.</ref>

The patient has stage 3a CKD and type 2 diabetes. Kidney function has been slowly declining and albuminuria has persisted over several visits. Metformin was adjusted today for the eGFR. Recent labs are available in the chart.

Thank you for seeing this patient. Please call with any questions.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-0252",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 332 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0252",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0252",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
