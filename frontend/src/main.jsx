import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { FarmerFlowProvider } from "@/context/FarmerFlowContext"
import "./index.css"
import App from "./App.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FarmerFlowProvider>
        <App />
      </FarmerFlowProvider>
    </BrowserRouter>
  </StrictMode>,
)
