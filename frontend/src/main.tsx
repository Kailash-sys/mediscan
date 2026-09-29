import { useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import { ToastProvider } from './context/ToastContext'
import { AnalysisProvider } from './context/AnalysisContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Analyze } from './pages/Analyze'
import { Results } from './pages/Results'
import { History } from './pages/History'
import { Blogs } from './pages/Blogs'
import { BlogDetails } from './pages/BlogDetails'
import { About } from './pages/About'

/** Scrolls to the top on every route change (the browser can't do it for SPA navigation). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AnalysisProvider>
          <AppShell />
        </AnalysisProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
