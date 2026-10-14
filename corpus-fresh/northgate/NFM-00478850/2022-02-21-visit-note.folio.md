---
folio: "0.1"
id: "01FWFF2EM09R3HA6FNCT3YQQK4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2022-02-21T13:45:00-06:00"
recorded: "2022-02-21T19:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new symptoms.
BP 129/78, pulse 75, wt 163 lb.
eGFR 69, K 4.4, UACR 11 mg/g, A1c 8%, LDL 57 mg/dL today.
A1c a bit up. Reviewed diet with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022137",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022137",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-022137",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
