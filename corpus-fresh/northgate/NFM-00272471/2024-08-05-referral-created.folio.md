---
folio: "0.1"
id: "01J4HQSQY0KV9TSTY84W4X5QWZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2024-08-05T12:00:00-05:00"
recorded: "2024-08-05T12:01:12-05:00"
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

Thank you for seeing this pt with type 2 diabetes, essential hypertension and stage 3a CKD. <ref id="referral">Most recent eGFR is 55 with UACR 347 mg/g; I am asking for CKD evaluation and management.</ref>

eGFR has drifted down slowly over the past year or two, and albuminuria has been present on prior checks. BP and A1c have been reasonably controlled in clinic. Pt is aware of the referral and agrees.

Please send your recommendations after the visit and I will continue routine care here.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1682",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 55, UACR 347 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1682",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1682",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1682",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
