---
folio: "0.1"
id: "01KJWP55N05JPNNTDAA40R4HQ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2026-03-04T09:05:00-06:00"
recorded: "2026-03-04T09:06:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleague,

Thank you for seeing this pt with stage 3a CKD and type 2 diabetes. <ref id="referral">eGFR 43 and UACR 188 mg/g on 3/4. Please evaluate and help manage CKD.</ref> eGFR has drifted down over the past year and albuminuria has been rising. A1c is 7.1% today.

Pt is aware of the referral. Please send your recommendations to our office.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0215",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 188 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0215",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0215",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
