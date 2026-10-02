import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import "../../style/Specialites.css";

function Tousspecialites() {

  const { specialiteId } = useParams();

  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const API_URL = "http://127.0.0.1:8000";


  /*
  |--------------------------------------------------------------------------
  | Récupérer TOUTES les spécialités
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchSpecialites = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/specialites`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log(
          "Spécialités reçues :",
          response.data
        );

        setSpecialites(
          response.data.specialites || []
        );

      } catch (err) {

        console.error(
          "Erreur spécialités :",
          err
        );

        setError(
          err.response?.data?.message ||
          "Impossible de récupérer les spécialités."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchSpecialites();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Récupérer les médecins d'une spécialité
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!specialiteId) {
      return;
    }

    const fetchMedecins = async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/specialites/${specialiteId}/medecins`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setMedecins(
          response.data.medecins || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Impossible de récupérer les médecins."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchMedecins();

  }, [specialiteId]);


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="page">

        <div className="loading-container">

          <div className="spinner"></div>

          <h2>
            Chargement...
          </h2>

          <p>
            Veuillez patienter
          </p>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Vue MÉDECINS
  |--------------------------------------------------------------------------
  */

  if (specialiteId) {

    const specialite =
      specialites.find(
        (item) =>
          String(item.id) ===
          String(specialiteId)
      );


    const filteredMedecins =
      medecins.filter((medecin) => {

        const name =
          medecin.user?.name || "";

        return name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      });


    return (

      <div className="page">

        <div className="container">


          {/* HEADER */}

          <div className="top-bar">

            <Link
              to="/patient/specialites"
              className="back-link"
            >
              ← Retour aux spécialités
            </Link>

          </div>


          <div className="hero">

            <div className="hero-icon">
              👨‍⚕️
            </div>

            <div>

              <span className="small-title">
                SPÉCIALITÉ
              </span>

              <h1>
                {specialite?.nom ||
                  "Médecins disponibles"}
              </h1>

              <p>
                Choisissez un médecin et
                consultez ses disponibilités.
              </p>

            </div>

          </div>


          {error && (

            <div className="error-box">
              {error}
            </div>

          )}


          {/* SEARCH */}

          {medecins.length > 0 && (

            <div className="search-box">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Rechercher un médecin..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          )}


          {/* MEDECINS */}

          {filteredMedecins.length === 0 ? (

            <div className="empty-card">

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
                  : "Aucun médecin n'est actuellement disponible pour cette spécialité."}

              </p>

            </div>

          ) : (

            <div className="cards-grid">

              {filteredMedecins.map(
                (medecin) => (

                  <div
                    className="doctor-card"
                    key={medecin.id}
                  >


                    <div className="doctor-top">

                      <div className="doctor-avatar">
                        👨‍⚕️
                      </div>

                      <div className="available">

                        <span></span>

                        Disponible

                      </div>

                    </div>


                    <h2>

                      Dr.{" "}
                      {medecin.user?.name ||
                        "Médecin"}

                    </h2>


                    <div className="speciality-tag">

                      🩺{" "}
                      {medecin.specialite?.nom ||
                        specialite?.nom}

                    </div>


                    {medecin.telephone && (

                      <div className="doctor-info">

                        <span>
                          📞
                        </span>

                        <span>
                          {medecin.telephone}
                        </span>

                      </div>

                    )}


                    <p className="description">

                      {medecin.description ||
                        "Aucune description disponible pour ce médecin."}

                    </p>


                    <Link
                      to={`/patient/medecins/${medecin.id}/disponibilites`}
                      className="doctor-button"
                    >

                      Voir les disponibilités

                      <span>
                        →
                      </span>

                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Vue SPÉCIALITÉS
  |--------------------------------------------------------------------------
  */

  const filteredSpecialites =
    specialites.filter((specialite) => {

      const nom =
        specialite.nom || "";

      const description =
        specialite.description || "";

      const text = `
        ${nom}
        ${description}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );

    });


  return (

    <div className="page">

      <div className="container">


        {/* HEADER */}

        <div className="top-bar">

          <Link
            to="/patient/dashboard"
            className="back-link"
          >
            ← Retour au dashboard
          </Link>

        </div>


        <div className="hero">

          <div className="hero-icon">
            🏥
          </div>

          <div>

            <span className="small-title">
              ESPACE PATIENT
            </span>

            <h1>
              Choisir une spécialité
            </h1>

            <p>
              Trouvez la spécialité médicale
              dont vous avez besoin.
            </p>

          </div>

        </div>


        {error && (

          <div className="error-box">
            {error}
          </div>

        )}


        {/* SEARCH */}

        {specialites.length > 0 && (

          <div className="search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Rechercher une spécialité..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        )}


        {/* SPECIALITES */}

        {filteredSpecialites.length === 0 ? (

          <div className="empty-card">

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
                : "Aucune spécialité médicale n'est actuellement disponible."}

            </p>

          </div>

        ) : (

          <div className="cards-grid">

            {filteredSpecialites.map(
              (specialite) => (

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
                    className="main-button"
                  >

                    Voir les médecins

                    <span>
                      →
                    </span>

                  </Link>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}

export default Tousspecialites;
