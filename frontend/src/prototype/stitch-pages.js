import AiTradeProposalPage from "@/pages/prototype/AiTradeProposalPage"
import BuyerMarketplacePage from "@/pages/prototype/BuyerMarketplacePage"
import FarmerVoiceInputPage from "@/pages/prototype/FarmerVoiceInputPage"
import FutureSupplyReadinessPage from "@/pages/prototype/FutureSupplyReadinessPage"
import LandingRoleSelectionPage from "@/pages/prototype/LandingRoleSelectionPage"
import NearbyBarterMatchesPage from "@/pages/prototype/NearbyBarterMatchesPage"
import ParsedAiSummaryPage from "@/pages/prototype/ParsedAiSummaryPage"
import RecordPlantingPage from "@/pages/prototype/RecordPlantingPage"
import ReservationConfirmedPage from "@/pages/prototype/ReservationConfirmedPage"
import TradeConfirmationPage from "@/pages/prototype/TradeConfirmationPage"

export const prototypePages = [
  {
    path: "/",
    group: "Entry",
    label: "Landing role selection",
    description: "Farmer versus buyer entry screen.",
    component: LandingRoleSelectionPage,
  },
  {
    path: "/farmer/voice-input",
    group: "Farmer Flow",
    label: "Farmer voice input",
    description: "Voice-first barter intake screen.",
    component: FarmerVoiceInputPage,
  },
  {
    path: "/farmer/parsed-summary",
    group: "Farmer Flow",
    label: "Parsed AI summary",
    description: "Structured summary before marketplace search.",
    component: ParsedAiSummaryPage,
  },
  {
    path: "/farmer/nearby-matches",
    group: "Farmer Flow",
    label: "Nearby barter matches",
    description: "AI-ranked local match results.",
    component: NearbyBarterMatchesPage,
  },
  {
    path: "/farmer/ai-trade-proposal",
    group: "Farmer Flow",
    label: "AI trade proposal",
    description: "AI-generated barter valuation and logistics.",
    component: AiTradeProposalPage,
  },
  {
    path: "/farmer/trade-confirmation",
    group: "Farmer Flow",
    label: "Trade confirmation",
    description: "Post-acceptance trade confirmation screen.",
    component: TradeConfirmationPage,
  },
  {
    path: "/farmer/record-planting",
    group: "Farmer Flow",
    label: "Record planting",
    description: "Capture planted crop details after barter.",
    component: RecordPlantingPage,
  },
  {
    path: "/buyer/marketplace",
    group: "Buyer Flow",
    label: "Buyer marketplace",
    description: "Future harvest reservations marketplace.",
    component: BuyerMarketplacePage,
  },
  {
    path: "/buyer/future-supply-readiness",
    group: "Buyer Flow",
    label: "Future supply readiness",
    description: "Readiness scoring for future harvest windows.",
    component: FutureSupplyReadinessPage,
  },
  {
    path: "/buyer/reservation-confirmed",
    group: "Buyer Flow",
    label: "Reservation confirmed",
    description: "Buyer reservation completion screen.",
    component: ReservationConfirmedPage,
  },
]
