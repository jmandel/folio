# Feedback: counterexamples from expected outputs

Your mapper was run on other patients of this source and compared with the expected output. 2567 rows were wrong
in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data
correctly in general, not only for these patients.

## Patient HL-U-13739, vitals `home@2026-07-02T07:12`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KWKBENB8E43SVKH2K9TP2D2H"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-07-02"
recorded: "2026-07-03T06:42:57Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-07-02T07:12",
    "systolic_mmhg": 122,
    "diastolic_mmhg": 72,
    "pulse_bpm": 66,
    "entry_method": "cuff_sync",
    "arm": "left"
  },
  "bp_2": {
    "type": "bp_reading",
    "measured_at": "2026-07-02T07:13",
    "systolic_mmhg": 122,
    "diastolic_mmhg": 72,
    "entry_method": "typed"
  }
}
```
````
</details>

## Patient HL-U-24456, medications `spironolactone`

- status: expected "held", got "active"

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KPE3AXXRBMFSHBHJ413MYSCH"
issuer: "did:web:homelog.example"
patient: "HL-U-24456"
effective: "2026-04-17"
recorded: "2026-04-17T16:10:43Z"
author:
  id: "urn:homelog:user:HL-U-24456"
  name: "Amina Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 17 April 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Coreg",
    "picked_from_search": { "rxnorm": "200032", "display": "carvedilol 12.5 MG Oral Tablet" },
    "strength_text": "12.5 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Furosemide",
    "picked_from_search": { "rxnorm": "313988", "display": "furosemide 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Aldactone",
    "picked_from_search": { "rxnorm": "313096", "display": "spironolactone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Jardiance",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Jardiance",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "stopped",
    "stopped": "2024-09",
    "kind": "prescription",
    "note": "euglycemic DKA"
  }
}
```
````
</details>

## Patient HL-U-13739, vitals `home@2026-07-14T08:24`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KXJ6ESQGEP2AGSK7SDTR9669"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-07-14"
recorded: "2026-07-15T06:12:06Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-07-14T08:24",
    "systolic_mmhg": 130,
    "diastolic_mmhg": 78,
    "pulse_bpm": 80,
    "entry_method": "cuff_sync",
    "arm": "left"
  }
}
```
````
</details>

## Patient HL-U-24456, medications `empagliflozin`

- status: expected "active", got "stopped"

## Patient HL-U-13739, vitals `home@2026-07-21T08:36`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KY44DA80FYTJ8TAPK01X1WCT"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-07-21"
recorded: "2026-07-22T05:22:40Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-07-21T08:36",
    "systolic_mmhg": 127,
    "diastolic_mmhg": 77,
    "pulse_bpm": 66,
    "entry_method": "cuff_sync",
    "arm": "right"
  }
}
```
````
</details>

## Patient HL-U-90257, medications `finerenone`

