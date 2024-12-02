import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectManagement from './pages/ProjectManagement';
import AgentManagement from './pages/AgentManagement';
import WorkflowManagement from './pages/WorkflowManagement';
import Analytics from './pages/Analytics';
import LLMProviderManagement from './components/LLMProviderManagement';
import Chat from './pages/Chat';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/*" element={<ProjectManagement />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/workflows" element={<WorkflowManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/llm-providers" element={<LLMProviderManagement />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;