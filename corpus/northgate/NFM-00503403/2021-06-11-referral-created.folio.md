---
folio: "0.1"
id: "01F7YEXCB01EZ7S69Q61QZEF6Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2021-06-11T16:15:00-05:00"
recorded: "2021-06-11T16:16:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with chronic kidney disease stage 3b, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 40 today and UACR 669 mg/g: please evaluate and manage CKD.</ref>

BP has been in the low 130s in the office. K 4.4 today. Diabetes is followed here, A1c 8.2% today.

Please send recommendations to our office. Pt is aware of the referral and agrees.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1038",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 669 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1038",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1038",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1038",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
