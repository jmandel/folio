---
folio: "0.1"
id: "01FWHFG760QW8FYZ646RG3B0JB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00098174"
effective: "2022-02-22T10:40:00-06:00"
recorded: "2022-02-22T13:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Reviewed history with pt.

BP 126/78, pulse 67, wt 193 lb.

Labs 2/19: eGFR 62, K 4.5, UACR 65 mg/g, A1c 7.3%, LDL 68 mg/dL.

Will recheck labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022255",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022255",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
