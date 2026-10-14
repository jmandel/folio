---
folio: "0.1"
id: "01H0GKF6E08K3KD11Y5CJX1GN1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2023-05-15T16:00:00-05:00"
recorded: "2023-05-15T16:01:12-05:00"
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

Thank you for seeing this patient with type 2 diabetes and CKD stage 3a. <ref id="referral">Today eGFR is 47 and UACR 15 mg/g; requesting CKD evaluation and management.</ref> Kidney function has been fairly stable but UACR has crept up since the first check at our practice. Potassium 4.5 today and A1c 6.8%. BP 115/68.

Please send your recommendations to our office. We will continue routine diabetes care here.

Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0616",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 15 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0616",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0616",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
