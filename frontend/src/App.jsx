
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main style={{ minHeight: "70vh" }}>
        <AppRoutes />
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
