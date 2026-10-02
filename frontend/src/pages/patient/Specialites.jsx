import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../style/Specialites.css";

function Specialites() {
  const { specialiteId } = useParams();

  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // ==============================
  // Récupérer les spécialités
  // ==============================
  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/specialites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setSpecialites(response.data.specialites || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les spécialités.");
      }
    };

    fetchSpecialites();
  }, [token]);

  // ==============================
  // Récupérer les médecins
  // ==============================
  useEffect(() => {
    if (!specialiteId) {
      setLoading(false);
      return;
    }

    const fetchMedecins = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/specialites/${specialiteId}/medecins`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setMedecins(response.data.medecins || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les médecins.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, [specialiteId, token]);

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="medical-page">
        <div className="loading">
          <div className="spinner"></div>
          <h2>Chargement...</h2>
          <p>Veuillez patienter</p>
        </div>
      </div>
    );
  }

  // ==============================
  // PAGE MÉDECINS
  // ==============================
  if (specialiteId) {
    const specialite = specialites.find(
      (item) => String(item.id) === String(specialiteId)
    );

    const filteredMedecins = medecins.filter((medecin) => {
      const name = medecin.user?.name || "";

      return name
        .toLowerCase()
        .includes(search.toLowerCase());
    });

    return (
      <div className="medical-page">
        <div className="medical-container">

          {/* Retour */}
          <Link
            to="/patient/specialites"
            className="back-link"
          >
            ← Retour aux spécialités
          </Link>

          {/* Header */}
          <div className="medical-header">
            <div className="header-icon">
              👨‍⚕️
            </div>

            <div>
              <span className="header-label">
                SPÉCIALITÉ MÉDICALE
              </span>

              <h1>
                {specialite?.nom || "Médecins"}
              </h1>

              <p>
                Choisissez un médecin pour consulter ses disponibilités.
              </p>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Recherche */}
          {medecins.length > 0 && (
            <div className="search-container">
              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Rechercher un médecin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Aucun médecin */}
          {filteredMedecins.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon">
                🩺
              </div>

              <h2>
                {search
                  ? "Aucun médecin trouvé"
                  : "Aucun médecin disponible"}
              </h2>

              <p>
                {search
                  ? "Essayez avec un autre nom."
                  : "Aucun médecin n'est disponible pour cette spécialité."}
              </p>
            </div>
          ) : (
            <div className="cards-grid">

              {filteredMedecins.map((medecin) => (
                <div
                  className="doctor-card"
                  key={medecin.id}
                >

                  {/* Doctor top */}
                  <div className="doctor-header">

                    <div className="doctor-avatar">
                      👨‍⚕️
                    </div>

                    <div className="available">
                      <span></span>
                      Disponible
                    </div>

                  </div>

                  <h2>
                    Dr. {medecin.user?.name || "Médecin"}
                  </h2>

                  <div className="speciality-badge">
                    🩺{" "}
                    {medecin.specialite?.nom ||
                      specialite?.nom}
                  </div>

                  {medecin.telephone && (
                    <div className="doctor-phone">
                      📞 {medecin.telephone}
                    </div>
                  )}

                  <p className="doctor-description">
                    {medecin.description ||
                      "Aucune description disponible pour ce médecin."}
                  </p>

                  <Link
                    to={`/patient/medecins/${medecin.id}/disponibilites`}
                    className="doctor-button"
                  >
                    <span>
                      Voir les disponibilités
                    </span>

                    <span className="arrow">
                      →
                    </span>
                  </Link>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    );
  }

  // ==============================
  // PAGE SPÉCIALITÉS
  // ==============================

  const filteredSpecialites = specialites.filter(
    (specialite) =>
      specialite.nom
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="medical-page">
      <div className="medical-container">

        {/* Retour */}
        <Link
          to="/patient/dashboard"
          className="back-link"
        >
          ← Retour au dashboard
        </Link>

        {/* Header */}
        <div className="medical-header">

          <div className="header-icon">
            🏥
          </div>

          <div>
            <span className="header-label">
              ESPACE PATIENT
            </span>

            <h1>
              Choisir une spécialité
            </h1>

            <p>
              Trouvez la spécialité médicale dont vous avez besoin.
            </p>
          </div>

        </div>

        {/* Erreur */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Recherche */}
        {specialites.length > 0 && (
          <div className="search-container">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Rechercher une spécialité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>
        )}

        {/* Spécialités */}
        {filteredSpecialites.length === 0 ? (
          <div className="empty-container">

            <div className="empty-icon">
              🏥
            </div>

            <h2>
              {search
                ? "Aucune spécialité trouvée"
                : "Aucune spécialité disponible"}
            </h2>

            <p>
              {search
                ? "Essayez avec un autre mot."
                : "Aucune spécialité médicale n'est disponible."}
            </p>

          </div>
        ) : (
          <div className="cards-grid">

            {filteredSpecialites.map((specialite) => (
              <div
                className="speciality-card"
                key={specialite.id}
              >

                <div className="speciality-icon">
                  🩺
                </div>

                <h2>
                  {specialite.nom}
                </h2>

                <p>
                  {specialite.description ||
                    "Découvrez les médecins disponibles dans cette spécialité."}
                </p>

                <Link
                  to={`/patient/specialites/${specialite.id}/medecins`}
                  className="speciality-button"
                >
                  <span>
                    Voir les médecins
                  </span>

                  <span className="arrow">
                    →
                  </span>
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Specialites;