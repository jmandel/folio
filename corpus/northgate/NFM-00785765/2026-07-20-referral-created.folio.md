---
folio: "0.1"
id: "01KXZX0630NKBDHVS7C0GRMVV7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2026-07-20T08:55:00-05:00"
recorded: "2026-07-20T08:56:12-05:00"
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

Thank you for seeing this patient with Chronic kidney disease stage 3a, along with type 2 diabetes mellitus and essential hypertension. <ref id="referral">Today eGFR is 43 and UACR is 33 mg/g; I am asking for CKD evaluation and management.</ref>

Kidney function has declined gradually over the past couple of years. Potassium today is 4.3 and A1c is 7.5%. BP today was 133/81. I have adjusted metformin for the lower eGFR.

Please advise on further work-up and on how best to slow progression. I would be glad to share any records you need. Thank you for your help with this patient.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0485",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 33 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0485",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0485",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0485",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
