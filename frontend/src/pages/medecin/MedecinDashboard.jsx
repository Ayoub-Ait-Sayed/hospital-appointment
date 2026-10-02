import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/MedecinDashboard.css";

function MedecinDashboard() {
  const navigate = useNavigate();

  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // NORMALISER TEXTE
  // =====================================================

  const normalizeText = (value) => {
    if (!value) return "";

    return value
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // =====================================================
  // DATE RDV
  // =====================================================

  const getDateValue = (rdv) => {
    if (!rdv?.date) return "";

    return rdv.date.toString().substring(0, 10);
  };

  // =====================================================
  // HEURE RDV
  // =====================================================

  const getTime = (rdv) => {
    if (!rdv?.heure) {
      return "--:--";
    }

    return rdv.heure.toString().substring(0, 5);
  };

  // =====================================================
  // NOM PATIENT
  // =====================================================

  const getPatientName = (rdv) => {
    return (
      rdv?.patient?.user?.name ||
      rdv?.patient?.name ||
      rdv?.user?.name ||
      "Patient"
    );
  };

  // =====================================================
  // SPECIALITE / MOTIF
  // =====================================================

  const getAppointmentType = (rdv) => {
    return (
      rdv?.motif ||
      rdv?.type ||
      rdv?.consultation ||
      rdv?.specialite?.nom ||
      rdv?.specialite?.name ||
      "Consultation médicale"
    );
  };

  // =====================================================
  // STATUT
  // =====================================================

  const getStatus = (rdv) => {
    const status = normalizeText(rdv?.statut);

    if (
      status === "confirme" ||
      status === "confirmee" ||
      status === "confirmed"
    ) {
      return "confirmed";
    }

    if (
      status === "annule" ||
      status === "annulee" ||
      status === "cancelled" ||
      status === "canceled"
    ) {
      return "cancelled";
    }

    if (
      status === "termine" ||
      status === "terminee" ||
      status === "completed"
    ) {
      return "completed";
    }

    return "pending";
  };

  const getStatusLabel = (rdv) => {
    const status = getStatus(rdv);

    if (status === "confirmed") {
      return "Confirmé";
    }

    if (status === "cancelled") {
      return "Annulé";
    }

    if (status === "completed") {
      return "Terminé";
    }

    return "En attente";
  };

  // =====================================================
  // DATE AUJOURD'HUI
  // =====================================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // FETCH RENDEZ-VOUS
  // =====================================================

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/medecin/rendez-vous",
        {
          headers,
        }
      );

      const data =
        response.data?.rendez_vous ||
        response.data?.rendezVous ||
        response.data?.rendezvous ||
        response.data ||
        [];

      setRendezVous(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Erreur récupération rendez-vous :",
        err
      );

      setError(
        err.response?.data?.message ||
          "Impossible de charger les données."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchRendezVous();
  }, []);

  // =====================================================
  // STATISTIQUES
  // =====================================================

  const stats = useMemo(() => {
    const today = getToday();

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // -----------------------------------------------
    // RDV AUJOURD'HUI
    // -----------------------------------------------

    const todayAppointments = rendezVous.filter(
      (rdv) =>
        getDateValue(rdv) === today &&
        getStatus(rdv) !== "cancelled"
    );

    // -----------------------------------------------
    // RDV CE MOIS
    // -----------------------------------------------

    const monthAppointments =
      rendezVous.filter((rdv) => {
        const dateValue = getDateValue(rdv);

        if (!dateValue) return false;

        const date = new Date(
          `${dateValue}T00:00:00`
        );

        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth &&
          getStatus(rdv) !== "cancelled"
        );
      });

    // -----------------------------------------------
    // PATIENTS SUIVIS
    // -----------------------------------------------

    const patientIds = rendezVous
      .filter(
        (rdv) =>
          getStatus(rdv) !== "cancelled"
      )
      .map(
        (rdv) =>
          rdv?.patient?.id ||
          rdv?.patient_id ||
          rdv?.patient?.user?.id
      )
      .filter(Boolean);

    const uniquePatients = [
      ...new Set(patientIds),
    ];

    return {
      today: todayAppointments.length,

      month: monthAppointments.length,

      patients:
        uniquePatients.length ||
        new Set(
          rendezVous
            .filter(
              (rdv) =>
                getStatus(rdv) !== "cancelled"
            )
            .map((rdv) =>
              getPatientName(rdv)
            )
        ).size,
    };
  }, [rendezVous]);

  // =====================================================
  // PROCHAINS RENDEZ-VOUS
  // =====================================================

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return [...rendezVous]
      .filter((rdv) => {
        const date = getDateValue(rdv);

        if (!date) return false;

        if (
          getStatus(rdv) === "cancelled"
        ) {
          return false;
        }

        const appointmentDate = new Date(
          `${date}T${getTime(rdv) === "--:--"
            ? "00:00"
            : getTime(rdv)}`
        );

        return appointmentDate >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${getDateValue(a)}T${
            getTime(a) === "--:--"
              ? "00:00"
              : getTime(a)
          }`
        );

        const dateB = new Date(
          `${getDateValue(b)}T${
            getTime(b) === "--:--"
              ? "00:00"
              : getTime(b)
          }`
        );

        return dateA - dateB;
      })
      .slice(0, 3);
  }, [rendezVous]);

  // =====================================================
  // FORMAT JOUR
  // =====================================================

  const getAppointmentDay = (rdv) => {
    const date = getDateValue(rdv);

    if (!date) return "--";

    const parts = date.split("-");

    return parts[2] || "--";
  };

  // =====================================================
  // FORMAT MOIS
  // =====================================================

  const getAppointmentMonth = (rdv) => {
    const date = getDateValue(rdv);

    if (!date) return "---";

    const parts = date.split("-");

    if (parts.length !== 3) {
      return "---";
    }

    const localDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return localDate
      .toLocaleDateString("fr-FR", {
        month: "short",
      })
      .replace(".", "")
      .toUpperCase();
  };

  // =====================================================
  // JOUR RDV
  // =====================================================

  const isToday = (rdv) => {
    return getDateValue(rdv) === getToday();
  };

  // =====================================================
  // NOM MEDECIN
  // =====================================================

  const doctorName =
    user?.name ||
    user?.nom ||
    "Médecin";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="medecin-dashboard">
        <div className="dashboard-content">
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medecin-dashboard">

      {/* Background image */}
      <div className="dashboard-bg">
        <img
          src="/src/photo/background-medcindashbord.png"
          alt=""
        />
      </div>

      <div className="dashboard-content">

        {/* HEADER */}
        <header className="dashboard-header">
        </header>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fff1f2",
              color: "#c62828",
              padding: "12px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="dashboard-buttons">

          <Link
            to="/medecin/rendez-vous"
            className="dashboard-btn blue-btn"
          >
            <div className="btn-icon">
              📅
            </div>

            <div className="btn-content">
              <h3>
                Mes rendez-vous
              </h3>

              <p>
                Consulter et gérer vos rendez-vous
              </p>
            </div>

            <span className="arrow">
              ›
            </span>
          </Link>

          <Link
            to="/medecin/disponibilites"
            className="dashboard-btn green-btn"
          >
            <div className="btn-icon">
              ◷
            </div>

            <div className="btn-content">
              <h3>
                Mes disponibilités
              </h3>

              <p>
                Gérer vos horaires disponibles
              </p>
            </div>

            <span className="arrow">
              ›
            </span>
          </Link>

          <Link
            to="/medecin/profile"
            className="dashboard-btn purple-btn"
          >
            <div className="btn-icon">
              👤
            </div>

            <div className="btn-content">
              <h3>
                Mon profil
              </h3>

              <p>
                Voir et modifier vos informations
              </p>
            </div>

            <span className="arrow">
              ›
            </span>
          </Link>

        </div>

        {/* STATISTIQUES */}
        <div className="stats-container">

          {/* AUJOURD'HUI */}
          <div className="stat-card blue-stat">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <strong>
                {stats.today}
              </strong>

              <span>
                Rendez-vous aujourd'hui
              </span>
            </div>

          </div>

          {/* CE MOIS */}
          <div className="stat-card green-stat">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <strong>
                {stats.month}
              </strong>

              <span>
                Rendez-vous ce mois
              </span>
            </div>

          </div>

          {/* PATIENTS */}
          <div className="stat-card orange-stat">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <strong>
                {stats.patients}
              </strong>

              <span>
                Patients suivis
              </span>
            </div>

          </div>

          {/* NOTE */}
          <div className="stat-card purple-stat">

            <div className="stat-icon">
              ☆
            </div>

            <div>
              <strong>
                4.5
              </strong>

              <span>
                Note moyenne
              </span>
            </div>

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="dashboard-grid">

          {/* RENDEZ-VOUS */}
          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Prochains rendez-vous
              </h2>

              <Link to="/medecin/rendez-vous">
                Voir tout
              </Link>

            </div>

            <div className="appointments">

              {upcomingAppointments.length === 0 ? (

                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#98a2b3",
                  }}
                >
                  Aucun prochain rendez-vous.
                </div>

              ) : (

                upcomingAppointments.map(
                  (rdv) => (

                    <div
                      className="appointment"
                      key={rdv.id}
                    >

                      <div className="appointment-time">

                        <strong>
                          {getTime(rdv)}
                        </strong>

                        <span>
                          {isToday(rdv)
                            ? "Aujourd'hui"
                            : `${getAppointmentDay(
                                rdv
                              )} ${getAppointmentMonth(
                                rdv
                              )}`}
                        </span>

                      </div>

                      <div className="patient-avatar">
                        👤
                      </div>

                      <div className="patient-info">

                        <strong>
                          {getPatientName(
                            rdv
                          )}
                        </strong>

                        <span>
                          {getAppointmentType(
                            rdv
                          )}
                        </span>

                      </div>

                      <span
                        className={`status ${getStatus(
                          rdv
                        )}`}
                      >
                        {getStatusLabel(
                          rdv
                        )}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

          {/* PLANNING */}
          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Planning aujourd'hui
              </h2>

              <Link to="/medecin/disponibilites">
                Voir calendrier
              </Link>

            </div>

            <div className="planning-box">

              <div className="planning-title">

                <div className="clock-icon">
                  ◷
                </div>

                <div>

                  <strong>
                    Planning
                  </strong>

                  <span>
                    {stats.today} rendez-vous
                    aujourd'hui
                  </span>

                </div>

                <i className="green-dot"></i>

              </div>

              <div className="planning-row">

                <span>
                  Rendez-vous
                </span>

                <strong>
                  {stats.today}
                </strong>

              </div>

              <div className="planning-row">

                <span>
                  Confirmés
                </span>

                <strong>
                  {
                    rendezVous.filter(
                      (rdv) =>
                        isToday(rdv) &&
                        getStatus(rdv) ===
                          "confirmed"
                    ).length
                  }
                </strong>

              </div>

              <div className="planning-row">

                <span>
                  En attente
                </span>

                <strong>
                  {
                    rendezVous.filter(
                      (rdv) =>
                        isToday(rdv) &&
                        getStatus(rdv) ===
                          "pending"
                    ).length
                  }
                </strong>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER INFO */}
        <div className="dashboard-footer">

          <div className="footer-icon">
            ✓
          </div>

          <div>

            <h3>
              Gérez efficacement votre activité
            </h3>

            <p>
              Gardez votre planning à jour et
              offrez le meilleur suivi à vos
              patients.
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/medecin/rendez-vous"
              )
            }
          >
            En savoir plus
          </button>

        </div>

      </div>
    </div>
  );
}

export default MedecinDashboard;
