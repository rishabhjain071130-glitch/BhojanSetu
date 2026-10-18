# 02 — Brand, UI, and UX Specification

## Brand
BhojanSetu is a trustworthy, community-focused food recovery platform. The interface should feel modern and credible, not childish, overly corporate, or like a generic admin template.

Tagline: **Good food deserves a destination, not a dustbin.**

## Visual direction
- Main palette: deep leafy green, warm cream/off-white, restrained maroon/rust accent, charcoal text.
- Use the palette consistently; check contrast for readable text.
- Use clean sans-serif typography, clear hierarchy, generous spacing, and concise labels.
- Use food/event/community imagery only when legally available and genuinely relevant. If no real image assets exist, use tasteful abstract shapes/icons instead of fake screenshots.
- Use Lucide icons if already installed; do not install several icon packs.
- Avoid excessive gradients, glassmorphism, animated counters, and decorative clutter.
- Mobile-first responsive layout. No horizontal overflow at 360px width.
- Use reusable components: Button, Input, Select, Textarea, Badge, Card, Alert, Modal/Drawer if needed, LoadingState, EmptyState, ErrorState.

## Landing page content
1. Navbar: BhojanSetu logo/wordmark, How it works, Food safety, Impact, Sign in, Get started.
2. Hero:
   - Heading: “Turn event surplus into community support.”
   - Supporting copy: “Coordinate suitable surplus food from events with verified recovery partners, with deadlines, capacity checks, and traceable hand-offs.”
   - Main CTA: “List surplus food”
   - Secondary CTA: “Explore how it works”
   - Small trust note: “Coordination platform only. Human inspection and applicable food-safety requirements remain essential.”
3. Three-step process: List surplus → Match a suitable partner → Track collection and delivery.
4. Role cards: Organizers & Caterers, Recovery Partners, Coordinators/Admins.
5. How matching works: eligibility, partner verification, capacity, urgency/deadline, distance only when reliable.
6. Food-safety section: preparation time, storage conditions, collection deadline, physical inspection, responsible handling.
7. Impact section: explain what the platform can measure; do not show invented totals.
8. Footer: project name, tagline, demo disclaimer, navigation.

## App shell
- Sidebar or top navigation based on role.
- Always show current role and demo/account state.
- Clear page title and one-sentence context.
- Primary action is visually obvious.
- Use status badges with text, not color alone.
- Tables become cards or horizontally manageable views on small screens.
- Show dates/times in a consistent local format and handle invalid/missing dates safely.

## Key screen requirements
### Organizer dashboard
- Summary: active listings, pending requests, collected/completed items.
- Recent listings with status and deadline.
- CTA to create listing.
- Values derived from API.

### Create listing
- Group fields logically: event, food, quantity, preparation/handling, collection.
- Inline validation and server error display.
- Warn if deadline is in the past.
- Food safety reminder next to relevant fields.
- Prevent duplicate submissions while saving.

### Partner browse
- Eligible listings only by default.
- Filters for food category, deadline, and area.
- Show quantity, preparation time, deadline, storage notes, approximate location, and current status.
- Do not expose personal phone/email publicly unless needed and authorized.

### Listing detail
- Clear eligibility/deadline state.
- Request quantity input bounded by available quantity and partner capacity.
- If expired, cancelled, or unavailable, disable request with a reason.

### Admin review
- Partner details and submitted verification information.
- Approve/reject action with confirmation and reason.
- Never imply external legal verification occurred unless it actually did.

### Impact dashboard
- Use actual stored records.
- Label totals as “reported” or “estimated” where appropriate.
- Distinguish offered quantity from collected quantity.
- No arbitrary chart data or fabricated outcomes.

## Accessibility and quality
- Inputs have labels.
- Keyboard focus is visible.
- Buttons have meaningful labels.
- Color contrast is readable.
- Form errors are connected to inputs where practical.
- Loading/empty/error states are included.
- Respect reduced-motion preference if animation is used.
