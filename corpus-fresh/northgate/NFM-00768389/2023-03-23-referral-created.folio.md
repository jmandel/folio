---
folio: "0.1"
id: "01GW7TYZF06CBFTJAWCV0J90KW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2023-03-23T13:15:00-05:00"
recorded: "2023-03-23T13:16:12-05:00"
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

Thank you for seeing this patient with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 46 and UACR 114 mg/g; referred for CKD evaluation and management.</ref> Kidney function has drifted down slowly over the past few years, and albuminuria has been rising. BP has been mildly above goal at recent visits. Please see them and advise on further workup and management. Recent labs are in the chart and I'm happy to send anything else you need.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0352",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 114 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0352",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0352",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0352",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
