import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppContext';
import { AlertContainer } from '@/components/AlertContainer';
import { Layout } from '@/layouts/Layout';
import { HomePage } from '@/pages/HomePage';
import { CreateRespondentPage } from '@/pages/CreateRespondentPage';
import { RespondentsPage } from '@/pages/RespondentsPage';
import { EditRespondentPage } from '@/pages/EditRespondentPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/respondents" element={<RespondentsPage />} />
              <Route path="/respondents/new" element={<CreateRespondentPage />} />
              <Route path="/respondents/:id/edit" element={<EditRespondentPage />} />
            </Routes>
          </Layout>
          <AlertContainer />
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
