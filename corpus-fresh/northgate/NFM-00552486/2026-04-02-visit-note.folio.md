---
folio: "0.1"
id: "01KN7S3YF011EE664TY3N5T76P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00552486"
effective: "2026-04-02T10:10:00-05:00"
recorded: "2026-04-02T14:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 146/86, repeat 144/85, pulse 83, wt 198 lb.
3/30 labs: eGFR 51, K 4.6, UACR 17 mg/g, A1c 7.9%.
BP and A1c above where we want them. Discussed with pt, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-040298",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-040298",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-040298",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
