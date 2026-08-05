import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import AdminEditRecipe from './pages/AdminEditRecipe'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rezept/:id" element={<RecipeDetail />} />
        <Route path="/suche" element={<Search />} />
        <Route path="/favoriten" element={<Favorites />} />
        <Route path="/einreichen" element={<Submit />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/bearbeiten/:id" element={<AdminEditRecipe />} />
      </Routes>
    </>
  )
}
