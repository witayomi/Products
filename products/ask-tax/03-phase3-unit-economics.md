# Phase 3: unit economics gate

Agent 3 output. All figures are modelled, not measured. They are assumptions with stated inputs, to be replaced by real numbers by day 14.

**Gate: upfront cash collected must be at least 2x (CAC + fulfilment cost).**

---

## 3.1 Input assumptions

| Input | Value | Basis |
|---|---|---|
| CPM, professional female audience, US | $22 | Typical range $18 to $30 for this demo and vertical |
| CTR (link) | 1.4% | Below the 2.0% target. Conservative on purpose |
| CPC | $1.57 | Derived |
| Landing to checkout, cold, direct to cart at $697 | 0.6% | Direct-to-cart at this price is hard. Modelled pessimistically |
| Payment processing | 3.0% | Standard |
| Platform, hosting, calculator, email | $6 per unit | Amortised |
| Support | $8 per unit | Modelled at 0.2 tickets per buyer |
| Refund rate | 8% | Applied to cash collected, not ignored |

---

## 3.2 Scenario models

| Model | Price | CAC | Fulfilment | Cash after 8% refunds | Ratio | Tier | Decision |
|---|---|---|---|---|---|---|---|
| A. Self-serve direct | $697 | $262 | $35 | $641 | **2.16x** | Tier 3 | **PASS, authorise spend** |
| B. Self-serve, discounted | $497 | $240 | $28 | $457 | 1.71x | Tier 2 | Fail, price increase required |
| C. Cohort tier | $1,497 | $560 | $120 | $1,377 | **2.03x** | Tier 3 | PASS, but thin |
| D. Employer-paid B2B | $12,000 | $2,800 | $1,400 | $12,000 | **2.86x** | Tier 3 | Pass, wrong channel for now |

**Model A is the launch model.** Note how tight the pass is: 2.16x against a 2.00x floor. There is 7% of headroom. A CAC overrun of $40 puts it in Tier 2.

---

## 3.3 Break-even and kill lines

At $697, cash collected after refunds is $641.

| Line | Value | Meaning |
|---|---|---|
| 2.0x threshold | CAC at or below $285 | Scale |
| 1.5x threshold | CAC $392 | Warning, refresh creative |
| 1.0x threshold | CAC $606 | Losing money, sunset clock starts |
| Absolute breakeven CAC | $606 | Includes fulfilment and refunds |

**Watch CAC, not ROAS.** ROAS hides the refund rate and the fulfilment cost, and both of those are what will kill this offer if it dies.

---

## 3.4 Sensitivity: what breaks the model

| Variable | Model A value | Breaks at | Comment |
|---|---|---|---|
| Landing conversion | 0.60% | below 0.28% | Most likely failure point. Test three page structures before scaling |
| CPC | $1.57 | above $3.63 | Realistic in Q4 when retail bids up inventory. Flight around it |
| Refund rate | 8% | above 20% | Refunds rise sharply if the ad creative attracts the grievance cohort. This is the commercial cost of the anti-men angle, expressed as a number |
| Price | $697 | below $585 | Do not discount. The offer has no room for a sale |

The refund row is worth reading twice. The entire argument against the resentment angle is contained in it: at a 20% refund rate this offer is dead regardless of how well the ads perform.

---

## 3.5 Price escalation protocol

Per the SOP: raise 20% every 4 sales while close rate holds at or above 20%.

| Step | Price | Trigger to advance |
|---|---|---|
| 0 | $697 | Launch |
| 1 | $836 | 4 sales at step 0 with conversion holding |
| 2 | $1,003 | 4 sales at step 1 |
| 3 | $1,204 | 4 sales at step 2 |
| Stop | when conversion falls below 20% of prior step | Hold at last passing price |

Expected resting price: $836 to $1,003. The ICP earns $145k median and is buying a $13,000 outcome. $697 is under-priced, and the only reason to open there is to buy clean CAC data fast.

---

## 3.6 Funnel KPI targets

| Metric | Target | Kill line |
|---|---|---|
| Ad CTR (link) | 1.4% or better | below 0.8% |
| Landing to checkout | 0.6% or better | below 0.35% |
| Checkout completion | 55% or better | below 40% |
| Refund rate, 30 days | below 8% | above 15% |
| Audit completion rate (leading indicator of refund) | above 70% | below 45% |

Audit completion is the early-warning metric. A buyer who never runs the calculator has not received the quick win, and she is the one who refunds on day 26.

---

## 3.7 Gate decision

```json
{
  "gate_decision": "PASS_AUTHORIZE_SPEND",
  "tier_classification": "TIER_3_PROMISED_LAND (>=2x)",
  "cash_collected_ratio": 2.16,
  "authorised_test_budget_usd": 2100,
  "test_window_days": 14,
  "condition": "Reassess at 14 days or $2,100 spend, whichever first. Model A headroom is 7 percent; treat any CAC above $285 as a pricing decision, not a creative decision."
}
```
