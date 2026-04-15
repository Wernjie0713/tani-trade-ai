# UI Logic for /farmer/voice-input (FarmerVoiceInputPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation and header.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `draftMessage`: The current text input (from typing or voice transcription)
  - `submitState`: { status: "idle" | "loading" | "error", error: string | null }
  - `voiceState`: "idle" | "recording" | "transcribing" | "error"
  - `voiceError`: Error message for voice input
- Uses `useFarmerFlow` context for flow management and prompt suggestions.

## Voice Input Logic
- Checks browser support for MediaRecorder and microphone.
- When mic button is pressed:
  - Requests microphone access.
  - Starts recording audio (max 30 seconds).
  - On stop, sends audio blob to backend for transcription.
  - Sets `draftMessage` to transcript result.
  - Handles errors (permission denied, no audio, etc).

## Text Input Logic
- User can type directly in the input field.
- Input is disabled during loading or transcription.

## Prompt Suggestions
- Shows quick prompt suggestions from backend or fallback list.
- Clicking a suggestion fills the input.

## Submission Logic
- Submit button is enabled if not loading/recording/transcribing and input is not empty.
- On submit:
  - Calls backend API to create intake with `draftMessage`.
  - On success: resets flow, updates requestId, navigates to parsed summary page.
  - On error: shows error message.

## UI Elements
- Header: "What's on your mind?"
- Status badge: Shows voice status (Ready, Recording, Transcribing, Typed Only)
- Large mic button: Starts/stops recording
- Prompt text: Guides user on what to do
- Example prompt: "Try: ..."
- Input field: For typing or showing transcript
- Quick prompt buttons: For fast input
- Submit button: "Analyze & Find Match"
- Error display: Shows any voice or submit errors

## Pseudocode Summary

```
if (voice supported) {
  show mic button
  on mic click: start/stop recording
  on stop: transcribe audio, set draftMessage
} else {
  show typed input only
}

on input change: set draftMessage
on prompt click: set draftMessage

on submit:
  if draftMessage is empty: show error
  else:
    call createFarmerIntake(draftMessage)
    on success: reset flow, update requestId, navigate
    on error: show error
```

---

This logic matches the current implementation of FarmerVoiceInputPage.jsx as of April 2026.

