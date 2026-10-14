---
folio: "0.1"
id: "01HS940XF09R46BS0Q3N2DKCJ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2024-03-18T08:10:00-05:00"
recorded: "2024-03-18T10:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 123/73, pulse 68, wt 154 lb.
eGFR 45, K 4.3, UACR 15 mg/g, A1c 7%, LDL 123 today.
Pt feels well, no new complaints.
Results reviewed. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031826",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031826",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031826",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-031826",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
