import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'

import Layout from './components/Layout'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AnalysisProvider>
  )
}

export default App
