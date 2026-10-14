---
folio: "0.1"
id: "01JR8QF5F06KCW1HBXS27XEWER"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00826248"
effective: "2025-04-07T13:15:00-05:00"
recorded: "2025-04-07T13:16:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 46, UACR 17 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-1516",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 17 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1516",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1516",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