- status: expected "held", got "active"

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KME7C1DG612FV68345FQGNVE"
issuer: "did:web:homelog.example"
patient: "HL-U-90257"
effective: "2026-03-23"
recorded: "2026-03-23T20:49:50Z"
author:
  id: "urn:homelog:user:HL-U-90257"
  name: "Samuel Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 23 March 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "picked_from_search": { "rxnorm": "979480", "display": "losartan potassium 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Chlorthalidone",
    "picked_from_search": { "rxnorm": "197499", "display": "chlorthalidone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Finerenone",
    "picked_from_search": { "rxnorm": "2562816", "display": "finerenone 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  }
}
```
````
</details>

## Patient HL-U-13739, vitals `home@2026-08-02T08:46`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KZ30NZG859RG3FJKRQTC95FG"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-08-02"
recorded: "2026-08-03T05:13:57Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-02T08:46",
    "systolic_mmhg": 134,
    "diastolic_mmhg": 78,
    "pulse_bpm": 78,
    "entry_method": "cuff_sync",
    "arm": "right"
  }
}
```
````
</details>

## Patient HL-U-95968, medications `lisinopril`

- status: expected "held", got "active"

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01HQGPH0BRXV82GPBRT3VTJQS4"
issuer: "did:web:homelog.example"
patient: "HL-U-95968"
effective: "2024-02-25"
recorded: "2024-02-25T17:55:39Z"
author:
  id: "urn:homelog:user:HL-U-95968"
  name: "Miguel Lewis"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 25 February 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314077", "display": "lisinopril 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Farxiga",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
````
</details>

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01J8JR50HR0P8NGHJSF70830WB"
issuer: "did:web:homelog.example"
patient: "HL-U-95968"
effective: "2024-09-24"
recorded: "2024-09-24T19:29:23Z"
author:
  id: "urn:homelog:user:HL-U-95968"
  name: "Miguel Lewis"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HQGPH0BRXV82GPBRT3VTJQS4"
---
My Medicines, saved 24 September 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314077", "display": "lisinopril 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Lipitor",
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Farxiga",
    "picked_from_search": { "rxnorm": "1488569", "display": "dapagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
````
</details>

## Patient HL-U-13739, vitals `home@2026-08-08T07:23`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KZJRG6MGT5AVK6HN23V2T89C"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-08-08"
recorded: "2026-08-09T07:58:50Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-08T07:23",
    "systolic_mmhg": 136,
    "diastolic_mmhg": 80,
    "pulse_bpm": 83,
    "entry_method": "cuff_sync",
    "arm": "left"
  }
}
```
````
</details>

## Patient HL-U-88924, medications `finerenone`

- status: expected "held", got "active"

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KAH62G8GGTTKFTPVY99VJD31"
issuer: "did:web:homelog.example"
patient: "HL-U-88924"
effective: "2025-11-20"
recorded: "2025-11-20T17:47:54Z"
author:
  id: "urn:homelog:user:HL-U-88924"
  name: "John Jackson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 20 November 2025.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "197884", "display": "lisinopril 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Glucophage",
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Crestor",
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lexapro",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Chlorthalidone",
    "picked_from_search": { "rxnorm": "197499", "display": "chlorthalidone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Kerendia",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  }
}
```
````
</details>

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KMGBJT1R6EDKRFBZSAT76D05"
issuer: "did:web:homelog.example"
patient: "HL-U-88924"
effective: "2026-03-24"
recorded: "2026-03-24T16:41:55Z"
author:
  id: "urn:homelog:user:HL-U-88924"
  name: "John Jackson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KAH62G8GGTTKFTPVY99VJD31"
---
My Medicines, saved 24 March 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Zestril",
    "picked_from_search": { "rxnorm": "197884", "display": "lisinopril 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Rosuvastatin",
    "picked_from_search": { "rxnorm": "859751", "display": "rosuvastatin calcium 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Escitalopram",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Chlorthalidone",
    "picked_from_search": { "rxnorm": "197499", "display": "chlorthalidone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Norvasc",
    "picked_from_search": { "rxnorm": "197361", "display": "amlodipine 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Kerendia",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  }
}
```
````
</details>

## Patient HL-U-13739, vitals `home@2026-08-09T07:51`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KZNAKFW894AGG7130YPEPXE4"
issuer: "did:web:homelog.example"
patient: "HL-U-13739"
effective: "2026-08-09"
recorded: "2026-08-10T07:53:41Z"
author:
  id: "urn:homelog:user:HL-U-13739"
  name: "Lois Singh"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-09T07:51",
    "systolic_mmhg": 141,
    "diastolic_mmhg": 86,
    "pulse_bpm": 72,
    "entry_method": "cuff_sync",
    "arm": "left"
  }
}
```
````
</details>

## Patient HL-U-13739, vitals `home@2026-08-12T07:35`

- expected a row, mapper has none

## Patient HL-U-13739, vitals `home@2026-08-25T08:23`

- expected a row, mapper has none

## Patient HL-U-13739, vitals `home@2026-08-27T07:19`

- expected a row, mapper has none

## Patient HL-U-13739, vitals `home@2026-08-30T07:31`

- expected a row, mapper has none

## Patient HL-U-13739, vitals `home@2026-09-06T06:22`

- expected a row, mapper has none

## Patient HL-U-13739, vitals `home@2026-09-09T08:08`

- expected a row, mapper has none

## Patient HL-U-56098, vitals `home@2023-10-22T08:36`

- expected a row, mapper has none

## Patient HL-U-56098, vitals `home@2023-10-22T08:26`

- expected a row, mapper has none

## Patient HL-U-56098, vitals `home@2023-10-23T08:48`

- expected a row, mapper has none
