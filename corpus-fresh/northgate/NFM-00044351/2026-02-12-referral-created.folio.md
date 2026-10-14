---
folio: "0.1"
id: "01KH9QYDQ0JVC2PQ9DTFQ21MYP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2026-02-12T14:15:00-06:00"
recorded: "2026-02-12T14:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with Type 2 diabetes and essential hypertension. <ref id="referral">Referral for CKD evaluation and management: chronic kidney disease stage 3a, eGFR 51 and UACR 28 mg/g.</ref>

Kidney function has drifted down over the past year. BP has been at goal. We would appreciate your recommendations on workup and management.

Please call with any questions.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0261",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 51, UACR 28 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0261",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0261",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0261",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
