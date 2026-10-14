---
folio: "0.1"
id: "01J5BMXQC0KCA43AZ0YA81YZ3D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283863"
effective: "2024-08-15T13:30:00-05:00"
recorded: "2024-08-15T13:31:12-05:00"
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

Thank you for seeing this patient, who has type 2 diabetes and chronic kidney disease. I met them for the first time today to establish care.

<ref id="referral">I am referring for CKD evaluation and management: eGFR 33, UACR 9 mg/g.</ref>

Metformin was reduced to 500 mg BID today because of the eGFR. BP today was 128/72. Potassium on 8/13 was 4.4.

Please send your recommendations to our office. I am happy to answer any questions.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1074",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 33, UACR 9 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1074",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1074",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
