---
folio: "0.1"
id: "01FCP9G7N0QE49E6FVG40TPTDQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2021-08-09T15:25:00-05:00"
recorded: "2021-08-09T15:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this pt with CKD stage 3b, type 2 diabetes and essential hypertension. <ref id="referral">Referring for CKD evaluation and management: eGFR 42 and UACR 230 mg/g.</ref>

Kidney function has been stable in the low 40s with persistent albuminuria. BP has been above goal and we adjusted therapy today. Please advise on further workup and management, and send recommendations to our office.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1253",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 230 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1253",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1253",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1253",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
