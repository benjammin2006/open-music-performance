# @omp/schemas

The Open Music Performance record schemas, as AT Protocol lexicons, with one seeded fixture per v1 record type and a validator.

- `lexicons/org/openmusicperformance/*.json`: one lexicon per record type plus `defs.json` for shared objects.
- `fixtures/*.json`: the "Lincoln High School Bands, Winter Concert" seed from `docs/DEMO_PLAN.md`, one record per file.
- `npm run schema:check` (from the repo root): loads every lexicon, validates every fixture, and fails if any v1 record type has no valid fixture, any reserved type has a fixture, or any lexicon id disagrees with its path.
- `npm run schema:docs`: regenerates `docs/SCHEMA.md` from the lexicons.

Rules: every feature's objects land here before the feature ships (README principle 5). Reserved types (`dealMemo`, `advance`, `settlementSheet`, `payout`) hold their NSID and nothing else until the settlement wedge starts. The prefix `org.openmusicperformance` is a placeholder (see `defs.json`).

License: MIT.
