import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/DemandesMedecins.css";

function DemandesMedecins() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Confirmation personnalisée (remplace window.confirm)
  // { id, type: "accepter" | "refuser", nom } ou null si aucune modale ouverte
  const [confirmation, setConfirmation] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  /*
  |--------------------------------------------------------------------------
  | Charger les demandes
  |--------------------------------------------------------------------------
  */

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/demandes-medecins",
        { headers }
      );

      setMedecins(response.data.medecins || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les demandes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Accepter médecin
  |--------------------------------------------------------------------------
  */

  const accepter = async (id) => {
    try {
      setError("");
      setMessage("");

      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/medecins/${id}/accepter`,
        {},
        { headers }
      );

      setMessage(
        response.data.message || "Médecin accepté avec succès."
      );

      // Actualiser la liste
      fetchDemandes();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Erreur lors de l'acceptation du médecin."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Refuser médecin
  |--------------------------------------------------------------------------
  */

  const refuser = async (id) => {
    try {
      setError("");
      setMessage("");

      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/medecins/${id}/refuser`,
        {},
        { headers }
      );

      setMessage(
        response.data.message || "Médecin refusé avec succès."
      );

      // Actualiser la liste
      fetchDemandes();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Erreur lors du refus du médecin."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Confirmation (remplace window.confirm)
  |--------------------------------------------------------------------------
  */

  const demanderConfirmation = (type, medecin) => {
    setConfirmation({
      id: medecin.id,
      type,
      nom: medecin.user?.name || "ce médecin",
    });
  };

  const validerConfirmation = () => {
    if (!confirmation) return;

    if (confirmation.type === "accepter") {
      accepter(confirmation.id);
    } else {
      refuser(confirmation.id);
    }

    setConfirmation(null);
  };

  const annulerConfirmation = () => {
    setConfirmation(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="demandes-loading">
        <div className="spinner"></div>
        <p>Chargement des demandes...</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="demandes-page">

      <header className="demandes-header">
        <div>
          <h1>Demandes des médecins</h1>
          <p>
            {medecins.length > 0
              ? `${medecins.length} demande${medecins.length > 1 ? "s" : ""} en attente de validation`
              : "Aucune demande en attente"}
          </p>
        </div>

        <Link to="/admin/dashboard" className="back-button">
          ← Retour Dashboard
        </Link>
      </header>

      {message && (
        <div className="alert alert-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {medecins.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🩺</div>
          <h3>Aucune demande en attente</h3>
          <p>Il n'y a actuellement aucun médecin à valider.</p>
        </div>
      ) : (
        <div className="demandes-grid">
          {medecins.map((medecin) => (
            <div key={medecin.id} className="demande-card">

              <div className="demande-card-top">
                <div className="demande-avatar">
                  {(medecin.user?.name || "?").charAt(0).toUpperCase()}
                </div>

                <div className="demande-identity">
                  <h2>Dr. {medecin.user?.name || "Nom inconnu"}</h2>
                  <span className="specialite-badge">
                    {medecin.specialite?.nom || "Spécialité non précisée"}
                  </span>
                </div>

                <span className="status-badge">
                  {medecin.status || "en attente"}
                </span>
              </div>

              <dl className="demande-details">
                <div className="detail-row">
                  <dt>Email</dt>
                  <dd>{medecin.user?.email || "—"}</dd>
                </div>

                <div className="detail-row">
                  <dt>Téléphone</dt>
                  <dd>{medecin.telephone || "—"}</dd>
                </div>

                <div className="detail-row description">
                  <dt>Description</dt>
                  <dd>{medecin.description || "—"}</dd>
                </div>
              </dl>

              <div className="demande-actions">
                <button
                  onClick={() => demanderConfirmation("accepter", medecin)}
                  className="btn-accept"
                >
                  ✓ Accepter
                </button>

                <button
                  onClick={() => demanderConfirmation("refuser", medecin)}
                  className="btn-refuse"
                >
                  ✕ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmation &&
        createPortal(
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <h3>
                {confirmation.type === "accepter"
                  ? "Accepter ce médecin ?"
                  : "Refuser ce médecin ?"}
              </h3>

              <p>
                {confirmation.type === "accepter"
                  ? `Dr. ${confirmation.nom} sera validé et pourra accéder à la plateforme.`
                  : `La demande de Dr. ${confirmation.nom} sera rejetée.`}
              </p>

              <div className="confirm-actions">
                <button
                  onClick={annulerConfirmation}
                  className="btn-cancel"
                >
                  Annuler
                </button>

                <button
                  onClick={validerConfirmation}
                  className={
                    confirmation.type === "accepter"
                      ? "btn-accept"
                      : "btn-refuse"
                  }
                >
                  {confirmation.type === "accepter" ? "✓ Confirmer" : "✕ Confirmer"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default DemandesMedecins;