# Scene 6 mock-ups

Three static screens for the last thirty seconds of the demo (docs/DEMO_PLAN.md, scene 6): what the settlement wedge will look like for a club show. They are **mock-ups, not built**, and each image says so in its purple banner. The records they depict (`dealMemo`, `settlementSheet`, `payout`) are reserved in the schema and not implemented (docs/SCOPE_CHARTER.md section 3).

| File | Shows |
|---|---|
| `1-deal-memo.png` | The agreed terms between a pledge venue and a touring act: versus deal, expense cap, 0% merch cut, hospitality, cancellation, buyer-data clause, both signatures |
| `2-settlement-sheet.png` | Show-night settlement computed from the deal memo, ticket sales and door scans; the 70/30 split beating the guarantee; reconciled against the door; signed and locked |
| `3-payout-split.png` | Where the money goes after signing, and the plain statement that automatic splits need an operator entity and a counsel opinion first (charter section 6) |

The numbers are fictional and internally consistent across the three: gross $3,543.00; net box office $3,375.55 after refunds and card processing; $3,055.55 after $320 of receipted expenses; artist 70% = $2,138.89 (beats the $500 guarantee); venue 30% = $916.66 less a $150 support fee = $766.66; door cash $738.00 to deposit.

Regenerate after editing the HTML: `./render.sh` (uses the installed Google Chrome in headless mode).
