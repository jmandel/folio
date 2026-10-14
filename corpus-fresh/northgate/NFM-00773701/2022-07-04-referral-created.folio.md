---
folio: "0.1"
id: "01G75FDAH03QNXCKC6NR7F919H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2022-07-04T15:45:00-05:00"
recorded: "2022-07-04T15:46:12-05:00"
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

Thank you for seeing this pt with type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 65 and UACR 320 mg/g; requesting CKD evaluation and management.</ref>

BP has been mostly near goal and A1c is stable. Please send your recommendations back to me, and let me know if you need any further records before the visit.

Thank you for your help with their care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1811",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 65, UACR 320 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1811",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1811",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
