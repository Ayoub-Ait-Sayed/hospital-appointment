import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Accueil from "../components/Accueil";
import TousMedcine from "../components/TousMedcine";
import Tousspecialites from "../components/Tousspecialites";
import PatientDashboard from "../pages/patient/PatientDashboard";
import MesRendezVous from "../pages/patient/MesRendezVous";
import Specialites from "../pages/patient/Specialites";
import Medecins from "../pages/patient/Medecins";
import Disponibilites from "../pages/patient/Disponibilites";
import PrendreRendezVous from "../pages/patient/PrendreRendezVous";
import MedecinDashboard from "../pages/medecin/MedecinDashboard";
import MedecinRendezVous from "../pages/medecin/MesRendezVous";
import MesDisponibilites from "../pages/medecin/MesDisponibilites";
import MedecinProfile from "../pages/medecin/MedecinProfile";
import ResponsableMedecins from "../pages/responsable/Medecins";
import ResponsablePatients from "../pages/responsable/Patients";
import ResponsableRendezVous from "../pages/responsable/RendezVous";
import ResponsableDashboard from "../pages/responsable/ResponsableDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminSpecialites from "../pages/admin/Specialites";
import AdminDemandesMedecins from "../pages/admin/DemandesMedecins";
import Contact from "../pages/public/Contact";

function AppRoutes() {
  return (
    // <BrowserRouter>
    <Routes>

      {/* ================= ACCUEIL ================= */}

      <Route
        path="/"
        element={<Accueil />}
      />


      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================= PATIENT ================= */}

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute roles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/rendez-vous"
        element={
          <ProtectedRoute roles={["patient"]}>
            <MesRendezVous />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/specialites"
        element={
          <ProtectedRoute roles={["patient"]}>
            <Specialites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/specialites/:specialiteId/medecins"
        element={
          <ProtectedRoute roles={["patient"]}>
            <Medecins />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/medecins/:medecinId/disponibilites"
        element={
          <ProtectedRoute roles={["patient"]}>
            <Disponibilites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/prendre-rendez-vous"
        element={
          <ProtectedRoute roles={["patient"]}>
            <PrendreRendezVous />
          </ProtectedRoute>
        }
      />
    

      {/* ================= MEDECIN ================= */}

      <Route
        path="/medecin/dashboard"
        element={
          <ProtectedRoute roles={["medecin"]}>
            <MedecinDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medecin/rendez-vous"
        element={
          <ProtectedRoute roles={["medecin"]}>
            <MedecinRendezVous />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medecin/disponibilites"
        element={
          <ProtectedRoute roles={["medecin"]}>
            <MesDisponibilites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medecin/profile"
        element={
          <ProtectedRoute roles={["medecin"]}>
            <MedecinProfile />
          </ProtectedRoute>
        }
      />


      {/* ================= RESPONSABLE ================= */}

      <Route
        path="/responsable/dashboard"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/medecins"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableMedecins />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/patients"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsablePatients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/rendez-vous"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableRendezVous />
          </ProtectedRoute>
        }
      />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/specialites"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminSpecialites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/demandes-medecins"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDemandesMedecins />
          </ProtectedRoute>
        }
      />


      {/* ================= DEFAULT ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
  
             {/* ================= Contact ================= */}

       <Route path="/contact" element={<Contact />} />
       <Route path="/tousmedcine" element={<TousMedcine />} />
       <Route path="/Tousspecialites" element={<Tousspecialites />} />
    </Routes>
    // </BrowserRouter>
  );
}

export default AppRoutes;
