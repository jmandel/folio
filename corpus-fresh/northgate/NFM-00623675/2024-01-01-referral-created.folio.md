---
folio: "0.1"
id: "01HK3E4PB0Z5T230BKCX8V6GZK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2024-01-01T15:15:00-06:00"
recorded: "2024-01-01T15:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this pt with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Recent eGFR 47 and UACR 69 mg/g; requesting CKD evaluation and management.</ref>

Pt was recently hospitalized with acute kidney injury. Please advise on further work-up and ongoing care. I'm happy to continue BP and diabetes management here in the meantime.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0960",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 69 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0960",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0960",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0960",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
