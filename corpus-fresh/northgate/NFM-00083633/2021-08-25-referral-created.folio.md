---
folio: "0.1"
id: "01FDZ3V6Z0N4GJ9HAQ8J0XBSTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2021-08-25T11:55:00-05:00"
recorded: "2021-08-25T11:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this pt, who has chronic kidney disease stage 3a along with type 2 diabetes and essential hypertension. <ref id="referral">Recent eGFR is 59 and UACR is 263 mg/g; I am asking for CKD evaluation and management.</ref> Blood pressure has been above goal and we have been adjusting treatment. Kidney function has been stable around this level over the past few visits, with albuminuria that has been rising. Please advise on further workup and on how best to protect kidney function. I will continue to see the pt for diabetes and blood pressure care and am glad to share any records you need.

Thank you,
Dr. Khan, Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1759",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 59, UACR 263 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1759",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1759",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1759",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
