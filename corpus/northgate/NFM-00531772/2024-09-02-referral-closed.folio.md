---
folio: "0.1"
id: "01J6SWMSR0P2XDVBXYVMNJTAV3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-09-02T12:30:00-05:00"
recorded: "2024-09-02T12:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0528",
    "action": "closed",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 37, UACR 187 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0528",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0528",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
