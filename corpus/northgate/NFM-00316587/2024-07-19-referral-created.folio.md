---
folio: "0.1"
id: "01J36B21M078KGAWCFSKRB2H4X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00316587"
effective: "2024-07-19T15:30:00-05:00"
recorded: "2024-07-19T15:31:12-05:00"
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

Thank you for seeing this pt, a new patient to our practice with type 2 diabetes and chronic kidney disease.

<ref id="referral">Labs on 7/15 show eGFR 36 and UACR 53 mg/g. I would appreciate your evaluation and management of his CKD.</ref>

BP today was 122/75 and potassium was 4.4. A1c was 7.8%. Please let me know if you need any further records or labs before the visit.

Thank you for your help with his care.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1910",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 36, UACR 53 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1910",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1910",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
