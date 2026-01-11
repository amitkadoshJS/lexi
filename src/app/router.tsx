import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AuthGate from "./components/AuthGate";
import CategoriesPage from "../features/categories/CategoriesPage";
import WordsPage from "../features/words/WordsPage";
import WorldsPage from "../features/worlds/WorldsPage";
import WorldDetails from "../features/worlds/WorldDetails";
import UsersPage from "../features/users/UsersPage";
import UserDetails from "../features/users/UserDetails";
import LangsPage from "../features/langs/LangsPage";
import NotAuthorized from "./components/NotAuthorized";
import LoginPage from "./components/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/not-authorized",
    element: <NotAuthorized />
  },
  {
    path: "/",
    element: (
      <AuthGate>
        <AdminLayout />
      </AuthGate>
    ),
    children: [
      { index: true, element: <CategoriesPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "words", element: <WordsPage /> },
      { path: "worlds", element: <WorldsPage /> },
      { path: "worlds/:worldId", element: <WorldDetails /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/:userId", element: <UserDetails /> },
      { path: "langs", element: <LangsPage /> }
    ]
  }
]);
