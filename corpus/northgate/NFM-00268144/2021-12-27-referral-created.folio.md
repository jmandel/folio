---
folio: "0.1"
id: "01FQYQDXV02H98S5BVSZ74QJC9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2021-12-27T13:55:00-06:00"
recorded: "2021-12-27T13:56:12-06:00"
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

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">eGFR is 50 and UACR 702 mg/g; we would appreciate your evaluation and management of the CKD.</ref>

BP and diabetes are being followed here and the pt remains under our care for routine needs. Recent labs are available in the shared record. Please send us your recommendations after the visit.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1654",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 702 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1654",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1654",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1654",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
