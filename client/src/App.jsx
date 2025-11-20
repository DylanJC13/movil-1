import { Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { MasterPage } from "./pages/MasterPage";
import { DetailPage } from "./pages/DetailPage";
import { NewProductPage } from "./pages/NewProduct";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/catalog" element={<MasterPage />} />
      <Route path="/catalog/new" element={<NewProductPage />} />
      <Route path="/catalog/:id" element={<DetailPage />} />
    </Routes>
  );
}
