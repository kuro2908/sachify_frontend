import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Stories from "../pages/Stories";
import StoryDetail from "../pages/StoryDetail";
import ChapterReader from "../pages/ChapterReader";
import RankingPage from "../pages/RankingPage";
import AdminUsers from "../components/admin/AdminUsers";
import AdminStories from "../components/admin/AdminStories";
import AdminCategories from "../components/admin/AdminCategories";
import AdminDashboard from "../components/admin/AdminDashboard";
import Login from "../components/ui/Login";
import Register from "../components/ui/Register";
import UserBookshelfPage from "../pages/UserBookshelfPage";
import UserActivityPage from "../pages/UserActivityPage";

import Header from "../components/Header";
import NotFound from "../pages/NotFound";
import ErrorPage from "../components/ErrorPage";
import NetworkStatus from "../components/NetworkStatus";
import ErrorDemoPage from "../pages/ErrorDemoPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AuthorDashboardPage from "../pages/author/AuthorDashboardPage";
import StoryEditorPage from "../pages/author/StoryEditorPage";
import ChapterEditorPage from "../pages/author/ChapterEditorPage";
import AuthorStoriesPage from "../pages/author/AuthorStoriesPage";
import AuthorChaptersPage from "../pages/author/AuthorChaptersPage";
import AuthorLayout from "../components/AuthorLayout";
import BecomeAuthorPage from "../pages/BecomeAuthorPage";

const Router = () => {
  return (
    <BrowserRouter>
      <NetworkStatus />
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Home />
          </>
        } />
        <Route path="/stories" element={
          <>
            <Header />
            <Stories />
          </>
        } />
        <Route path="/stories/:id" element={
          <>
            <Header />
            <StoryDetail />
          </>
        } />
        <Route path="/chapters/:id" element={
          <>
            <Header />
            <ChapterReader />
          </>
        } />
        <Route path="/rankings" element={
          <>
            <Header />
            <RankingPage />
          </>
        } />
        <Route path="/admin" element={
          <>
            <Header />
            <AdminDashboard />
          </>
        } />
        <Route path="/admin/users" element={
          <>
            <Header />
            <AdminUsers />
          </>
        } />
        <Route path="/admin/stories" element={
          <>
            <Header />
            <AdminStories />
          </>
        } />
        <Route path="/admin/categories" element={
          <>
            <Header />
            <AdminCategories />
          </>
        } />
        <Route path="/login" element={
          <>
            <Header />
            <Login />
          </>
        } />
        <Route path="/register" element={
          <>
            <Header />
            <Register />
          </>
        } />
        <Route path="/reset-password/:token" element={
          <>
            <Header />
            <ResetPasswordPage />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <Header />
            <ForgotPasswordPage />
          </>
        } />
        <Route path="/user/bookshelf" element={
          <>
            <Header />
            <UserBookshelfPage />
          </>
        } />
        <Route path="/user/activity" element={
          <>
            <Header />
            <UserActivityPage />
          </>
        } />

        <Route path="/become-author" element={
          <>
            <Header />
            <BecomeAuthorPage />
          </>
        } />
        <Route path="/author" element={
          <>
            <Header />
            <AuthorLayout>
              <AuthorDashboardPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/stories" element={
          <>
            <Header />
            <AuthorLayout>
              <AuthorStoriesPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/stories/new" element={
          <>
            <Header />
            <AuthorLayout>
              <StoryEditorPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/stories/:id/edit" element={
          <>
            <Header />
            <AuthorLayout>
              <StoryEditorPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/stories/:storyId/chapters" element={
          <>
            <Header />
            <AuthorLayout>
              <AuthorChaptersPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/stories/:storyId/chapters/new" element={
          <>
            <Header />
            <AuthorLayout>
              <ChapterEditorPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/author/chapters/:chapterId/edit" element={
          <>
            <Header />
            <AuthorLayout>
              <ChapterEditorPage />
            </AuthorLayout>
          </>
        } />
        <Route path="/error-demo" element={
          <>
            <Header />
            <ErrorDemoPage />
          </>
        } />
        <Route path="/error" element={
          <>
            <Header />
            <ErrorPage />
          </>
        } />
        <Route path="/error/:code" element={
          <>
            <Header />
            <ErrorPage />
          </>
        } />
        <Route path="*" element={
          <>
            <Header />
            <NotFound />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
