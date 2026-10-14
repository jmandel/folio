---
folio: "0.1"
id: "01G5M9YKW0YN2F6BV3XS5VNQW3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2022-06-15T08:45:00-05:00"
recorded: "2022-06-15T13:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 116/69, pulse 83, wt 217 lb.
Labs today: eGFR 38, K 5, UACR 148 mg/g, A1c 7.5%, LDL 129.
Kidney function reduced with albuminuria, nephrology referral placed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-061593",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-061593",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-061593",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-061593",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
