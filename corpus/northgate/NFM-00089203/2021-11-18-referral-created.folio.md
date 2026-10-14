---
folio: "0.1"
id: "01FMSR68S00NWMB18H22Z6DXPY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2021-11-18T08:45:00-06:00"
recorded: "2021-11-18T08:46:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleague,

Thank you for seeing this patient of mine with chronic kidney disease and essential hypertension. <ref id="referral">Most recent eGFR 65 and UACR 669 mg/g; I would appreciate your CKD evaluation and management.</ref>

BP has been above goal and we are adjusting treatment here. Please let me know if you want any further labs before the visit.

Thank you for your help with their care.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0926",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 65, UACR 669 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0926",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0926",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
