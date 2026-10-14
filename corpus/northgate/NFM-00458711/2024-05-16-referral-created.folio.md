---
folio: "0.1"
id: "01HY0YQSP05FGXP04V4H2Q649C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2024-05-16T10:00:00-05:00"
recorded: "2024-05-16T10:01:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this new patient of our practice, who has type 2 diabetes and essential hypertension. <ref id="referral">eGFR is 51 with UACR 384 mg/g. I am referring for CKD evaluation and management.</ref>

Please advise on workup and any changes to the current plan. The patient is aware of the referral. Records are available on request.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0410",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 51, UACR 384 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0410",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0410",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0410",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
