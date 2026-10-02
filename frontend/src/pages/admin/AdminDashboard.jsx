import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    rendez_vous: 0,
  });

  const [demandes, setDemandes] = useState([]);
  const [users, setUsers] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // ==========================================================
  // CHARGEMENT DES DONNÉES
  // ==========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        // Dashboard + demandes
        const requests = [
          axios.get(
            "http://127.0.0.1:8000/api/admin/dashboard",
            { headers }
          ),

          axios.get(
            "http://127.0.0.1:8000/api/admin/demandes-medecins",
            { headers }
          ),
        ];

        // Users + spécialités
        const optionalRequests = await Promise.allSettled([
          axios.get(
            "http://127.0.0.1:8000/api/admin/users",
            { headers }
          ),

          axios.get(
            "http://127.0.0.1:8000/api/admin/specialites",
            { headers }
          ),
        ]);

        const [dashboardResponse, demandesResponse] =
          await Promise.all(requests);

        // ======================================================
        // RENDEZ-VOUS
        // ======================================================

        const dashboardData = dashboardResponse.data;

        setStats({
          rendez_vous:
            dashboardData?.statistiques?.rendez_vous ??
            dashboardData?.rendez_vous ??
            0,
        });

        // ======================================================
        // DEMANDES MÉDECINS
        // ======================================================

        const demandesData =
          demandesResponse.data?.medecins ||
          demandesResponse.data?.demandes ||
          [];

        setDemandes(demandesData);

        // ======================================================
        // UTILISATEURS
        // ======================================================

        if (optionalRequests[0].status === "fulfilled") {
          const data = optionalRequests[0].value.data;

          setUsers(
            data?.users ||
            data?.utilisateurs ||
            data?.data ||
            []
          );
        }

        // ======================================================
        // SPÉCIALITÉS
        // ======================================================

        if (optionalRequests[1].status === "fulfilled") {
          const data = optionalRequests[1].value.data;

          setSpecialites(
            data?.specialites ||
            data?.data ||
            []
          );
        }

      } catch (err) {
        console.error("Erreur Dashboard:", err);

        setError(
          err.response?.data?.message ||
          "Impossible de charger les données."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Actualisation toutes les 5 secondes
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // ==========================================================
  // STATISTIQUES RÉELLES
  // ==========================================================

  // Nombre réel des médecins
  const totalMedecins = users.filter(
    (item) => item.role === "medecin"
  ).length;

  // Nombre réel des patients
  const totalPatients = users.filter(
    (item) => item.role === "patient"
  ).length;

  // Nombre réel des spécialités
  const totalSpecialites = specialites.length;

  // Nombre réel des rendez-vous
  const totalRendezVous = Number(stats.rendez_vous) || 0;

  // Nombre d'administrateurs
  const adminsCount =
    users.filter((item) => item.role === "admin").length;

  // ==========================================================
  // ACTIVITÉ
  // ==========================================================

  const activityItems = [];

  if (demandes.length > 0) {
    activityItems.push({
      key: "demande",
      icon: "blue",
      emoji: "👨‍⚕️",
      title: "Nouvelle demande médecin",
      detail:
        demandes[0]?.user?.name ||
        demandes[0]?.name ||
        "Nouveau médecin",
      time: "Maintenant",
    });
  }

  if (users.length > 0) {
    activityItems.push({
      key: "user",
      icon: "green",
      emoji: "👥",
      title: "Nouvel utilisateur inscrit",
      detail:
        users[0]?.name ||
        users[0]?.user?.name ||
        "Utilisateur",
      time: "Récent",
    });
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-head">

        <div>
          <h1 className="dashboard-head-H1">
            Dashboard Admin
          </h1>

          <p>
            Bienvenue,{" "}
            <strong>
              {user?.name || "Administrateur"}
            </strong>
          </p>
        </div>

        <div className="current-date">
          📅{" "}
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* =====================================================
          STATISTIQUES
      ===================================================== */}

      <section className="stats-grid">

        {/* ==================================================
            MÉDECINS
        ================================================== */}

        <div className="stat-card">

          <div className="stat-icon blue">
            👨‍⚕️
          </div>

          <div className="stat-info">

            <span>Médecins</span>

            <strong>
              {totalMedecins}
            </strong>

            <small>
              Total des médecins
            </small>

          </div>

          <div className="stat-growth">
            ↑ 12%
          </div>

        </div>

        {/* ==================================================
            PATIENTS
        ================================================== */}

        <div className="stat-card">

          <div className="stat-icon green">
            🧑‍🤝‍🧑
          </div>

          <div className="stat-info">

            <span>Patients</span>

            <strong>
              {totalPatients}
            </strong>

            <small>
              Total des patients
            </small>

          </div>

          <div className="stat-growth">
            ↑ 8%
          </div>

        </div>

        {/* ==================================================
            SPÉCIALITÉS
        ================================================== */}

        <div className="stat-card">

          <div className="stat-icon purple">
            🩺
          </div>

          <div className="stat-info">

            <span>Spécialités</span>

            <strong>
              {totalSpecialites}
            </strong>

            <small>
              Total des spécialités
            </small>

          </div>

          <div className="stat-growth">
            ↑ 5%
          </div>

        </div>

        {/* ==================================================
            RENDEZ-VOUS
        ================================================== */}

        <div className="stat-card">

          <div className="stat-icon orange">
            📅
          </div>

          <div className="stat-info">

            <span>Rendez-vous</span>

            <strong>
            269
            </strong>

            <small>
              Total des rendez-vous
            </small>

          </div>

          <div className="stat-growth">
            ↑ 45%
          </div>

        </div>

      </section>

      {/* =====================================================
          GESTION RAPIDE
      ===================================================== */}

      <section className="section-card">

        <div className="section-titl">
          <h2>Gestion rapide</h2>
        </div>

        <div className="quick-grid">

          {/* ==================================================
              UTILISATEURS
          ================================================== */}

          <div className="quick-column">

            <div className="quick-header">

              <div className="quick-title">

                <div className="mini-icon blue">
                  👥
                </div>

                <h3>
                  Gestion des utilisateurs
                </h3>

              </div>

              <Link
                to="/admin/users"
                className="see-all"
              >
                Voir tous
              </Link>

            </div>

            <div className="quick-content">

              <div className="quick-line">

                <span>
                  <i className="dot blue-dot"></i>
                  Administrateurs
                </span>

                <strong>
                  {adminsCount}
                </strong>

              </div>

              <div className="quick-line">

                <span>
                  <i className="dot green-dot"></i>
                  Total utilisateurs
                </span>

                <strong>
                  {users.length}
                </strong>

              </div>

            </div>

            <Link
              to="/admin/users"
              className="manage-link"
            >
              Gérer les utilisateurs →
            </Link>

          </div>

          {/* ==================================================
              SPÉCIALITÉS
          ================================================== */}

          <div className="quick-column">

            <div className="quick-header">

              <div className="quick-title">

                <div className="mini-icon purple">
                  🩺
                </div>

                <h3>
                  Gestion des spécialités
                </h3>

              </div>

              <Link
                to="/admin/specialites"
                className="see-all"
              >
                Voir toutes
              </Link>

            </div>

            <div className="quick-content">

              {specialites.length > 0 ? (

                specialites
                  .slice(0, 4)
                  .map((specialite, index) => (

                    <div
                      className="quick-line"
                      key={specialite.id || index}
                    >

                      <span>

                        <i
                          className={`dot ${
                            index % 2 === 0
                              ? "purple-dot"
                              : "green-dot"
                          }`}
                        ></i>

                        {specialite.nom ||
                          specialite.name}

                      </span>

                      <strong>
                        {specialite.medecins_count ?? 0}
                      </strong>

                    </div>

                  ))

              ) : (

                <div className="empty-data">
                  Aucune spécialité
                </div>

              )}

            </div>

            <Link
              to="/admin/specialites"
              className="manage-link"
            >
              Gérer les spécialités →
            </Link>

          </div>

          {/* ==================================================
              DEMANDES MÉDECINS
          ================================================== */}

          <div className="quick-column">

            <div className="quick-header">

              <div className="quick-title">

                <div className="mini-icon orange">
                  👨‍⚕️
                </div>

                <h3>
                  Demandes médecins
                </h3>

              </div>

              <Link
                to="/admin/demandes-medecins"
                className="see-all"
              >
                Voir toutes
              </Link>

            </div>

            <div className="requests-list">

              {demandes.length > 0 ? (

                demandes
                  .slice(0, 4)
                  .map((demande, index) => (

                    <div
                      className="request-row"
                      key={demande.id || index}
                    >

                      <div className="request-name">
                        Dr.{" "}
                        {demande.user?.name ||
                          demande.name ||
                          "Médecin"}
                      </div>

                      <div className="request-speciality">
                        {demande.specialite?.nom ||
                          demande.specialite?.name ||
                          demande.specialite ||
                          "—"}
                      </div>

                      <span className="pending-badge">
                        En attente
                      </span>

                    </div>

                  ))

              ) : (

                <div className="empty-data">
                  Aucune demande en attente
                </div>

              )}

            </div>

            <Link
              to="/admin/demandes-medecins"
              className="manage-link"
            >
              Voir toutes les demandes →
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          TABLEAU UTILISATEURS RÉCENTS
      ===================================================== */}

      <div className="bottom-grid">

        <section className="bottom-card users-card">

          <div className="bottom-header">

            <h2>
              Utilisateurs récents
            </h2>

            <Link
              to="/admin/users"
              className="add-button"
            >
              + Ajouter un utilisateur
            </Link>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {users.length > 0 ? (

                  users
                    .slice(0, 5)
                    .map((item, index) => {

                      const currentUser =
                        item.user || item;

                      return (

                        <tr
                          key={item.id || index}
                        >

                          <td>

                            <div className="user-name">

                              <div className="avatar">
                                {currentUser.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <span>
                                {currentUser.name ||
                                  "Utilisateur"}
                              </span>

                            </div>

                          </td>

                          <td>
                            {currentUser.email || "—"}
                          </td>

                          <td>

                            <span
                              className={`role-badge ${
                                currentUser.role ||
                                "patient"
                              }`}
                            >
                              {currentUser.role ||
                                "patient"}
                            </span>

                          </td>

                          <td>

                            <span className="active-badge">
                              Actif
                            </span>

                          </td>

                          <td>

                            <span className="action-menu">
                              ⋮
                            </span>

                          </td>

                        </tr>

                      );

                    })

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      Aucun utilisateur récent
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          <Link
            to="/admin/users"
            className="bottom-link"
          >
            Voir tous les utilisateurs →
          </Link>

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;