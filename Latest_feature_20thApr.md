# TaniTrade AI: Latest Features & Technical Deep Dive

TaniTrade AI is an agentic agrotech platform designed to empower Malaysian smallholder farmers through AI-driven resource management, barter matching, and predictive harvest commerce.

## 1. Agentic Farmer Intake (Voice & Text)
Transforming natural language into structured trade intent using Google Cloud Speech-to-Text and Google Gemini AI.

*   **Hybrid Processing**: Combines deterministic parsing with LLM-based extraction for high accuracy even with colloquial language or mixed-language input (Manglish/Bahasa Malaysia).
*   **Structured Extraction**:
    *   **Crop Detection**: Automatically identifies the primary crop being managed (e.g., Paddy MR269, Sweet Corn, Chili).
    *   **Resource Mapping**: Extracts items "Have" (Surplus) and "Need" (Shortage) with quantities and units.
    *   **Urgency & Radius**: Detects time-sensitivity and preferred search distance from natural phrasing.
*   **Dual-Language Support**: Native support for English and Bahasa Malaysia instructions and processing.

## 2. Intelligent Barter Matching Engine
A sophisticated ranking system that connects farmers based on reciprocal resource needs and proximity.

*   **Multi-Factor Scoring**:
    *   **Exact Need Match (50 pts)**: Prioritizes matches that satisfy the farmer's specific shortage.
    *   **Reciprocity (25 pts)**: Rewards matches where both parties have what the other needs.
    *   **Geospatial Proximity (Up to 15 pts)**: Uses the Haversine formula to calculate real-world distance and scores matches within the user's search radius.
    *   **Trust & Reliability (Up to 10 pts)**: Incorporates historical trust ratings into the ranking.
*   **Local Optimization**: Focuses on community-level resource sharing to reduce logistics costs and carbon footprint.

## 3. Predictive Harvest Projection
Data-driven estimation of future yields and timelines based on real-time planting data.

*   **Yield Estimation**: Calculates expected yield (min/max kg) based on crop-specific baselines and planted area (hectares/acres/sqm).
*   **Growth Cycle Modeling**: Projects harvest windows by tracking crop-specific growth days from the initial planting date.
*   **Organic Bonus Logic**: Automatically applies an 8% yield and quality premium if organic or bio-fertilizer inputs are detected in the planting record.
*   **Ready-to-List**: One-click conversion from planting logs to buyer-facing harvest listings.

## 4. Advanced Buyer Marketplace & Reservations
Connecting institutional buyers and wholesalers directly to future supply.

*   **Future Supply Transparency**: Buyers can browse projected harvests months before they are ready, filtered by crop type and availability window.
*   **AI Readiness Signals**: Uses AI to generate "Soil Vitality" and "Yield Probability" indicators based on farmer input history.
*   **Reservation System**: Secure future supply through a formal reservation flow, allowing farmers to lock in demand early.
*   **Early-Bird Incentives**: Configurable discount logic for advance reservations to improve farmer cash flow.

## 5. Multi-Language AI Copy Generation
Automated, professional listing and proposal generation to bridge the gap between farmers and buyers.

*   **Dual-Language Summaries**: AI generates narrative summaries for harvest listings in both English and Bahasa Malaysia.
*   **Trade Proposal Generation**: AI explains the logic behind barter ratios and logistics arrangements, making it easier for farmers to agree on complex trades.
*   **Standardized Cataloging**: Map colloquial item names (e.g., "baja urea", "cili padi") to standardized global identifiers for better searchability.

---
*Last Updated: 20th April 2026*
