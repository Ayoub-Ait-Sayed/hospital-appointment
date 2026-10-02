import { Link, useNavigate } from "react-router-dom";
import "../../style/PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>
            <span className="dashboard-label">
              ESPACE PATIENT
            </span>
          </div>

          <div className="profile-box">
            <div className="profile-avatar">
              👤
            </div>

            <div>
              <strong>
                Patient
              </strong>

              <span>
                Espace personnel
              </span>
            </div>
          </div>

        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="dashboard-actions">

          <Link
            to="/patient/specialites"
            className="primary-action"
          >
            <span className="action-icon">
              📅
            </span>

            <span>
              Prendre un rendez-vous
            </span>

            <span className="action-arrow">
              →
            </span>
          </Link>

          <Link
            to="/patient/rendez-vous"
            className="secondary-action"
          >
            <span className="action-icon">
              📋
            </span>

            <span>
              Mes rendez-vous
            </span>

            <span className="action-arrow">
              →
            </span>
          </Link>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              📅
            </div>

            <div>
              <h2>2</h2>
              <p>
                Rendez-vous à venir
              </p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <h2>5</h2>
              <p>
                Rendez-vous passés
              </p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">
              👨‍⚕️
            </div>

            <div>
              <h2>3</h2>
              <p>
                Médecins suivis
              </p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              ★
            </div>

            <div>
              <h2>4.8</h2>
              <p>
                Satisfaction globale
              </p>
            </div>

          </div>

        </div>

        {/* ================= CONTENT GRID ================= */}

        <div className="content-grid">

          {/* PROCHAINS RENDEZ-VOUS */}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Prochains rendez-vous
              </h2>

              <Link to="/patient/rendez-vous">
                Voir tout
              </Link>

            </div>

            <div className="appointments">

              <div className="appointment">

                <div className="appointment-date">
                  <strong>24</strong>
                  <span>MAI</span>
                </div>

                <div className="appointment-info">

                  <h3>
                    Dr. Sarah Benkirane
                  </h3>

                  <p>
                    Cardiologie
                  </p>

                  <span>
                    🕐 10:00 - 11:00
                  </span>

                </div>

                <div className="confirmed">
                  Confirmé
                </div>

              </div>

              <div className="appointment">

                <div className="appointment-date">
                  <strong>02</strong>
                  <span>JUIN</span>
                </div>

                <div className="appointment-info">

                  <h3>
                    Dr. Youssef El Amrani
                  </h3>

                  <p>
                    Dermatologie
                  </p>

                  <span>
                    🕐 14:30 - 15:30
                  </span>

                </div>

                <div className="upcoming">
                  À venir
                </div>

              </div>

            </div>

          </div>

          {/* MEDECINS */}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Médecins recommandés
              </h2>

              <Link to="/patient/specialites">
                Voir tout
              </Link>

            </div>

            <div className="doctors">

              <div className="doctor">

                <div className="doctor-avatar">
                  👨‍⚕️
                </div>

                <div className="doctor-info">

                  <h3>
                    Dr. Sarah Benkirane
                  </h3>

                  <p>
                    Cardiologie
                  </p>

                </div>

                <div className="rating">
                  ★ 4.9
                </div>

                <span className="doctor-arrow">
                  →
                </span>

              </div>

              <div className="doctor">

                <div className="doctor-avatar">
                  👨‍⚕️
                </div>

                <div className="doctor-info">

                  <h3>
                    Dr. Youssef El Amrani
                  </h3>

                  <p>
                    Dermatologie
                  </p>

                </div>

                <div className="rating">
                  ★ 4.8
                </div>

                <span className="doctor-arrow">
                  →
                </span>

              </div>

              <div className="doctor">

                <div className="doctor-avatar female">
                  👩‍⚕️
                </div>

                <div className="doctor-info">

                  <h3>
                    Dr. Leila Haddad
                  </h3>

                  <p>
                    Pédiatrie
                  </p>

                </div>

                <div className="rating">
                  ★ 4.7
                </div>

                <span className="doctor-arrow">
                  →
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= HEALTH BANNER ================= */}

        <div className="health-banner">

          <div className="health-icon">
            🛡️
          </div>

          <div className="health-text">

            <h2>
              Votre santé est notre priorité
            </h2>

            <p>
              Prenez soin de vous et de vos proches.
              Nous sommes là pour vous accompagner.
            </p>

          </div>

          <button>
            En savoir plus
          </button>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;