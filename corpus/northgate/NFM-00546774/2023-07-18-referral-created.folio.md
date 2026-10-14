---
folio: "0.1"
id: "01H5N6AM50J0DJHCYA329PGYZY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00546774"
effective: "2023-07-18T14:05:00-05:00"
recorded: "2023-07-18T14:06:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt, who established care with me today. <ref id="referral">eGFR 61 and UACR 518 mg/g today; referring for CKD evaluation and management.</ref>

Pt has chronic kidney disease along with type 2 diabetes and essential hypertension, both long-standing by history. Kidney function is mildly reduced, but the degree of albuminuria is what concerns me. I would appreciate your help with workup and with a plan for protecting kidney function going forward.

Pt is aware of the referral and agrees. Please send your recommendations to our office and call with any questions.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0967",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 61, UACR 518 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0967",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0967",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0967",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
