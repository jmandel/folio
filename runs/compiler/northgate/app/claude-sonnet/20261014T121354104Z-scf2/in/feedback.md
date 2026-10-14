# Feedback: counterexamples from expected outputs

Your mapper was run on other patients of this source and compared with the expected output. 18 rows were wrong
in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data
correctly in general, not only for these patients.

## Patient NFM-00258527, medications `escitalopram`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01EPPQQVVGMMXHDP5EFZBXB5ES"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258527"
effective: "2020-11-09T08:49:00-06:00"
recorded: "2020-11-09T08:49:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23418",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-110972"
  }
}
```
````
</details>

## Patient NFM-00258527, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01EPPRECJ0R86FE0DK24KJP72D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258527"
effective: "2020-11-09"
recorded: "2020-11-09T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 2020 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17508",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-110972"
  }
}
```
````
</details>

## Patient NFM-00212600, medications `sertraline`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01ES79424GKSSEB478TV26MXX1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2020-12-10T15:32:00-06:00"
recorded: "2020-12-10T15:32:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-45442",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 50 MG Oral Tablet", "rxnorm": "312941" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-121035"
  }
}
```
````
</details>

## Patient NFM-00212600, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01ES79Y810F3QJ3G55A7P785S4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2020-12-10"
recorded: "2020-12-10T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2015.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9862",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-121035"
  }
}
```
````
</details>

## Patient NFM-00591713, medications `escitalopram`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01DSZNM6TGTF6G46NWJGAS1WSP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2019-11-18T10:30:00-06:00"
recorded: "2019-11-18T10:30:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-35819",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2019-111855"
  }
}
```
````
</details>

## Patient NFM-00591713, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01DSZPJ1X082F0VNET9MA3H61V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2019-11-18"
recorded: "2019-11-18T10:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2019.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10192",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2019-111855"
  }
}
```
````
</details>

## Patient NFM-00112059, medications `sertraline`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01ECJ8EVCG1Y1WVRDTTB9D9SXY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00112059"
effective: "2020-07-06T09:28:00-05:00"
recorded: "2020-07-06T09:28:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11599",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 50 MG Oral Tablet", "rxnorm": "312941" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-070616"
  }
}
```
````
</details>

## Patient NFM-00112059, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01ECJ976P07P390YCEEWEZK1FB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00112059"
effective: "2020-07-06"
recorded: "2020-07-06T09:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2018.</ref> Added at first visit here, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18243",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-070616"
  }
}
```
````
</details>

## Patient NFM-00681589, medications `sertraline`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01GK2MWV4GRDTDJBZB402C2BAH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00681589"
effective: "2022-11-29T15:32:00-06:00"
recorded: "2022-11-29T15:32:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33069",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 50 MG Oral Tablet", "rxnorm": "312941" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2022-112938"
  }
}
```
````
</details>

## Patient NFM-00681589, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01GK2NQ110Z2Z2N3DBD7PJ63XX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00681589"
effective: "2022-11-29"
recorded: "2022-11-29T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2016.</ref> History per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10249",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2022-112938"
  }
}
```
````
</details>

## Patient NFM-00853558, medications `sertraline`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01DB324Q9GPJSGRASN1BZAAMCR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2019-05-17T09:11:00-05:00"
recorded: "2019-05-17T09:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21220",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 100 MG Oral Tablet", "rxnorm": "312938" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2019-051745"
  }
}
```
````
</details>

## Patient NFM-00853558, problems `depression`

- expected a row, mapper has none

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01DB32QJT0K0K8CCXF9VGC9S2P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2019-05-17"
recorded: "2019-05-17T09:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 4/2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14322",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2018-04-08", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2019-051745"
  }
}
```
````
</details>

## Patient NFM-00911754, medications `sertraline`

- expected a row, mapper has none

## Patient NFM-00911754, problems `depression`

- expected a row, mapper has none

## Patient NFM-00634370, medications `sertraline`

- expected a row, mapper has none

## Patient NFM-00634370, problems `depression`

- expected a row, mapper has none

## Patient NFM-00546774, medications `escitalopram`

- expected a row, mapper has none

## Patient NFM-00546774, problems `depression`

- expected a row, mapper has none
