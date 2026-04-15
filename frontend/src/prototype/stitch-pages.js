
import FarmerHarvestListingPage from "@/pages/prototype/FarmerHarvestListingPage";
import BuyerRequirementPage from "@/pages/prototype/BuyerRequirementPage";
import LandingRoleSelectionPage from "@/pages/prototype/LandingRoleSelectionPage";

import FarmerVoiceInputPage from "@/pages/prototype/FarmerVoiceInputPage";

import ParsedAiSummaryPage from "@/pages/prototype/ParsedAiSummaryPage";

import NearbyBarterMatchesPage from "@/pages/prototype/NearbyBarterMatchesPage";

import AiTradeProposalPage from "@/pages/prototype/AiTradeProposalPage";

import TradeConfirmationPage from "@/pages/prototype/TradeConfirmationPage";

import RecordPlantingPage from "@/pages/prototype/RecordPlantingPage";

import FarmerFutureSupplyReadinessPage from "@/pages/prototype/FarmerFutureSupplyReadinessPage";

import FarmerListingPublishedPage from "@/pages/prototype/FarmerListingPublishedPage";

import BuyerMarketplacePage from "@/pages/prototype/BuyerMarketplacePage";
import FutureSupplyReadinessPage from "@/pages/prototype/FutureSupplyReadinessPage";
import ReservationConfirmedPage from "@/pages/prototype/ReservationConfirmedPage";
import BuyerReservationsPage from "@/pages/prototype/BuyerReservationsPage";

export const prototypePages = [
  {
    path: "/farmer/harvest-listing",
    group: "Farmer Flow",
    label: "Farmer harvest listing",
    description: "Farmer-side harvest listing with AI notes and voice input.",
    component: FarmerHarvestListingPage,
  },
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
    path: "/farmer/future-supply-readiness",
    group: "Farmer Flow",
    label: "Farmer future supply readiness",
    description: "Farmer-side harvest listing preview after planting.",
    component: FarmerFutureSupplyReadinessPage,
  },
  {
    path: "/farmer/listing-published",
    group: "Farmer Flow",
    label: "Farmer listing published",
    description: "Farmer-side publish confirmation after pushing a listing live.",
    component: FarmerListingPublishedPage,
  },
  {
    path: "/buyer/marketplace",
    group: "Buyer Flow",
    label: "Buyer marketplace",
    description: "Future harvest reservations marketplace.",
    component: BuyerMarketplacePage,
  },
  {
    path: "/buyer/requirement",
    group: "Buyer Flow",
    label: "Buyer requirement",
    description: "Buyer requirement posting form.",
    component: BuyerRequirementPage,
  },
  {
    path: "/buyer/future-supply-readiness",
    group: "Buyer Flow",
    label: "Buyer supply review",
    description: "Buyer-side future supply detail and reservation review.",
    component: FutureSupplyReadinessPage,
  },
  {
    path: "/buyer/reservation-confirmed",
    group: "Buyer Flow",
    label: "Reservation confirmed",
    description: "Buyer reservation completion screen.",
    component: ReservationConfirmedPage,
  },
  {
    path: "/buyer/reservations",
    group: "Buyer Flow",
    label: "Buyer reservations",
    description: "Buyer reservations list screen.",
    component: BuyerReservationsPage,
  },
]
