# 10 — Testing, QA, and Hackathon Demo

## Mandatory smoke tests
Run these before finalizing:
1. Install dependencies from documented commands.
2. Start server and verify `GET /api/health`.
3. Start frontend and verify page loads.
4. Register/login as organizer.
5. Create a valid listing.
6. Attempt an invalid listing and confirm useful validation.
7. Login as an unverified partner and confirm they cannot request.
8. Verify a partner through the admin path/seed workflow.
9. Login as verified partner and request an eligible listing.
10. Confirm a second request/approval cannot oversubscribe the same listing.
11. Approve/assign as authorized organizer/admin.
12. Record collection and delivery.
13. Confirm status history and impact values update.
14. Confirm expired listing cannot be requested.
15. Confirm unauthorized user cannot edit another user's listing or approve requests.
16. Test mobile layout at narrow width.
17. Run production build and lint/tests available in the repository.

## Test strategy
- Unit-test eligibility and matching rules.
- Test request/status transition logic.
- Test auth/role restrictions on critical endpoints.
- Keep tests focused on the highest-risk logic; do not spend the entire deadline building an elaborate test framework.
- If no automated test setup exists, add a short reproducible manual test checklist and run it.

## Suggested 2–3 minute demo
1. Landing page: explain the event-surplus coordination problem.
2. Organizer logs in and creates a sample listing, explicitly labelled demo.
3. Partner dashboard shows eligible listings and the deadline.
4. Rule-based matching explains why a partner fits; clarify it is not machine learning.
5. Organizer/admin approves request.
6. Partner records collection and delivery.
7. Impact dashboard shows metrics calculated from this demo workflow.
8. Mention food safety requires human inspection and applicable handling rules.

## Demo safety
- Use fictional sample event and partner names.
- Clearly label demo accounts and seed data.
- Never use a real organization's logo or imply partnership without permission.
- Do not claim actual meals were delivered or waste was prevented unless measured in a real pilot.
- Keep a short backup screen recording only if there is time after the live journey works.

## Final QA report
At completion, report:
- What works end-to-end
- What was tested and how
- Build/lint/test results
- Known limitations
- Any environment variables still needed
- Features not implemented
- Deployment status (only if verified)
