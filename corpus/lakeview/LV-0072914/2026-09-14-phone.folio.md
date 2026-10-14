---
folio: "0.1"
id: "01M2GXWGP8WVGMYR54Z9SVHEJR"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2026-09-14T16:20:00-05:00"
recorded: "2026-09-14T16:41:33-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Phone. K 5.8 this morning, 5.7 on same-day repeat (not hemolyzed). <ref id="hold_finerenone">Hold
finerenone</ref>, low-potassium diet reviewed. Repeat K in 2 weeks, then decide on restart.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-109377",
    "VISIT_TYPE": "TEL",
    "VISIT_AT": "2026-09-14T16:20:00-05:00",
    "PROVIDER_NPI": "1999000042"
  },
  "hold_finerenone": {
    "type": "MED_STATUS_HIST",
    "HIST_ID": "MH-5520193",
    "VISIT_ID": "NV-109377",
    "RX_ID": "RX-30418",
    "OLD_STATUS": 1,
    "NEW_STATUS": 3,
    "CHANGED_AT": "2026-09-14T16:31:00-05:00",
    "REASON_CODE": "LAB",
    "REVIEW_DATE": "2026-09-28",
    "COMMENT_TEXT": "K 5.8 / 5.7 confirmed"
  }
}
```
