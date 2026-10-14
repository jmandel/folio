---
folio: "0.1"
id: "01HK2ZA2V0A4SFJ051SAF36V4H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2024-01-01T08:30:00-06:00"
recorded: "2024-01-01T10:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 122/72, pulse 79, wt 302 lb.
Labs 12/28/23: eGFR 88, K 4.3. Reviewed with pt.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010172",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010172",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
