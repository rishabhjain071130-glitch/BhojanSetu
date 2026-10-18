# 08 — Dashboards and Impact Metrics

## Dashboard principle
All numbers must come from database queries or clearly labelled demo seed data. No hardcoded success counters and no invented impact claims.

## Organizer dashboard
- Active listings
- Pending partner requests
- Assigned/collected/delivered listings
- Recent listings with deadlines and statuses
- Create listing CTA

## Partner dashboard
- Verification state
- Eligible available listings
- My pending requests
- Assigned pickups
- Items collected/delivered
- Clear explanation if partner is not yet verified

## Admin dashboard
- Pending partner verifications
- Open/expired/cancelled listings
- Pending requests and active assignments
- Aggregate reported quantities, where units are compatible
- Recent status events

## Impact metrics
Track:
- Number of food listings created
- Quantity offered (keep units separate if mixed)
- Quantity collected
- Completed deliveries
- Expired/cancelled listings
- Estimated quantity diverted from disposal only when the calculation and source data support it

Do not add kilograms, servings, meal boxes, and trays into one meaningless total. Group totals by unit or use one consistent quantity unit for the MVP.

Label metrics:
- “Reported quantity” when supplied by users.
- “Estimated waste diversion” only when calculation is explicit and explainable.
- “To be measured in pilot” for expected outcomes not yet measured.

## Charts
Use Recharts only if it adds clarity and data exists. A simple bar chart for listings by status or quantity by unit is acceptable. Include accessible labels and a fallback when data is empty. Never generate fake monthly growth lines.

## Empty state
If there are no records, show a message like:
“No activity yet. Create a listing or review demo records to see how BhojanSetu tracks recovery.”
Do not fill charts with invented data to make the screen look busy.
