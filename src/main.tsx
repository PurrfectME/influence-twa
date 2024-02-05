import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "@twa-dev/sdk";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 10px 10px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

// this manifest is used temporarily for development purposes
const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProvider client={queryClient}>
        <StyledApp>
          <AppContainer>
            <Routes>
              <Route path="/influence-twa" element={<Home />} />
            </Routes>
          </AppContainer>
        </StyledApp>
      </QueryClientProvider>
    </TonConnectUIProvider>
  </Router>
);
