---
folio: "0.1"
id: "01HFF4GWV0HAFYK7CRNRT7QNDD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2023-11-17T11:15:00-06:00"
recorded: "2023-11-17T11:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleagues,

Thank you for seeing this pleasant patient with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Today eGFR is 53 and UACR is 275 mg/g. I am asking for CKD evaluation and management.</ref>

Kidney function has been fairly steady over the past couple of years, but albuminuria persists despite ongoing care here. Blood pressure was above goal at today's visit and K was 4.7. A1c today was 7.2%.

Please let me know if you need any other records. I would appreciate your recommendations.

Sincerely,
Moira Brennan, DO

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1910",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 53, UACR 275 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1910",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1910",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1910",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
