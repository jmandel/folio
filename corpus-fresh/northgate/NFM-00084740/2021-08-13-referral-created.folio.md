---
folio: "0.1"
id: "01FD02G3F0M634EJWP9T1CRQQA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2021-08-13T10:35:00-05:00"
recorded: "2021-08-13T10:36:12-05:00"
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

Thank you for seeing this patient with type 2 diabetes and essential hypertension. <ref id="referral">Labs today show eGFR 65 and UACR 368 mg/g, and I would appreciate your evaluation and management of chronic kidney disease.</ref>

Albuminuria has been rising over the last few visits despite ongoing BP treatment. Blood pressure was 146/80 today with repeat 140/76, and K was 4.3. A1c was 7.3%.

Please let me know if you need further records. Thank you for your help with their care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0149",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 65, UACR 368 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0149",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0149",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0149",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
