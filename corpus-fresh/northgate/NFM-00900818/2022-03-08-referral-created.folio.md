---
folio: "0.1"
id: "01FXNH2MX06ZK1YCSFDGXB9Z1M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2022-03-08T13:45:00-06:00"
recorded: "2022-03-08T13:46:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleagues,

Thank you for seeing this patient. <ref id="referral">Referring for CKD evaluation and management: eGFR 38, UACR 12 mg/g.</ref> The patient has chronic kidney disease stage 3b, type 2 diabetes and essential hypertension. Kidney function has been stable in the high 30s on recent checks.

Please advise on further workup and management. Recent labs are available on request.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-0457",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 38, UACR 12 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0457",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0457",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0457",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
