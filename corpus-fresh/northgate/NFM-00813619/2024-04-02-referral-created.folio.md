---
folio: "0.1"
id: "01HTG6DFT0S1QFDGGHF2RF9A4F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813619"
effective: "2024-04-02T15:00:00-05:00"
recorded: "2024-04-02T15:01:12-05:00"
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

Thank you for seeing this patient, who is new to our practice. They have DM2 and essential HTN. <ref id="referral">Labs on 3/30 show eGFR 42 and UACR 54 mg/g. Requesting CKD evaluation and management.</ref>

I have adjusted metformin for the reduced eGFR. Please advise on further workup and any changes to their regimen. Recent labs are available on request, and we will continue primary care follow-up.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1018",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 54 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1018",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1018",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1018",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