# UI Logic for /farmer/parsed-summary (ParsedAiSummaryPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `screenState`: { status: "loading" | "success" | "error", data, error }
  - `submitState`: { status: "idle" | "loading" | "error", error }
  - `editorState`: { open: boolean, status: "idle" | "loading" | "error", error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Data Loading Logic
- On mount, loads parsed intake summary from backend using `flowIds.requestId`.
- Shows loading, error, or summary state accordingly.
- If no requestId, redirects to voice input page.

## Edit Logic
- User can open an edit sheet to modify parsed details.
- On save, updates intake summary via backend and refreshes data.

## Confirmation & Submission Logic
- Shows parsed summary: crop, surplus, need, timeline, radius, and market opportunity.
- User can:
  - Click “Find Best Matches” to generate barter matches (calls backend, navigates to match results).
  - Click “Modify Details” to open the edit sheet.
- Shows loading/error states for both actions.

## UI Elements
- Header: “Parsed Summary”
- Confidence badge (e.g., “High confidence (98%)”)
- Parsed details: crop, surplus, need, timeline, radius
- Market opportunity info
- “Find Best Matches” button
- “Modify Details” button
- Edit sheet modal for inline editing
- Error and loading displays

## Pseudocode Summary

```
on mount:
  if no requestId: redirect to voice input
  else: load parsed summary from backend

on edit:
  open edit sheet
  on save: update summary via backend, refresh data

on Find Best Matches:
  call backend to generate matches
  on success: reset flow IDs, navigate to match results
  on error: show error

UI shows:
  - parsed crop, surplus, need, timeline, radius
  - market opportunity
  - edit and submit buttons
  - error/loading states
```

---

# UI Logic for /farmer/nearby-matches (NearbyBarterMatchesPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `screenState`: { status: "loading" | "success" | "error", data, error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Data Loading Logic
- On mount, loads ranked barter matches from backend using `flowIds.requestId`.
- Shows loading, error, or match results accordingly.
- If no requestId, redirects to parsed summary page.

## Match Selection Logic
- Displays top match with detailed info and action button.
- Displays other matches in a list below.
- On selecting a match, updates flow IDs and navigates to the trade proposal page.

## UI Elements
- Header: “Nearby Matches”
- Map preview with “You are here” marker
- Top match card: AI rating, counterparty info, offer/need, insight, execute button
- Other matches: List with summary info and select button
- Loading, error, and empty state displays

## Pseudocode Summary

```
on mount:
  if no requestId: redirect to parsed summary
  else: load matches from backend

on match select:
  update flow IDs
  navigate to trade proposal page

UI shows:
  - map preview
  - top match card with details and execute button
  - other matches list
  - loading/error/empty states
```

---

# UI Logic for /farmer/barter-proposal (AiTradeProposalPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `screenState`: { status: "loading" | "success" | "error", data, error }
  - `acceptState`: { status: "idle" | "loading" | "error", error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Data Loading Logic
- On mount, loads barter proposal from backend using `flowIds.matchId`.
- Shows loading, error, or proposal state accordingly.
- If no matchId, redirects to nearby matches page.

## Proposal Acceptance Logic
- Shows detailed proposal: offer, request, ratio, valuation, explanation, meeting point.
- User can:
  - Click “Accept Trade Proposal” to confirm (calls backend, navigates to trade confirmation).
  - Click “Review Other Matches” to go back.
- Shows loading/error states for both actions.

## UI Elements
- Header: “Trade Proposal”
- Proposal details: offer, request, ratio, valuation, explanation, meeting point
- Accept and review buttons
- Secure protocol info
- Loading and error displays

## Pseudocode Summary

```
on mount:
  if no matchId: redirect to nearby matches
  else: load proposal from backend

on accept proposal:
  call backend to accept proposal
  on success: update flow IDs, navigate to trade confirmation
  on error: show error

UI shows:
  - proposal details (offer, request, ratio, valuation, explanation, meeting point)
  - accept and review buttons
  - loading/error states
```

---

# UI Logic for /farmer/record-planting (RecordPlantingPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `form`: { cropType, plantingDate, areaValue, areaUnit, inputSummary }
  - `submitState`: { status: "idle" | "loading" | "error", error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Form Logic
- User enters:
  - Crop variety (text)
  - Date sown (date picker)
  - Cultivation area (number + unit)
  - Treatments & inputs (textarea)
- Tab key can autofill example values if field is empty.
- Form is validated for completeness before submit.

## Submission Logic
- On submit:
  - Validates all fields.
  - Calls backend to create/update planting record.
  - On success: updates flow IDs, navigates to harvest listing page.
  - On error: shows error message.

## UI Elements
- Header: “Planting Record”
- Form fields: crop, date, area, inputs
- Example field autofill (Tab)
- Field imagery and AI status
- Submit button: “Generate Harvest Listing”
- Error display

## Pseudocode Summary

```
on submit:
  if any field missing: show error
  else:
    call createOrUpdatePlanting with form data
    on success: update flow IDs, navigate to harvest listing
    on error: show error

UI shows:
  - form fields for crop, date, area, inputs
  - submit button
  - error and AI status
```

---

# UI Logic for /farmer/future-supply-readiness (FarmerFutureSupplyReadinessPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-md` container.

## State & Context
- Uses React state for:
  - `screenState`: { status: "loading" | "success" | "error", data, error }
  - `publishState`: { status: "idle" | "loading" | "error", error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Data Loading Logic
- On mount, loads harvest listing preview from backend using `flowIds.harvestListingId`.
- Shows loading, error, or listing preview accordingly.
- If no harvestListingId, redirects to planting record page.

## Publish Logic
- Shows harvest listing preview: crop, yield, window, incentives, AI stats, etc.
- User can:
  - Click “Publish Listing” to publish (calls backend, navigates to published page).
  - Click “Edit Planting Details” to go back and edit.
- Shows loading/error states for both actions.

## UI Elements
- Header: “Harvest Listing”
- Listing preview: crop, yield, window, incentives, AI stats
- Publish and edit buttons
- Info/help text
- Loading and error displays

## Pseudocode Summary

```
on mount:
  if no harvestListingId: redirect to planting record
  else: load listing from backend

on publish:
  call backend to publish listing
  on success: update state, navigate to published page
  on error: show error

UI shows:
  - listing preview (crop, yield, window, incentives, AI stats)
  - publish and edit buttons
  - info/help text
  - loading/error states
```

---

# UI Logic for /farmer/listing-published (FarmerListingPublishedPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `FarmerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-2xl` container with responsive padding.

## State & Context
- Uses React state for:
  - `screenState`: { status: "loading" | "success" | "error", data, error }
- Uses `useFarmerFlow` context for flow management and IDs.

## Data Loading Logic
- On mount, loads published harvest listing from backend using `flowIds.harvestListingId`.
- Shows loading, error, or published listing state accordingly.
- If no harvestListingId, redirects to future supply readiness page.
- If listing is not published, redirects to future supply readiness page.

## Published Listing Display Logic
- Shows a confirmation banner: "Marketplace Live" with icon.
- Shows main heading: "Your harvest listing is now live in the buyer marketplace."
- Explains that buyers can now discover the listing.
- Shows loading or error state if applicable.
- If loaded, displays:
  - Publish receipt: title, published at, live status.
  - Reservation reach: number of buyer interest signals.
  - Live listing snapshot: yield range, harvest window, quality band, reservation hook.
  - "What Happens Next" checklist (marketplace, incentive, review/edit options).

## Action Buttons
- "View Live Listing": Navigates to future supply readiness page.
- "Back to Dashboard": Navigates to home/dashboard.

## UI Elements
- Confirmation badge with icon
- Main heading and description
- Publish receipt card
- Reservation reach card
- Live listing snapshot (yield, window, quality, incentive)
- What Happens Next checklist
- Action buttons (view, dashboard)
- Loading and error displays

## Pseudocode Summary

```
on mount:
  if no harvestListingId: redirect to future supply readiness
  load listing from backend
  if not published: redirect to future supply readiness

if loading: show loading state
if error: show error
if success:
  show confirmation banner
  show publish receipt (title, published at, status)
  show reservation reach
  show live listing snapshot (yield, window, quality, incentive)
  show what happens next checklist
  show action buttons (view, dashboard)
```

---

This logic matches the current implementation of FarmerListingPublishedPage.jsx as of April 2026.

# UI Logic for /buyer/marketplace (BuyerMarketplacePage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `BuyerShell` for navigation and header.
- Main content is centered in a `max-w-md` container with padding.

## State & Context
- Uses `useHarvest` context for:
  - `listings`: Array of harvest listings from backend
  - `loading`, `error`: Loading and error state for listings
  - `reserveListing`: Function to reserve a listing
  - `reservationStatus`: Reservation status keyed by listing ID
- Uses React state for:
  - `modalOpen`: Whether the reservation modal is open
  - `selectedListing`: The listing selected for reservation

## Data Loading & Mapping Logic
- Maps backend listing fields to frontend expected fields (title, volume, price, region, crop, image, status, projected).
- Splits listings into `projectedHarvests` (future supply) and `availableHarvests` (not projected).

## Projected Harvests Display Logic
- Shows a section for "Projected Harvest Windows" with a badge.
- For each projected harvest:
  - Shows image, title, estimated volume, price, region, and expected harvest window.
  - If reserved, shows "Funds Secured" badge.
  - Button to "Secure Future Supply" or "Funds Secured" (if already reserved).
  - Clicking button opens reservation modal for that listing.
- Shows loading, error, or empty state as appropriate.

## Reservation Modal
- Uses `ReservationModal` component.
- Opens when a listing is selected for reservation.
- Handles reservation logic via `reserveListing` and updates status.

## AI Market Insight
- Shows a static highlight card with AI market insight (e.g., "Bullish", demand projections, advice to reserve early).

## UI Elements
- Section header and badge
- Listing cards: image, title, volume, price, region, harvest window, reserve button, reserved badge
- Reservation modal
- AI market insight card
- Loading, error, and empty state displays

## Pseudocode Summary

```
on mount:
  load listings from backend
  map backend fields to frontend fields
  split into projected and available harvests

for each projected harvest:
  show card with image, title, volume, price, region, window
  if reserved: show badge
  reserve button opens modal

reservation modal handles reservation logic
show AI market insight card
show loading, error, or empty state as needed
```

---

This logic matches the current implementation of BuyerMarketplacePage.jsx as of April 2026.

# UI Logic for /buyer/requirement (BuyerRequirementPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `BuyerShell` for navigation and header.
- Main content is centered in a `max-w-md` container with padding.

## State & Context
- Uses React state for:
  - `form`: { crop, quantity, region, notes } (form fields)
  - `submitting`: Whether the form is being submitted
  - `success`: Whether the requirement was posted successfully
  - `error`: Error message if posting fails

## Form Logic
- User enters:
  - Crop (text, required)
  - Quantity (number, required, min 1)
  - Region (text, required)
  - Notes (textarea, optional)
- Form fields are controlled by React state.
- On change, updates the corresponding field in `form` state.

## Submission Logic
- On submit:
  - Prevents default form submission
  - Sets submitting state, clears error/success
  - Calls backend API (`postBuyerRequirement`) with form data
  - On success: shows success message, resets form fields
  - On error: shows error message
  - Always resets submitting state at the end

## UI Elements
- Header: "Post a Requirement"
- Form fields: crop, quantity, region, notes
- Submit button: "Post Requirement" (shows loading state if submitting)
- Success and error messages

## Pseudocode Summary

```
on input change:
  update form state

on submit:
  prevent default
  set submitting, clear error/success
  call postBuyerRequirement(form)
  if success: show success, reset form
  if error: show error
  set submitting false
```

---

This logic matches the current implementation of BuyerRequirementPage.jsx as of April 2026.

# UI Logic for /buyer/reservation (ReservationConfirmedPage)

## Page Structure
- Uses `PrototypePageFrame` for theming and layout.
- Uses `BuyerShell` for navigation, header, and back button.
- Main content is centered in a `max-w-lg` container, vertically padded and centered.

## State & Context
- Uses React Router's `useNavigate` for navigation.
- No local React state; all content is static or comes from navigation context.

## Reservation Confirmation Display Logic
- Shows a large confirmation image (basket of grain) with a "Supply Secured" badge overlay.
- Main heading: "Harvest Cycle Joined".
- Subtext: Thanks the user for their commitment and explains the impact.
- Reserved allocation card:
  - Crop name (e.g., Premium Paddy), quantity, and status (Commitment Locked).
  - Partner farmer profile: image, name, and label.
- Estimated harvest date card.
- Strategic benefit card (e.g., "10% Yield Bonus").
- Stewardship message: Encourages buyer's role and promises updates.

## Action Buttons
- "Browse More Supply": Navigates to the marketplace page.
- "Return Home": Navigates to the home/dashboard page.

## UI Elements
- Confirmation image and badge
- Main heading and subtext
- Reserved allocation card (crop, quantity, partner farmer)
- Estimated harvest card
- Strategic benefit card
- Stewardship message
- Action buttons (browse, home)

## Pseudocode Summary

```
on page load:
  show confirmation image and badge
  show heading and subtext
  show reserved allocation (crop, quantity, partner farmer)
  show estimated harvest and benefit
  show stewardship message
  show action buttons (browse, home)
  buttons navigate to marketplace or home
```

---

This logic matches the current implementation of ReservationConfirmedPage.jsx as of April 2026.

# UI Logic for Shared/Other Pages

## Home Page (/)
### (LandingRoleSelectionPage)
- Uses `PrototypePageFrame` for theming and layout.
- Header with app name and "Choose Role" badge.
- Main content: Hero section with tagline, description, and market activity image.
- Two main role selection cards:
  - "I am a Farmer": Navigates to farmer flow (voice input page).
  - "I am a Buyer": Navigates to buyer marketplace.
- Footer with copyright.
- No local state; navigation only.

## Health/Status Endpoint (Backend)
### (health.py)
- FastAPI route `/health` returns JSON with:
  - `status`: always "ok"
  - `service`: app name from settings
  - `firebase_configured`: boolean
  - `frontend_url`: from settings
- Used for health checks and status monitoring.

## Demo/Prototype Directory (/prototype)
### (PrototypeDirectory)
- Uses `PrototypeDirectory` component to list all prototype pages.
- Shows stats: total pages, farmer flow pages, buyer flow pages.
- Each page is grouped and linked for navigation/testing.
- Used for hackathon/demo to quickly access all UI screens.

---

This logic matches the current implementation of shared/other pages as of April 2026.
