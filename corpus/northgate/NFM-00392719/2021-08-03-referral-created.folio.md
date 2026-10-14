---
folio: "0.1"
id: "01FC66GQX0ZK3KFXNQJ7EA67P6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-08-03T09:25:00-05:00"
recorded: "2021-08-03T09:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pleasant patient with CKD stage 3b, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 43 and UACR 248 mg/g today; requesting CKD evaluation and management.</ref>

BP in clinic was 141/87, repeat 136/86. A1c 7.9%, K 4.5. Kidney function has been stable around this level for some time, with persistent albuminuria.

Please send recommendations to our office. Thank you.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1560",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 248 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1560",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1560",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1560",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
