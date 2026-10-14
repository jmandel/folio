---
folio: "0.1"
id: "01HD4KJHB0X2F1JK1BZRJ0G7VM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2023-10-19T13:35:00-05:00"
recorded: "2023-10-19T13:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">I am referring this patient for CKD evaluation and management. Most recent eGFR is 56 with UACR 298 mg/g.</ref>

The patient has chronic kidney disease stage 3a and type 2 diabetes mellitus, followed here. Albuminuria has persisted on repeat testing. Please see the patient and advise on further workup and management. Recent labs are available on request.

Thank you for seeing this patient.

Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1952",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 56, UACR 298 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1952",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1952",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
