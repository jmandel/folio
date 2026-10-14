---
folio: "0.1"
id: "01JGCEAYR09G2ZHD5A7T0Z5DCW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230108"
effective: "2024-12-30T08:15:00-06:00"
recorded: "2024-12-30T12:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 115/71, pulse 73, wt 197 lb.

Labs today: eGFR 69, K 4.3, UACR 7 mg/g, A1c 7.4%.

Dry cough on lisinopril, so lisinopril stopped today. Losartan 50 mg daily started for the ACE inhibitor cough. Lisinopril intolerance (dry cough) entered on allergy list.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-123036",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-123036",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-123036",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
