import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MesRendezVous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Charger les rendez-vous
  // ==========================================
  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/medecin/rendez-vous",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = response.data.rendez_vous || [];

      // ==========================================
      // Date d'aujourd'hui à 00:00
      // ==========================================
      const aujourdHui = new Date();

      aujourdHui.setHours(0, 0, 0, 0);

      // ==========================================
      // Date limite : il y a 7 jours
      // ==========================================
      const dateLimite = new Date(aujourdHui);

      dateLimite.setDate(
        dateLimite.getDate() - 7
      );

      // ==========================================
      // Filtrer les rendez-vous
      // ==========================================
      const rendezVousFiltres = data.filter((rdv) => {

        // Si pas de date => ne pas afficher
        if (!rdv.date) {
          return false;
        }

        const dateRdv = new Date(rdv.date);

        // Date invalide => ne pas afficher
        if (isNaN(dateRdv.getTime())) {
          return false;
        }

        // Comparaison uniquement par date
        dateRdv.setHours(0, 0, 0, 0);

        /*
          On garde :

          - les rendez-vous futurs
          - aujourd'hui
          - les 7 derniers jours

          On cache :

          - tout rendez-vous plus ancien
            que 7 jours
        */

        return dateRdv >= dateLimite;
      });

      setRendezVous(rendezVousFiltres);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les rendez-vous."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Charger au démarrage
  // ==========================================
  useEffect(() => {
    fetchRendezVous();
  }, []);

  // ==========================================
  // Confirmer
  // ==========================================
  const confirmer = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://127.0.0.1:8000/api/medecin/rendez-vous/${id}/confirmer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert(
        "Rendez-vous confirmé avec succès."
      );

      fetchRendezVous();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la confirmation."
      );
    }
  };

  // ==========================================
  // Annuler
  // ==========================================
  const annuler = async (id) => {

    const confirmation = window.confirm(
      "Voulez-vous vraiment annuler ce rendez-vous ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://127.0.0.1:8000/api/medecin/rendez-vous/${id}/annuler`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert(
        "Rendez-vous annulé avec succès."
      );

      fetchRendezVous();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de l'annulation."
      );
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>

          <h2>
            Chargement...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================
  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>
          <span style={styles.label}>
            ESPACE MÉDECIN
          </span>

          <h1 style={styles.title}>
            Mes rendez-vous
          </h1>

          <p style={styles.subtitle}>
            Consultez et gérez vos rendez-vous.
          </p>
        </div>

        <Link
          to="/medecin/dashboard"
          style={styles.backButton}
        >
          ← Retour
        </Link>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* ================= CONTENT ================= */}

      <div style={styles.content}>

        {rendezVous.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📅
            </div>

            <h2>
              Aucun rendez-vous
            </h2>

            <p>
              Aucun rendez-vous à afficher pour
              les 7 derniers jours et les prochains
              rendez-vous.
            </p>

          </div>

        ) : (

          rendezVous.map((rdv) => {

            // ==========================================
            // Vérifier si le RDV est passé
            // ==========================================

            const maintenant = new Date();

            const dateRdv = new Date(rdv.date);

            const estPasse =
              !isNaN(dateRdv.getTime()) &&
              dateRdv < maintenant;

            return (

              <div
                key={rdv.id}
                style={styles.card}
              >

                {/* ================= CARD HEADER ================= */}

                <div style={styles.cardHeader}>

                  <div style={styles.patientContainer}>

                    <div style={styles.avatar}>
                      👤
                    </div>

                    <div>

                      <h2 style={styles.patientName}>
                        {rdv.patient?.user?.name ||
                          "Patient inconnu"}
                      </h2>

                      <p style={styles.email}>
                        {rdv.patient?.user?.email ||
                          "Email non renseigné"}
                      </p>

                    </div>

                  </div>

                  {/* STATUS */}

                  <span
                    style={{
                      ...styles.status,
                      ...(rdv.statut === "confirme"
                        ? styles.confirmed
                        : rdv.statut === "en_attente"
                        ? styles.pending
                        : styles.cancelled),
                    }}
                  >

                    {rdv.statut === "confirme"
                      ? "Confirmé"
                      : rdv.statut === "en_attente"
                      ? "En attente"
                      : rdv.statut === "annule"
                      ? "Annulé"
                      : rdv.statut}

                  </span>

                </div>

                {/* ================= INFO ================= */}

                <div style={styles.infoGrid}>

                  <div style={styles.infoBox}>

                    <span style={styles.infoLabel}>
                      📅 Date
                    </span>

                    <strong style={styles.infoValue}>
                      {rdv.date ||
                        "Non renseignée"}
                    </strong>

                  </div>

                  <div style={styles.infoBox}>

                    <span style={styles.infoLabel}>
                      🕐 Heure
                    </span>

                    <strong style={styles.infoValue}>
                      {rdv.heure ||
                        "Non renseignée"}
                    </strong>

                  </div>

                  <div style={styles.infoBox}>

                    <span style={styles.infoLabel}>
                      📞 Téléphone
                    </span>

                    <strong style={styles.infoValue}>
                      {rdv.patient?.telephone ||
                        "Non renseigné"}
                    </strong>

                  </div>

                </div>

                {/* ================= RDV PASSÉ ================= */}

                {estPasse && (
                  <div style={styles.passed}>
                    ✓ Rendez-vous passé
                  </div>
                )}

                {/* ================= ACTIONS ================= */}

                {rdv.statut === "en_attente" && (

                  <div style={styles.actions}>

                    <button
                      onClick={() =>
                        confirmer(rdv.id)
                      }
                      style={{
                        ...styles.button,
                        ...styles.confirmButton,
                      }}
                    >
                      ✓ Confirmer
                    </button>

                    <button
                      onClick={() =>
                        annuler(rdv.id)
                      }
                      style={{
                        ...styles.button,
                        ...styles.cancelButton,
                      }}
                    >
                      ✕ Annuler
                    </button>

                  </div>

                )}

                {rdv.statut === "confirme" && (

                  <div style={styles.actions}>

                    <button
                      onClick={() =>
                        annuler(rdv.id)
                      }
                      style={{
                        ...styles.button,
                        ...styles.cancelButton,
                      }}
                    >
                      ✕ Annuler
                    </button>

                  </div>

                )}

              </div>

            );
          })

        )}

      </div>

    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "35px",
    boxSizing: "border-box",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingBox: {
    textAlign: "center",
    color: "#374151",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #e5e7eb",
    borderTop:
      "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 15px",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  label: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },

  title: {
    margin: "6px 0 5px",
    fontSize: "32px",
    color: "#111827",
    fontWeight: "700",
  },

  subtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
  },

  backButton: {
    textDecoration: "none",
    background: "#ffffff",
    color: "#2563eb",
    padding: "12px 20px",
    borderRadius: "10px",
    border:
      "1px solid #dbe3ef",
    fontWeight: "600",
  },

  error: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    padding: "15px 18px",
    background: "#fee2e2",
    color: "#b91c1c",
    border:
      "1px solid #fecaca",
    borderRadius: "10px",
  },

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "25px",
    marginBottom: "18px",
    boxShadow:
      "0 5px 20px rgba(15, 23, 42, 0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    paddingBottom: "20px",
    borderBottom:
      "1px solid #eef0f4",
  },

  patientContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  patientName: {
    margin: 0,
    fontSize: "19px",
    color: "#111827",
  },

  email: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  status: {
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  confirmed: {
    background: "#dcfce7",
    color: "#15803d",
  },

  pending: {
    background: "#fef3c7",
    color: "#b45309",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
    padding: "22px 0",
  },

  infoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },

  infoValue: {
    fontSize: "15px",
    color: "#111827",
  },

  passed: {
    padding: "10px 14px",
    background: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "15px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    paddingTop: "5px",
  },

  button: {
    border: "none",
    padding: "11px 18px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  confirmButton: {
    background: "#16a34a",
    color: "#ffffff",
  },

  cancelButton: {
    background: "#ef4444",
    color: "#ffffff",
  },

  empty: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "60px 30px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },
};

export default MesRendezVous;
