---
folio: "0.1"
id: "01GCF2RVQ0QSV9SRR8XJHXZ09T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2022-09-08T12:35:00-05:00"
recorded: "2022-09-08T12:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 65, UACR 244 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1129",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 65, UACR 244 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1129",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1129",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1129",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
