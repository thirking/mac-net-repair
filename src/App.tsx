import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import {
  HomePage,
  NetworkCardsPage,
  ProxyPage,
  DnsPage,
  DiagnosticsPage,
  ResetPage,
} from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="network-cards" element={<NetworkCardsPage />} />
          <Route path="proxy" element={<ProxyPage />} />
          <Route path="dns" element={<DnsPage />} />
          <Route path="diagnostics" element={<DiagnosticsPage />} />
          <Route path="reset" element={<ResetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
