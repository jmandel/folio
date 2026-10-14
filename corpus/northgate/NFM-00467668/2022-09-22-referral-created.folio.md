---
folio: "0.1"
id: "01GDKDFWQ0RCWMVVQ43JDY1GF2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00467668"
effective: "2022-09-22T15:15:00-05:00"
recorded: "2022-09-22T15:16:12-05:00"
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

Thank you for seeing this patient, who has type 2 diabetes and chronic kidney disease. I met them for the first time today to establish care. <ref id="referral">eGFR 42 and UACR 59 mg/g today. Please evaluate and help manage CKD.</ref>

Potassium was 4.1 today and blood pressure was 116/66. I changed the metformin dose today for the eGFR. Please let me know if you need any other records from us.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-0135",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 59 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0135",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0135",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
