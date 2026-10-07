import { Routes, Route } from "react-router-dom";

import PageShell from "./components/layout/PageShell";

// Pages
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import ProductDetails from "./components/pages/ProductDetails";
import News from "./components/pages/News";
import NewsArticle from "./components/pages/NewsArticle";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import NotFound from "./components/pages/NotFound";
import ServerError from "./components/pages/ServerError";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ProfileDashboard from "./components/pages/ProfileDashboard";
import AdminDashboard from "./components/pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* shared shell keeps navigation and page spacing consistent. */}
      <Route element={<PageShell />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* allow explicit navigation to the designed server-error page. */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
