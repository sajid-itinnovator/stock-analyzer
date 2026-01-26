import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AdvisorPage from './views/AdvisorPage'
import AnalysisPage from './views/AnalysisPage'
import ProfilePage from './views/ProfilePage'
import HistoryPage from './views/HistoryPage'
import CredentialsPage from './views/CredentialsPage'
import { StockProvider } from './context/StockContext'
import { UserProvider } from './context/UserContext'
import { AuthProvider } from './context/AuthContext'

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <StockProvider>
                        <MainLayout>
                            <Routes>
                                <Route path="/" element={<AdvisorPage />} />
                                <Route path="/analysis" element={<AnalysisPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/history" element={<HistoryPage />} />
                                <Route path="/credentials" element={<CredentialsPage />} />
                            </Routes>
                        </MainLayout>
                    </StockProvider>
                </UserProvider>
            </AuthProvider>
        </Router>
    )
}

export default App