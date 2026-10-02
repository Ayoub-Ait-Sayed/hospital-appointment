import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Disponibilites() {
  const { medecinId } = useParams();
  const navigate = useNavigate();

  const [medecin, setMedecin] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [creneauxReserves, setCreneauxReserves] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =====================================================
  // RECUPERER LES DISPONIBILITES
  // =====================================================

  useEffect(() => {
    const getDisponibilites = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/medecins/${medecinId}/disponibilites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("REPONSE API :", response.data);
        console.log(
          "CRENEAUX RESERVES :",
          response.data.creneaux_reserves
        );
  console.log("REPONSE API :", response.data);
console.log("CRENEAUX RESERVES :", response.data.creneaux_reserves);
        setMedecin(response.data.medecin || []);
        setDisponibilites(response.data.disponibilites || []);
        setCreneauxReserves(response.data.creneaux_reserves || []);
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Impossible de récupérer les disponibilités."
        );
      } finally {
        setLoading(false);
      }
    };

    getDisponibilites();
  }, [medecinId, token]);

  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <h2>Chargement...</h2>
      </div>
    );
  }

  // =====================================================
  // DATES DISPONIBLES
  // =====================================================

  const dates = [
    ...new Set(
      disponibilites
        .map((disponibilite) => disponibilite.date)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // DISPONIBILITES DU JOUR SELECTIONNE
  // =====================================================

  const disponibilitesDuJour = disponibilites.filter(
    (disponibilite) => disponibilite.date === selectedDate
  );

  // =====================================================
  // GENERER LES CRENEAUX DE 20 MINUTES
  // =====================================================

  const genererCreneaux = (heureDebut, heureFin) => {
    if (!heureDebut || !heureFin) {
      return [];
    }

    const creneaux = [];

    const [heureDebutNumber, minuteDebutNumber] = heureDebut
      .slice(0, 5)
      .split(":")
      .map(Number);

    const [heureFinNumber, minuteFinNumber] = heureFin
      .slice(0, 5)
      .split(":")
      .map(Number);

    let debutMinutes =
      heureDebutNumber * 60 + minuteDebutNumber;

    const finMinutes =
      heureFinNumber * 60 + minuteFinNumber;

    while (debutMinutes + 20 <= finMinutes) {
      const finCreneau = debutMinutes + 20;

      const heureDebutCreneau = String(
        Math.floor(debutMinutes / 60)
      ).padStart(2, "0");

      const minuteDebutCreneau = String(
        debutMinutes % 60
      ).padStart(2, "0");

      const heureFinCreneau = String(
        Math.floor(finCreneau / 60)
      ).padStart(2, "0");

      const minuteFinCreneau = String(
        finCreneau % 60
      ).padStart(2, "0");

      creneaux.push({
        heureDebut: `${heureDebutCreneau}:${minuteDebutCreneau}`,
        heureFin: `${heureFinCreneau}:${minuteFinCreneau}`,
      });

      debutMinutes += 20;
    }

    return creneaux;
  };

  // =====================================================
  // CREER TOUS LES CRENEAUX DU JOUR
  // =====================================================

  const tousLesCreneaux = [];

  disponibilitesDuJour.forEach((disponibilite) => {
    const creneaux = genererCreneaux(
      disponibilite.heure_debut,
      disponibilite.heure_fin
    );

    creneaux.forEach((creneau) => {
      tousLesCreneaux.push({
        ...creneau,
        disponibilite,
      });
    });
  });

  // =====================================================
  // SUPPRIMER LES DOUBLONS
  // =====================================================

  const creneauxUniques = [];

  tousLesCreneaux.forEach((creneau) => {
    const existe = creneauxUniques.some(
      (item) =>
        item.heureDebut === creneau.heureDebut &&
        item.heureFin === creneau.heureFin
    );

    if (!existe) {
      creneauxUniques.push(creneau);
    }
  });

  // =====================================================
  // NORMALISER LA DATE
  // =====================================================

  const normaliserDate = (date) => {
    if (!date) {
      return "";
    }

    return String(date).slice(0, 10);
  };

  // =====================================================
  // NORMALISER L'HEURE
  // =====================================================

  const normaliserHeure = (heure) => {
    if (!heure) {
      return "";
    }

    return String(heure).slice(0, 5);
  };

  // =====================================================
  // VERIFIER SI UN CRENEAU EST RESERVE
  // =====================================================

  const estCreneauReserve = (date, heureDebut) => {
    const dateRecherchee = normaliserDate(date);
    const heureRecherchee = normaliserHeure(heureDebut);

    const reserve = creneauxReserves.some(
      (creneauReserve) => {
        const dateReservee = normaliserDate(
          creneauReserve.date ||
            creneauReserve.date_rendez_vous ||
            creneauReserve.date_rdv ||
            creneauReserve.rendez_vous?.date ||
            creneauReserve.rendez_vous?.date_rendez_vous ||
            creneauReserve.rendezVous?.date ||
            creneauReserve.rendezVous?.date_rendez_vous
        );

        const heureReservee = normaliserHeure(
          creneauReserve.heure ||
            creneauReserve.heure_debut ||
            creneauReserve.heure_rendez_vous ||
            creneauReserve.heure_rdv ||
            creneauReserve.rendez_vous?.heure ||
            creneauReserve.rendez_vous?.heure_debut ||
            creneauReserve.rendezVous?.heure ||
            creneauReserve.rendezVous?.heure_debut
        );

        return (
          dateReservee === dateRecherchee &&
          heureReservee === heureRecherchee
        );
      }
    );

    return reserve;
  };

  // =====================================================
  // OUVRIR LE MODAL
  // =====================================================

  const ouvrirConfirmation = (disponibilite, creneau) => {
    if (
      estCreneauReserve(
        disponibilite.date,
        creneau.heureDebut
      )
    ) {
      return;
    }

    setSelectedCreneau({
      disponibilite,
      creneau,
    });

    setShowConfirmModal(true);
  };

  // =====================================================
  // FERMER LE MODAL
  // =====================================================

  const fermerConfirmation = () => {
    if (confirmLoading) {
      return;
    }

    setShowConfirmModal(false);
    setSelectedCreneau(null);
  };

  // =====================================================
  // CONFIRMER LE RENDEZ-VOUS
  // =====================================================

  const confirmerRendezVous = async () => {
    if (!selectedCreneau) {
      return;
    }

    const { disponibilite, creneau } = selectedCreneau;

    if (
      estCreneauReserve(
        disponibilite.date,
        creneau.heureDebut
      )
    ) {
      alert("Ce créneau est déjà réservé.");
      fermerConfirmation();
      return;
    }

    setConfirmLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/rendez-vous",
        {
          medecin_id: medecinId,
          date: disponibilite.date,
          heure: creneau.heureDebut,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Ajouter immédiatement le créneau aux réservés
      setCreneauxReserves((previous) => [
        ...previous,
        {
          date: disponibilite.date,
          heure: creneau.heureDebut,
        },
      ]);

      setShowConfirmModal(false);
      setSelectedCreneau(null);

      navigate("/patient/rendez-vous");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Impossible de créer le rendez-vous."
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const dateObj = new Date(`${date}T00:00:00`);

    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Disponibilités du médecin
          </h1>

          <p style={styles.subtitle}>
            Choisissez une date et un créneau de 20 minutes
          </p>
        </div>

        <button
          onClick={() => navigate("/patient/specialites")}
          style={styles.backButton}
        >
          ← Retour
        </button>
      </div>

      {/* ================= MEDECIN ================= */}

      {medecin && (
        <div style={styles.doctorCard}>
          <div style={styles.doctorIcon}>
            👨‍⚕️
          </div>

          <div>
            <h2 style={styles.doctorName}>
              Dr. {medecin.user?.name || ""}
            </h2>

            <p style={styles.specialite}>
              🩺{" "}
              {medecin.specialite?.nom || "Médecin"}
            </p>
          </div>
        </div>
      )}

      {/* ================= DATE ================= */}

      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <div style={styles.number}>1</div>

          <div>
            <h2 style={styles.sectionTitle}>
              Choisir une date
            </h2>

            <p style={styles.sectionSubtitle}>
              Sélectionnez le jour de votre rendez-vous
            </p>
          </div>
        </div>

        {dates.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📅</div>

            <h3>Aucune disponibilité</h3>

            <p>
              Ce médecin n'a actuellement aucune
              disponibilité.
            </p>
          </div>
        ) : (
          <div style={styles.datesContainer}>
            {dates.map((date) => {
              const dateObj = new Date(
                `${date}T00:00:00`
              );

              const jour =
                dateObj.toLocaleDateString(
                  "fr-FR",
                  {
                    weekday: "long",
                  }
                );

              const dateFormatee =
                dateObj.toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );

              const selected =
                selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    ...styles.dateButton,
                    ...(selected
                      ? styles.dateButtonSelected
                      : {}),
                  }}
                >
                  <span
                    style={{
                      ...styles.jour,
                      ...(selected
                        ? styles.jourSelected
                        : {}),
                    }}
                  >
                    {jour}
                  </span>

                  <span
                    style={{
                      ...styles.dateText,
                      ...(selected
                        ? styles.dateTextSelected
                        : {}),
                    }}
                  >
                    {dateFormatee}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= HEURES ================= */}

      {selectedDate && (
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <div style={styles.number}>2</div>

            <div>
              <h2 style={styles.sectionTitle}>
                Choisir une heure
              </h2>

              <p style={styles.sectionSubtitle}>
                Chaque rendez-vous dure 20 minutes
              </p>
            </div>
          </div>

          <div style={styles.selectedDate}>
            📅 Date sélectionnée :{" "}
            <strong>
              {formatDate(selectedDate)}
            </strong>
          </div>

          {creneauxUniques.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>📅</div>

              <h3>Aucun créneau disponible</h3>

              <p>
                Aucun créneau disponible pour cette date.
              </p>
            </div>
          ) : (
            <div style={styles.timeGrid}>
              {creneauxUniques.map(
                (creneau, index) => {
                  const reserve = estCreneauReserve(
                    selectedDate,
                    creneau.heureDebut
                  );

                  // =========================================
                  // CRENEAU DEJA RESERVE
                  // GRIS + NON CLIQUABLE
                  // =========================================

                  if (reserve) {
                    return (
                      <div
                        key={`${creneau.heureDebut}-${creneau.heureFin}-${index}`}
                        style={styles.reservedSlot}
                      >
                        <div
                          style={styles.reservedClock}
                        >
                          🔒
                        </div>

                        <div>
                          <div
                            style={styles.reservedTime}
                          >
                            {creneau.heureDebut}
                            {" → "}
                            {creneau.heureFin}
                          </div>

                          <div
                            style={styles.reservedText}
                          >
                            Déjà réservé
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // =========================================
                  // CRENEAU DISPONIBLE
                  // BLEU AU SURVOL + CLIQUABLE
                  // =========================================

                  return (
                    <button
                      key={`${creneau.heureDebut}-${creneau.heureFin}-${index}`}
                      onClick={() =>
                        ouvrirConfirmation(
                          creneau.disponibilite,
                          creneau
                        )
                      }
                      style={styles.timeButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "#1f4fa3";

                        e.currentTarget.style.color =
                          "white";

                        e.currentTarget.style.transform =
                          "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "white";

                        e.currentTarget.style.color =
                          "#1f2937";

                        e.currentTarget.style.transform =
                          "translateY(0)";
                      }}
                    >
                      <div style={styles.clock}>
                        🕐
                      </div>

                      <div>
                        <div style={styles.time}>
                          {creneau.heureDebut}
                          {" → "}
                          {creneau.heureFin}
                        </div>

                        <div style={styles.duration}>
                          Durée : 20 minutes
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= FOOTER ================= */}

      <div style={styles.security}>
        🔒 Vos informations sont sécurisées
      </div>

      {/* ================= MODAL ================= */}

      {showConfirmModal && selectedCreneau && (
        <div
          style={styles.modalOverlay}
          onClick={fermerConfirmation}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalIconContainer}>
              <div style={styles.modalIcon}>
                📅

                <div style={styles.checkIcon}>
                  ✓
                </div>
              </div>
            </div>

            <h2 style={styles.modalTitle}>
              Confirmer le rendez-vous
            </h2>

            <p style={styles.modalSubtitle}>
              Veuillez vérifier les détails de votre
              rendez-vous avant de confirmer.
            </p>

            <div style={styles.detailsCard}>

              {/* DATE */}

              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  📅
                </div>

                <div>
                  <div style={styles.detailLabel}>
                    Date
                  </div>

                  <div style={styles.detailValue}>
                    {formatDate(
                      selectedCreneau.disponibilite.date
                    )}
                  </div>
                </div>
              </div>

              {/* HEURE */}

              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  🕐
                </div>

                <div>
                  <div style={styles.detailLabel}>
                    Heure
                  </div>

                  <div style={styles.detailValue}>
                    {
                      selectedCreneau.creneau
                        .heureDebut
                    }

                    {" → "}

                    {
                      selectedCreneau.creneau
                        .heureFin
                    }
                  </div>
                </div>
              </div>

              {/* MEDECIN */}

              <div
                style={{
                  ...styles.detailRow,
                  borderBottom: "none",
                }}
              >
                <div style={styles.detailIcon}>
                  👨‍⚕️
                </div>

                <div>
                  <div style={styles.detailLabel}>
                    Médecin
                  </div>

                  <div style={styles.detailValue}>
                    Dr.{" "}
                    {medecin?.user?.name ||
                      "Médecin sélectionné"}
                  </div>
                </div>
              </div>
            </div>

            {/* BOUTONS */}

            <div style={styles.modalButtons}>
              <button
                onClick={fermerConfirmation}
                disabled={confirmLoading}
                style={{
                  ...styles.cancelButton,
                  ...(confirmLoading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                ✕ Annuler
              </button>

              <button
                onClick={confirmerRendezVous}
                disabled={confirmLoading}
                style={{
                  ...styles.confirmButton,
                  ...(confirmLoading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                {confirmLoading
                  ? "Confirmation..."
                  : "✓ Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background:
      "linear-gradient(135deg, #f4f8ff, #ffffff)",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#1f2937",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    color: "#173b72",
    fontSize: "32px",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },

  backButton: {
    padding: "11px 20px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  doctorCard: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    padding: "22px",
    background: "white",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.05)",
  },

  doctorIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#e8f1ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  doctorName: {
    margin: 0,
    color: "#173b72",
  },

  specialite: {
    color: "#64748b",
    marginBottom: 0,
  },

  card: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    padding: "30px",
    background: "white",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  number: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#1f4fa3",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#1e293b",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  datesContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "14px",
  },

  dateButton: {
    padding: "18px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "13px",
    background: "white",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    transition: "all 0.2s",
  },

  dateButtonSelected: {
    background:
      "linear-gradient(135deg, #1f4fa3, #3974d4)",
    border: "2px solid #1f4fa3",
    boxShadow:
      "0 7px 18px rgba(31,79,163,0.25)",
  },

  jour: {
    color: "#374151",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  jourSelected: {
    color: "white",
  },

  dateText: {
    color: "#64748b",
    fontSize: "14px",
  },

  dateTextSelected: {
    color: "#e0edff",
  },

  selectedDate: {
    background: "#eef5ff",
    color: "#1f4fa3",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "25px",
    border: "1px solid #d4e4ff",
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "15px",
  },

  timeButton: {
    padding: "17px",
    border: "1px solid #dbe1ea",
    borderRadius: "14px",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    transition: "all 0.2s",
  },

  clock: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#eef5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  time: {
    fontWeight: "bold",
    fontSize: "16px",
  },

  duration: {
    marginTop: "5px",
    color: "#64748b",
    fontSize: "12px",
  },

  // =====================================================
  // CRENEAU RESERVE
  // GRIS + NON CLIQUABLE
  // =====================================================

  reservedSlot: {
    padding: "17px",
    border: "1px solid #9ca3af",
    borderRadius: "14px",
    background: "#d1d5db",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    opacity: 0.85,
    cursor: "not-allowed",
  },

  reservedClock: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#9ca3af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  reservedTime: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#374151",
  },

  reservedText: {
    marginTop: "5px",
    color: "#4b5563",
    fontSize: "12px",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    background: "#f8fafc",
    borderRadius: "14px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  security: {
    textAlign: "center",
    marginTop: "25px",
    color: "#64748b",
    fontSize: "13px",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f9ff",
    color: "#1f4fa3",
  },

  spinner: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #1f4fa3",
    marginBottom: "15px",
  },

  // =====================================================
  // MODAL
  // =====================================================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.60)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999,
  },

  modal: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    borderRadius: "24px",
    padding: "35px",
    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.30)",
    textAlign: "center",
  },

  modalIconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
  },

  modalIcon: {
    width: "95px",
    height: "95px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #e8f1ff, #dbeafe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    position: "relative",
    boxShadow:
      "0 10px 30px rgba(31,79,163,0.15)",
  },

  checkIcon: {
    position: "absolute",
    right: "-2px",
    bottom: "2px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "4px solid white",
  },

  modalTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    color: "#173b72",
  },

  modalSubtitle: {
    margin: "0 auto 25px",
    maxWidth: "380px",
    lineHeight: "1.6",
    color: "#64748b",
    fontSize: "15px",
  },

  detailsCard: {
    background:
      "linear-gradient(135deg, #f0f6ff, #e8f1ff)",
    border: "1px solid #d4e4ff",
    borderRadius: "16px",
    padding: "8px 20px",
    textAlign: "left",
    marginBottom: "25px",
  },

  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "16px 0",
    borderBottom: "1px solid #d8e5f7",
  },

  detailIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #1f4fa3, #3974d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  detailLabel: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "4px",
  },

  detailValue: {
    color: "#173b72",
    fontWeight: "700",
    fontSize: "16px",
  },

  modalButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "space-between",
  },

  cancelButton: {
    flex: 1,
    padding: "15px 18px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "white",
    color: "#475569",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  confirmButton: {
    flex: 1.7,
    padding: "15px 18px",
    borderRadius: "12px",
    border: "none",
    background:
      "linear-gradient(135deg, #1f4fa3, #3974d4)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(31,79,163,0.25)",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default Disponibilites;