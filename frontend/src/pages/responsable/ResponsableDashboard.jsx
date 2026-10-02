import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Responsable.css";

function ResponsableDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    medecins: 0,
    patients: 0,
    rendezVousAujourdHui: 0,
    attente: 0,
    annules: 0,
    confirmes: 0,
    totalRendezVous: 0,
  });

  const [rendezVous, setRendezVous] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =========================================
  // DATE AUJOURD'HUI
  // =========================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================
  // NORMALISER STATUT
  // =========================================

  const normalizeStatus = (status) => {
    if (!status) {
      return "";
    }

    return status
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]+/g, "_");
  };

  // =========================================
  // FETCH DASHBOARD
  // =========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        medecinsRes,
        patientsRes,
        rendezVousRes,
      ] = await Promise.all([
        axios.get(
          "http://127.0.0.1:8000/api/responsable/medecins",
          { headers }
        ),

        axios.get(
          "http://127.0.0.1:8000/api/responsable/patients",
          { headers }
        ),

        axios.get(
          "http://127.0.0.1:8000/api/responsable/rendez-vous",
          { headers }
        ),
      ]);

      // =========================================
      // MEDECINS
      // =========================================

      const medecinsData =
        medecinsRes.data.medecins || [];

      // =========================================
      // PATIENTS
      // =========================================

      const patientsData =
        patientsRes.data.patients || [];

      // =========================================
      // RENDEZ-VOUS
      // =========================================

      const rendezVousData =
        rendezVousRes.data.rendez_vous ||
        rendezVousRes.data.rendezVous ||
        rendezVousRes.data.rendezvous ||
        [];

      setMedecins(medecinsData);
      setRendezVous(rendezVousData);

      // =========================================
      // DATE AUJOURD'HUI
      // =========================================

      const today = getToday();

      // =========================================
      // RDV AUJOURD'HUI
      // =========================================

      const rendezVousAujourdHui =
        rendezVousData.filter((rdv) => {
          if (!rdv.date) {
            return false;
          }

          return rdv.date.substring(0, 10) === today;
        });

      // =========================================
      // STATUTS
      // =========================================

      let attente = 0;
      let annules = 0;
      let confirmes = 0;

      rendezVousData.forEach((rdv) => {
        const statut = normalizeStatus(rdv.statut);

        if (
          statut === "en_attente" ||
          statut === "attente" ||
          statut === "pending"
        ) {
          attente++;
        } else if (
          statut === "annule" ||
          statut === "annulee" ||
          statut === "cancelled" ||
          statut === "canceled"
        ) {
          annules++;
        } else if (
          statut === "confirme" ||
          statut === "confirmee" ||
          statut === "confirmed"
        ) {
          confirmes++;
        }
      });

      // =========================================
      // STATS
      // =========================================

      setStats({
        medecins: medecinsData.length,
        patients: patientsData.length,
        rendezVousAujourdHui:
          rendezVousAujourdHui.length,
        attente,
        annules,
        confirmes,
        totalRendezVous:
          rendezVousData.length,
      });
    } catch (error) {
      console.error(
        "Erreur récupération dashboard :",
        error
      );

      setError(
        error.response?.data?.message ||
          "Impossible de récupérer les données du dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (statut) => {
    const status = normalizeStatus(statut);

    if (
      status === "confirme" ||
      status === "confirmee" ||
      status === "confirmed"
    ) {
      return "status-confirmed";
    }

    if (
      status === "annule" ||
      status === "annulee" ||
      status === "cancelled" ||
      status === "canceled"
    ) {
      return "status-cancelled";
    }

    return "status-pending";
  };

  // =========================================
  // STATUS TEXT
  // =========================================

  const getStatusText = (statut) => {
    const status = normalizeStatus(statut);

    if (
      status === "confirme" ||
      status === "confirmee" ||
      status === "confirmed"
    ) {
      return "Confirmé";
    }

    if (
      status === "annule" ||
      status === "annulee" ||
      status === "cancelled" ||
      status === "canceled"
    ) {
      return "Annulé";
    }

    return "En attente";
  };

  // =========================================
  // PATIENT
  // =========================================

  const getPatientName = (rdv) => {
    return (
      rdv.patient?.user?.name ||
      rdv.patient?.name ||
      rdv.user?.name ||
      "Non renseigné"
    );
  };

  const getPatientPhone = (rdv) => {
    return (
      rdv.patient?.telephone ||
      rdv.patient?.phone ||
      "Téléphone non renseigné"
    );
  };

  // =========================================
  // MEDECIN
  // =========================================

  const getMedecinName = (rdv) => {
    return (
      rdv.medecin?.user?.name ||
      rdv.medecin?.name ||
      "Non renseigné"
    );
  };

  // =========================================
  // SPECIALITE
  // =========================================

  const getSpecialite = (rdv) => {
    return (
      rdv.medecin?.specialite?.nom ||
      rdv.medecin?.specialite?.name ||
      rdv.specialite?.nom ||
      "Non renseignée"
    );
  };

  // =========================================
  // DATE
  // =========================================

  const getDate = (rdv) => {
    if (!rdv.date) {
      return "Date non renseignée";
    }

    try {
      return new Date(rdv.date).toLocaleDateString(
        "fr-FR"
      );
    } catch {
      return rdv.date;
    }
  };

  // =========================================
  // HEURE
  // =========================================

  const getTime = (rdv) => {
    if (!rdv.heure) {
      return "--:--";
    }

    return rdv.heure.substring(0, 5);
  };

  // =========================================
  // TOP MEDECINS
  // =========================================

  const topMedecins = [...medecins]
    .sort((a, b) => {
      const countA =
        a.rendez_vous_count ||
        a.rendezVousCount ||
        a.rendez_vous?.length ||
        0;

      const countB =
        b.rendez_vous_count ||
        b.rendezVousCount ||
        b.rendez_vous?.length ||
        0;

      return countB - countA;
    })
    .slice(0, 3);

  // =========================================
  // DATE DASHBOARD
  // =========================================

  const currentDate =
    new Date().toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const currentDay =
    new Date().toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
      }
    );

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="responsable-dashboard">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="dash">

        <div className="header-left">

          <h1>
            Dashboard Responsable
          </h1>

          <p>
            Voici un aperçu de l'activité
            de votre établissement aujourd'hui.
          </p>

        </div>

        <div className="header-r">

          <div className="date-b">

            <div className="date-icon">
              📅
            </div>

            <div>

              <strong>
                {currentDate}
              </strong>

              <span>
                {currentDay}
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="error-message"
          style={{
            margin: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >
          {error}
        </div>
      )}


      {/* =====================================
          STATISTIQUES
      ====================================== */}

      <section className="sta-grid">

        {/* RDV AUJOURD'HUI */}

        <div className="stt-card">

          <div className="stat-icon blue">
            📅
          </div>

          <div className="stat-info">

            <span>
              Rendez-vous
              <br />
              aujourd'hui
            </span>

            <strong>
              {loading
                ? "..."
                : stats.rendezVousAujourdHui}
            </strong>

            <small>
              Aujourd'hui
            </small>

          </div>

        </div>


        {/* PATIENTS */}

        <div className="stt-card">

          <div className="stat-icon green">
            👥
          </div>

          <div className="stat-info">

            <span>
              Patients
              <br />
              enregistrés
            </span>

            <strong>
              {loading
                ? "..."
                : stats.patients}
            </strong>

            <small>
              Total des patients
            </small>

          </div>

        </div>


        {/* MEDECINS */}

        <div className="stt-card">

          <div className="stat-icon purple">
            👨‍⚕️
          </div>

          <div className="stat-info">

            <span>
              Médecins
              <br />
              actifs
            </span>

            <strong>
              {loading
                ? "..."
                : stats.medecins}
            </strong>

            <small>
              Médecins enregistrés
            </small>

          </div>

        </div>


        {/* ATTENTE */}

        <div className="stt-card">

          <div className="stat-icon orange">
            🕐
          </div>

          <div className="stat-info">

            <span>
              Rendez-vous
              <br />
              en attente
            </span>

            <strong>
              {loading
                ? "..."
                : stats.attente}
            </strong>

            <small>
              Statut en attente
            </small>

          </div>

        </div>


        {/* ANNULES */}

        <div className="stt-card">

          <div className="stat-icon red">
            ❌
          </div>

          <div className="stat-info">

            <span>
              Rendez-vous
              <br />
              annulés
            </span>

            <strong>
              {loading
                ? "..."
                : stats.annules}
            </strong>

            <small>
              Total annulé
            </small>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN DASHBOARD
      ====================================== */}

      <div className="dashboard-grid">


        {/* ===================================
            COLONNE GAUCHE
        ==================================== */}

        <div className="dashboard-left">


          {/* =================================
              RENDEZ-VOUS RECENTS
          ================================== */}

          <section className="dashboard-cardee appointments-card">

            <div className="card-header">

              <h3>
                Rendez-vous récents
              </h3>

              <Link to="/responsable/rendez-vous">
                Voir tout
              </Link>

            </div>


            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Patient
                    </th>

                    <th>
                      Médecin
                    </th>

                    <th>
                      Spécialité
                    </th>

                    <th>
                      Date & Heure
                    </th>

                    <th>
                      Statut
                    </th>

                    <th>
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        Chargement...
                      </td>

                    </tr>

                  ) : rendezVous.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        Aucun rendez-vous trouvé.
                      </td>

                    </tr>

                  ) : (

                    rendezVous
                      .slice(0, 5)
                      .map((rdv) => (

                        <tr key={rdv.id}>

                          <td>

                            <div className="patient-cell">

                              <div className="patient-avatar">
                                👤
                              </div>

                              <div>

                                <strong>
                                  {getPatientName(rdv)}
                                </strong>

                                <small>
                                  {getPatientPhone(rdv)}
                                </small>

                              </div>

                            </div>

                          </td>


                          <td>
                            {getMedecinName(rdv)}
                          </td>


                          <td>
                            {getSpecialite(rdv)}
                          </td>


                          <td>

                            <div className="date-cell">

                              <span>
                                {getDate(rdv)}
                              </span>

                              <small>
                                {getTime(rdv)}
                              </small>

                            </div>

                          </td>


                          <td>

                            <span
                              className={`status ${getStatusClass(
                                rdv.statut
                              )}`}
                            >
                              {getStatusText(
                                rdv.statut
                              )}
                            </span>

                          </td>


                          <td>

                            <button
                              className="more-btn"
                              type="button"
                            >
                              ⋮
                            </button>

                          </td>

                        </tr>

                      ))

                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* =================================
              ACTIVITE RECENTE
          ================================== */}

          <section className="dashboard-cardee activity-card">

            <div className="card-header">

              <h3>
                Activité récente
              </h3>

            </div>


            <div className="activity-list">

              {rendezVous
                .slice(0, 4)
                .map((rdv) => (

                  <div
                    className="activity-item"
                    key={rdv.id}
                  >

                    <div className="activity-icon blue">
                      📅
                    </div>

                    <p>

                      Rendez-vous de{" "}

                      <strong>
                        {getPatientName(rdv)}
                      </strong>

                      {" "}avec{" "}

                      <strong>
                        Dr.{" "}
                        {getMedecinName(rdv)}
                      </strong>

                      {" "}:

                      {" "}

                      <strong>
                        {getStatusText(rdv.statut)}
                      </strong>

                    </p>

                    <span>
                      {getDate(rdv)}
                    </span>

                  </div>

                ))}


              {rendezVous.length === 0 && (

                <p className="empty-text">
                  Aucune activité récente.
                </p>

              )}

            </div>

          </section>

        </div>


        {/* ===================================
            COLONNE DROITE
        ==================================== */}

        <div className="dashboard-right">


          {/* =================================
              RENDEZ-VOUS PAR STATUT
          ================================== */}

          <section className="dashboard-cardee status-card">
            <div className="card-header">
              <h3>
                Rendez-vous par statut
              </h3>
            </div>
            <div className="status-content">
              <div className="donut-chart">
                <div className="donut-center">
                  <strong>
                    {loading
                      ? "..."
                      : stats.totalRendezVous}
                  </strong>
                  <span>
                    RDV
                  </span>
                </div>
              </div>
              <div className="status-list">
                {/* CONFIRMES */}
                <div className="status-line">
                  <span className="status-dot confirmed-dot"></span>
                  <strong>
                    Confirmés
                  </strong>
                  <b>
                    {loading
                      ? "..."
                      : stats.confirmes}
                  </b>
                </div>
                {/* ATTENTE */}
                <div className="status-line">
                  <span className="status-dot pending-dot"></span>
                  <strong>
                    En attente
                  </strong>
                  <b>
                    {loading
                      ? "..."
                      : stats.attente}
                  </b>
                </div>
                {/* ANNULES */}
                <div className="status-line">
                  <span className="status-dot cancelled-dot"></span>
                  <strong>
                    Annulés
                  </strong>
                  <b>
                    {loading
                      ? "..."
                      : stats.annules}
                  </b>
                </div>
              </div>
            </div>
          </section>


          {/* =================================
              MEDECINS LES PLUS ACTIFS
          ================================== */}

          <section className="dashboard-cardee doctors-active-card">

            <div className="card-header">

              <h3>
                Médecins les plus actifs
              </h3>

              <Link to="/responsable/medecins">
                Voir tout
              </Link>

            </div>


            <div className="doctors-list">

              {topMedecins.length === 0 ? (

                <p className="empty-text">
                  Aucun médecin trouvé.
                </p>

              ) : (

                topMedecins.map(
                  (medecin, index) => {

                    const rdvCount =
                      medecin.rendez_vous_count ||
                      medecin.rendezVousCount ||
                      medecin.rendez_vous?.length ||
                      0;

                    return (

                      <div
                        className="doctor-row"
                        key={
                          medecin.id ||
                          index
                        }
                      >

                        <span className="doctor-rank">
                          {index + 1}
                        </span>


                        <div className="doctor-ava">
                          👨‍⚕️
                        </div>


                        <div className="doctor-name">

                          <strong>

                            Dr.{" "}

                            {medecin.user?.name ||
                              medecin.name ||
                              "Médecin"}

                          </strong>

                        </div>


                        <span className="doctor-speciality">

                          {medecin.specialite?.nom ||
                            medecin.specialite?.name ||
                            "Médecine générale"}

                        </span>


                        <strong className="doctor-rdv">
                          {rdvCount}
                        </strong>


                        <span className="rdv-label">
                          RDV
                        </span>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </section>


          {/* =================================
              ACTIONS RAPIDES
          ================================== */}

          <section className="dashboard-cardee quick-actions-card">

            <div className="card-header">

              <h3>
                Actions rapides
              </h3>

            </div>


            <div className="quick-actions">


              {/* PATIENTS */}

              <Link
                to="/responsable/patients"
                className="quick-action blue-action"
              >

                <div className="quick-icon">
                  👥
                </div>

                <strong>
                  Gérer les patients
                </strong>

                <span>
                  ›
                </span>

              </Link>


              {/* MEDECINS */}

              <Link
                to="/responsable/medecins"
                className="quick-action green-action"
              >

                <div className="quick-icon">
                  👨‍⚕️
                </div>

                <strong>
                  Gérer les médecins
                </strong>

                <span>
                  ›
                </span>

              </Link>


              {/* RENDEZ-VOUS */}

              <Link
                to="/responsable/rendez-vous"
                className="quick-action purple-action"
              >

                <div className="quick-icon">
                  📅
                </div>

                <strong>
                  Gérer les rendez-vous
                </strong>

                <span>
                  ›
                </span>

              </Link>


              {/* RAPPORTS */}

              <button
                className="quick-action orange-action"
                type="button"
              >

                <div className="quick-icon">
                  📊
                </div>

                <strong>
                  Rapports & Statistiques
                </strong>

                <span>
                  ›
                </span>

              </button>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default ResponsableDashboard;
