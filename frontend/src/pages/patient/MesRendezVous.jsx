import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/MesRendezVous.css";

function MesRendezVous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchRendezVous = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/patient/rendez-vous",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setRendezVous(response.data.rendez_vous || []);
    } catch (error) {
      console.error(error);
      setError("Impossible de récupérer vos rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const annulerRendezVous = async (id) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment annuler ce rendez-vous ?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/patient/rendez-vous/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      fetchRendezVous();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Impossible d'annuler le rendez-vous."
      );
    }
  };

  const getStatusClass = (statut) => {
    switch (statut) {
      case "confirme":
        return "status-confirmed";

      case "termine":
        return "status-finished";

      case "annule":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case "confirme":
        return "Confirmé";

      case "termine":
        return "Terminé";

      case "annule":
        return "Annulé";

      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <div className="rdv-page">
        <div className="rdv-loading">
          <div className="rdv-spinner"></div>

          <h2>Chargement...</h2>

          <p>
            Récupération de vos rendez-vous
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rdv-page">

      <div className="rdv-container">

        {/* ================= HEADER ================= */}

        <Link
          to="/patient/dashboard"
          className="rdv-back"
        >
          ← Retour au dashboard
        </Link>

        <div className="rdv-header">

          <div className="rdv-header-icon">
            📅
          </div>

          <div>
            <span>
              ESPACE PATIENT
            </span>

            <h1>
              Mes rendez-vous
            </h1>

            <p>
              Consultez et gérez vos rendez-vous médicaux.
            </p>
          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="rdv-error">
            ⚠️ {error}
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {rendezVous.length === 0 ? (
          <div className="rdv-empty">

            <div className="rdv-empty-icon">
              📅
            </div>

            <h2>
              Aucun rendez-vous
            </h2>

            <p>
              Vous n'avez pas encore de rendez-vous.
            </p>

            <Link
              to="/patient/specialites"
              className="rdv-primary-button"
            >
              Prendre un rendez-vous →
            </Link>

          </div>
        ) : (

          <div className="rdv-list">

            {rendezVous.map((rdv) => (

              <div
                className="rdv-card"
                key={rdv.id}
              >

                {/* Date */}

                <div className="rdv-date">

                  <span>
                    DATE
                  </span>

                  <strong>
                    {rdv.date}
                  </strong>

                  <small>
                    🕐 {rdv.heure}
                  </small>

                </div>

                {/* Informations */}

                <div className="rdv-info">

                  <h2>
                    Dr.{" "}
                    {rdv.medecin?.user?.name ||
                      "Médecin"}
                  </h2>

                  <p className="rdv-specialite">
                    🩺{" "}
                    {rdv.medecin?.specialite?.nom ||
                      "Non définie"}
                  </p>

                  <p className="rdv-doctor">
                    👨‍⚕️ Consultation médicale
                  </p>

                </div>

                {/* Status */}

                <div className="rdv-status-container">

                  <span
                    className={`rdv-status ${getStatusClass(
                      rdv.statut
                    )}`}
                  >
                    {getStatusText(rdv.statut)}
                  </span>

                  {rdv.statut !== "termine" &&
                    rdv.statut !== "annule" && (

                      <button
                        className="cancel-button"
                        onClick={() =>
                          annulerRendezVous(rdv.id)
                        }
                      >
                        Annuler
                      </button>

                    )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MesRendezVous;