import { Navigate, Route, Routes } from "react-router-dom"

import PrototypeDirectory from "@/components/PrototypeDirectory"
import { prototypePages } from "@/prototype/stitch-pages"

function App() {
  return (
    <Routes>
      <Route
        path="/prototype"
        element={<PrototypeDirectory pages={prototypePages} />}
      />

      {prototypePages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<page.component />}
        />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
