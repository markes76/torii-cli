# Aggregations Guide (Scraped from Torii Developer Docs)

> Source: https://developers.toriihq.com/reference/aggregations

## Why use aggregations?

Aggregations let you ask questions **about** your data instead of retrieving the full list of matching documents. Typical use-cases include:

- Building dashboards – e.g. "show the average renewal amount per month"
- Powering filters – e.g. "list the top 10 contract owners and the number of contracts per owner"
- Quick analytics – e.g. "count deals by stage and sum their values"

At request time you attach an `aggs` block whose shape is described below.

## High-level schema

```json
{
  "field": "index field to aggregate on",
  "aggregationType": "one of: metric | groupBy | date_range | date_histogram",
  "options": "type-specific options (see below)",
  "aggs": "(optional) nested aggregation – same schema recursively"
}
```

Common optional helpers (allowed everywhere unless stated otherwise):
- `size` – max number of buckets to return (default: index.max_terms, hard-limit 100)
- `sort` – how to order buckets. Shape varies by aggregation type.

## aggregationType: metric

Use when you need a single numeric answer (sum, average, …) instead of buckets.

| Field | Required? | Description |
|-------|-----------|-------------|
| `field` | ✔ | Numeric field to summarise |
| `aggregationType` | ✔ | metric |
| `options.metricFunction` | ✔ | `sum`, `avg`, `max`, `min` |
| `options.size` | ✖ | Number of buckets to keep (after sorting); max 100 |
| `options.sort` | ✖ | `{ field, aggFunc, order }` |

**Example** – average apps per user:

```json
{
  "field": "activeAppsCount",
  "aggregationType": "metric",
  "options": { "metricFunction": "avg" }
}
```

## aggregationType: groupBy

Buckets documents by the exact value of `field`. Optionally compute metrics per bucket.

| Field | Required? | Description |
|-------|-----------|-------------|
| `field` | ✔ | Keyword or numeric field whose unique values become bucket keys |
| `aggregationType` | ✔ | groupBy |
| `options.size` | ✖ | Number of buckets to keep; max 100 |
| `options.sort` | ✖ | Same structure as metric |
| `options.metricFunction` | ✖ | `total` (document count) plus metric functions |

**Example** – group apps by source:

```json
{
  "field": "sources",
  "aggregationType": "groupBy",
  "options": {
    "sort": { "order": "desc", "aggFunc": "total" },
    "size": 5
  }
}
```

## aggregationType: date_range

Splits documents into arbitrary, possibly overlapping, date ranges.

| Field | Required? | Description |
|-------|-----------|-------------|
| `field` | ✔ | Date field (RFC-3339 strings) |
| `aggregationType` | ✔ | date_range |
| `options.size` | ✖ | Number of buckets to keep; max 100 |
| `options.sort` | ✖ | `{ field, order }` – without aggFunc |

## aggregationType: date_histogram

Produces contiguous calendar buckets (week / month / quarter / year).

| Field | Required? | Description |
|-------|-----------|-------------|
| `field` | ✔ | Date field |
| `aggregationType` | ✔ | date_histogram |
| `options.dateHistogramOptions.datePeriod` | ✔ | One of `weekly`, `monthly`, `quarterly`, `yearly` |
| `options.dateHistogramOptions.hardBounds` | ✖ | `{ min, max }` – buckets outside are excluded |
| `options.dateHistogramOptions.extendedBounds` | ✖ | `{ min, max }` – create empty buckets beyond data range |
| `options.sort` | ✖ | `{ field, order }` – without aggFunc |
| `options.size` | ✖ | Number of buckets; max 100 |

**Example** – discovered apps over time:

```json
{
  "field": "creationTime",
  "aggregationType": "date_histogram",
  "options": {
    "dateHistogramOptions": { "datePeriod": "monthly" },
    "sort": { "field": "creationTime", "order": "asc" },
    "size": 40
  }
}
```

## Sorting syntax

```json
{
  "field": "bucket key or doc field to sort by",
  "order": "asc | desc",
  "aggFunc": "extra metric used for ordering (metric & groupBy only)"
}
```

## Nesting aggregations

Set `aggs` to another aggregation object to drill down. No hard depth limit, but keep it reasonable.

**Example** – app spend by category:

```json
{
  "field": "category",
  "aggregationType": "groupBy",
  "options": {
    "sort": { "field": "expenses", "order": "desc", "aggFunc": "sum" },
    "size": 5
  },
  "aggs": {
    "field": "expenses",
    "aggregationType": "metric",
    "options": { "metricFunction": "sum" }
  }
}
```

## Quick reference

- **metricFunction**: `sum`, `avg`, `max`, `min` (+ `total` inside `groupBy`)
- **aggregationType**: `metric`, `groupBy`, `date_range`, `date_histogram`
- **sort.order**: `asc` (ascending) or `desc` (descending)
- `size` hard-limited to **100**
