---
folio: "0.1"
id: "01GHM3MWX0QS21BWGEZM5YSMFW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-11T13:45:00-06:00"
recorded: "2022-11-11T13:46:12-06:00"
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

<ref id="referral">I am referring this patient for CKD evaluation and management. Latest eGFR 66, UACR 276 mg/g.</ref>

The patient has type 2 diabetes and essential hypertension, both followed here. Albuminuria has persisted on repeat testing while eGFR has stayed fairly stable. Recent labs are available in the shared record. Please see the patient and advise on further workup and management.

Thank you for seeing them.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1886",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 66, UACR 276 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1886",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1886",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1886",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
