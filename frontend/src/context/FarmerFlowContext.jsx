/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useState } from "react"

import { getDemoBootstrap } from "@/lib/farmerApi"

const STORAGE_KEY = "tani-trade-ai:farmer-flow"

const defaultFlowIds = {
  requestId: null,
  matchId: null,
  proposalId: null,
  tradeId: null,
  plantingRecordId: null,
  harvestListingId: null,
}

const FarmerFlowContext = createContext(null)

function readStoredFlowIds() {
  if (typeof window === "undefined") {
    return defaultFlowIds
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultFlowIds
    }

    return {
      ...defaultFlowIds,
      ...JSON.parse(raw),
    }
  } catch {
    return defaultFlowIds
  }
}

export function FarmerFlowProvider({ children }) {
  const [flowIds, setFlowIds] = useState(readStoredFlowIds)
  const [bootstrapState, setBootstrapState] = useState({
    status: "idle",
    data: null,
    error: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(flowIds))
  }, [flowIds])

  useEffect(() => {
    let isActive = true

    async function loadBootstrap() {
      setBootstrapState({
        status: "loading",
        data: null,
        error: null,
      })

      try {
        const data = await getDemoBootstrap()
        if (!isActive) {
          return
        }

        setBootstrapState({
          status: "success",
          data,
          error: null,
        })

        setFlowIds((current) => {
          const hasStoredState = Object.values(current).some(Boolean)
          if (hasStoredState) {
            return current
          }

          return {
            ...current,
            requestId: data.active_flow.request_id,
            matchId: data.active_flow.match_id,
            proposalId: data.active_flow.proposal_id,
            tradeId: data.active_flow.trade_id,
            plantingRecordId: data.active_flow.planting_record_id,
            harvestListingId: data.active_flow.harvest_listing_id,
          }
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setBootstrapState({
          status: "error",
          data: null,
          error: error.message || "Unable to reach the backend.",
        })
      }
    }

    loadBootstrap()

    return () => {
      isActive = false
    }
  }, [])

  const updateFlowIds = useCallback((patch) => {
    setFlowIds((current) => ({
      ...current,
      ...patch,
    }))
  }, [])

  const resetFlowIds = useCallback(() => {
    setFlowIds(defaultFlowIds)
  }, [])

  return (
    <FarmerFlowContext.Provider
      value={{
        flowIds,
        updateFlowIds,
        resetFlowIds,
        bootstrap: bootstrapState.data,
        bootstrapStatus: bootstrapState.status,
        bootstrapError: bootstrapState.error,
      }}
    >
      {children}
    </FarmerFlowContext.Provider>
  )
}

export function useFarmerFlow() {
  const context = useContext(FarmerFlowContext)
  if (!context) {
    throw new Error("useFarmerFlow must be used inside FarmerFlowProvider.")
  }

  return context
}
