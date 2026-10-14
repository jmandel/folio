---
folio: "0.1"
id: "01FMTG7A508QZ0D1S4BK7FYQRN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00980170"
effective: "2021-11-18T15:45:00-06:00"
recorded: "2021-11-18T15:46:12-06:00"
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

Thank you for seeing this pt with chronic kidney disease stage 3b and essential hypertension. <ref id="referral">eGFR 43 and UACR 111 mg/g today; referring for CKD evaluation and management.</ref>

BP was 131/77 at today's visit. We changed the antihypertensive today because of an ACE inhibitor cough. Please advise on further workup and management of the kidney disease.

Thank you,
Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1770",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 111 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1770",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1770",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
