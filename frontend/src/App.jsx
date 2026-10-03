import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProfileManage from "./admin/ProfileManage";
import SkillsManage from "./admin/SkillsManage";
import ExperienceManage from "./admin/ExperienceManage";
import EducationManage from "./admin/EducationManage";
import SocialLinksManage from "./admin/SocialLinksManage";
import MessagesManage from "./admin/MessagesManage";
import ServicesManage from "./admin/ServicesManage";
import ProjectsManage from "./admin/ProjectsManage"; // <-- Nayi file import ki

function PublicLayout() {
  return (
    <>
      <Navbar />

      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransition>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<ProfileManage />} />
        <Route path="/admin/skills" element={<SkillsManage />} />
        <Route path="/admin/experience" element={<ExperienceManage />} />
        <Route path="/admin/education" element={<EducationManage />} />
        <Route path="/admin/social-links" element={<SocialLinksManage />} />
        <Route path="/admin/messages" element={<MessagesManage />} />
        <Route path="/admin/services" element={<ServicesManage />} />
        <Route path="/admin/projects" element={<ProjectsManage />} /> {/* <-- Naya Route */}

        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;