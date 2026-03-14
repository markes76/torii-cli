# Output Formats

## Overview

The Torii CLI supports multiple output formats to suit different use cases: piping to other tools, human-readable tables, and spreadsheet export.

---

## Output Format Options

| Format | Flag | Description |
|--------|------|-------------|
| JSON | `-o json` (default when piping) | Full API response; ideal for scripting |
| Table | `-o table` (default for TTY) | Human-readable formatted table |
| CSV | `-o csv` | Comma-separated for spreadsheet import |

---

## Default Behavior

- **TTY (interactive):** Default to `table` for readability
- **Non-TTY (piping):** Default to `json` for tool chaining

```bash
# Interactive: table
torii users list

# Piped: json
torii users list | jq '.users[].email'
```

---

## --fields Flag

Control which columns/fields appear in table and CSV output:

```bash
torii users list --fields id,email,firstName,lastName,lifecycleStatus
torii apps list --fields id,name,state,category
```

- For **table:** Only show specified columns
- For **CSV:** Only include specified columns
- For **JSON:** Optionally filter response (or pass through full response; `--fields` may apply to table/csv only)

---

## JSON Output

- Emits the raw API response structure
- Preserves `count`, `total`, `nextCursor`, and nested objects
- Enables: `torii users list | jq '.users[].email'`

---

## Table Output

- Formatted with aligned columns
- Column order follows `--fields` or a sensible default
- Truncate long values with ellipsis; full value on `--verbose` or when piping to file

---

## CSV Output

- Comma-separated; escape commas and quotes in values
- Header row by default
- `--no-header` for piping into other tools that expect headerless CSV

```bash
torii users list -o csv --no-header | awk -F',' '{print $2}'
```

---

## jq Integration

JSON output is designed for jq:

```bash
torii users list | jq '.users[].email'
torii apps list | jq '.apps[] | {id, name, state}'
torii contracts list | jq '.contracts | length'
```

---

## Error Output

- Errors always go to stderr
- Success output goes to stdout
- Enables: `torii users list -o json > users.json 2> errors.log`
