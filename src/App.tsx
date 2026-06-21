import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/Home/HomePage";
import ScanPage from "./pages/Scan/ScanPage";
import ScanSummary from "./pages/Scan/ScanSummary";
import SubdomainPage from "./pages/tools/subdomain/SubdomainPage";
import PortScanPage from "./pages/tools/portscan/PortScanPage";
import WhoisPage from "./pages/tools/whois/WhoisPage";
import TechCheckPage from "./pages/tools/techcheck/TechCheckPage";
import EmailHarvestPage from "./pages/tools/email-harvest/EmailHarvestPage";
import DnsPage from "./pages/tools/dns/DnsPage";

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/scan/summary" element={<ScanSummary />} />
        <Route path="/tools/subdomain" element={<SubdomainPage />} />
        <Route path="/tools/portscan" element={<PortScanPage />} />
        <Route path="/tools/whois" element={<WhoisPage />} />
        <Route path="/tools/techcheck" element={<TechCheckPage />} />
        <Route path="/tools/email-harvest" element={<EmailHarvestPage />} />
        <Route path="/tools/dns" element={<DnsPage />} />
        <Route path="*" element={<Navigate to={"/"} />}></Route>
      </Routes>
    </RootLayout>
  );
}

export default App;
