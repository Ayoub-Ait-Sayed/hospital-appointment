import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/tousMedcine.css";

function TousMedcine() {

  const [medecins, setMedecins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  /*
  |--------------------------------------------------------------------------
  | Récupérer TOUS les médecins
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchMedecins = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/public-medecins`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Médecins reçus :", response.data);

        setMedecins(response.data.medecins || []);

      } catch (err) {

        console.error("Erreur médecins :", err);

        setError(
          err.response?.data?.message ||
          "Impossible de charger les médecins."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchMedecins();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Recherche
  |--------------------------------------------------------------------------
  */

  const filteredMedecins = medecins.filter((medecin) => {

    const name =
      medecin.user?.name || "";

    const email =
      medecin.user?.email || "";

    const telephone =
      medecin.telephone || "";

    const description =
      medecin.description || "";

    const specialite =
      medecin.specialite?.nom || "";

    const text = `
      ${name}
      ${email}
      ${telephone}
      ${description}
      ${specialite}
    `.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );

  });


  /*
  |--------------------------------------------------------------------------
  | Image
  |--------------------------------------------------------------------------
  */

  const getImage = (medecin) => {

    if (!medecin.image) {
      return "/images/default-doctor.png";
    }

    if (medecin.image.startsWith("http")) {
      return medecin.image;
    }

    return `${API_URL}/storage/${medecin.image}`;

  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="tm-loading">

        <div className="tm-spinner"></div>

        <p>
          Chargement des médecins...
        </p>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <div className="tm-error">

        <h3>
          {error}
        </h3>

        <button
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (

    <div className="tm-page">


      {/* =========================
          SEARCH
      ========================= */}

      <div className="tm-search-area">

        <div className="tm-search-box">

          <div className="tm-search-input">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="tm-search-option">

            <span>⌖</span>

            <span>
              Location
            </span>

          </div>


          <div className="tm-search-option">

            <span>▣</span>

            <span>
              Date
            </span>

          </div>


          <button
            className="tm-search-button"
            onClick={() => {}}
          >
            Search
          </button>

        </div>

      </div>



      {/* =========================
          CONTENT
      ========================= */}

      <div className="tm-content">


        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="tm-sidebar">

          <div className="tm-filter-header">

            <h3>
              Filter
            </h3>

            <button
              onClick={() =>
                setSearch("")
              }
            >
              Clear All
            </button>

          </div>


          <div className="tm-filter-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>



          {/* Specialités */}

          <div className="tm-filter-group">

            <div className="tm-filter-title">

              <span>
                Specialities
              </span>

              <span>
                ⌃
              </span>

            </div>


            {[
              ...new Map(
                medecins
                  .filter(
                    (m) => m.specialite
                  )
                  .map(
                    (m) => [
                      m.specialite.id,
                      m.specialite
                    ]
                  )
              ).values()
            ].map((specialite) => (

              <label
                key={specialite.id}
              >

                <input
                  type="checkbox"
                />

                {specialite.nom}

              </label>

            ))}

          </div>



          {/* Gender */}

          <div className="tm-filter-group">

            <div className="tm-filter-title">

              <span>
                Gender
              </span>

              <span>
                ⌃
              </span>

            </div>

            <label>

              <input
                type="checkbox"
              />

              Male

            </label>

            <label>

              <input
                type="checkbox"
              />

              Female

            </label>

          </div>



          {/* Availability */}

          <div className="tm-filter-group">

            <div className="tm-filter-title">

              <span>
                Availability
              </span>

              <span>
                ⌃
              </span>

            </div>

            <label>

              <input
                type="checkbox"
              />

              Available Today

            </label>

            <label>

              <input
                type="checkbox"
              />

              Available Tomorrow

            </label>

            <label>

              <input
                type="checkbox"
              />

              Available Next 7 Days

            </label>

            <label>

              <input
                type="checkbox"
              />

              Available Next 30 Days

            </label>

          </div>



          {/* Pricing */}

          <div className="tm-filter-group">

            <div className="tm-filter-title">

              <span>
                Pricing
              </span>

              <span>
                ⌃
              </span>

            </div>

            <div className="tm-price-chart">

              {[20, 35, 60, 80, 55, 35, 70, 95, 65, 45]
                .map((height, index) => (

                  <span
                    key={index}
                    style={{
                      height: `${height}%`,
                    }}
                  />

                ))}

            </div>

            <div className="tm-price-range">

              <span>
                Range
              </span>

              <strong>
                —
              </strong>

            </div>

          </div>



          {/* Experience */}

          <div className="tm-filter-group">

            <div className="tm-filter-title">

              <span>
                Experience
              </span>

              <span>
                ⌃
              </span>

            </div>

            <label>

              <input
                type="checkbox"
              />

              0 - 5 Years

            </label>

            <label>

              <input
                type="checkbox"
              />

              6 - 10 Years

            </label>

            <label>

              <input
                type="checkbox"
              />

              11 - 15 Years

            </label>

            <label>

              <input
                type="checkbox"
              />

              16+ Years

            </label>

          </div>

        </aside>



        {/* =========================
            DOCTORS
        ========================= */}

        <section className="tm-doctors">


          <div className="tm-doctors-header">

            <h2>

              Showing{" "}

              <strong>
                {filteredMedecins.length}
              </strong>{" "}

              Doctors For You

            </h2>


            <div className="tm-header-actions">

              <label className="tm-availability">

                Availability

                <input
                  type="checkbox"
                />

              </label>


              <select>

                <option>
                  Price: Low to High
                </option>

                <option>
                  Price: High to Low
                </option>

                <option>
                  Experience
                </option>

              </select>


              <button className="tm-grid active">
                ▦
              </button>

              <button className="tm-grid">
                ☷
              </button>

            </div>

          </div>



          {/* =========================
              EMPTY
          ========================= */}

          {filteredMedecins.length === 0 ? (

            <div className="tm-empty">

              <h3>
                Aucun médecin trouvé
              </h3>

              <button
                onClick={() =>
                  setSearch("")
                }
              >
                Clear Search
              </button>

            </div>

          ) : (


            /* =========================
               LISTE DES MEDECINS
            ========================= */

            filteredMedecins.map(
              (medecin) => {

                const name =
                  medecin.user?.name ||
                  "Doctor";

                const email =
                  medecin.user?.email ||
                  "";

                const speciality =
                  medecin.specialite?.nom ||
                  "Spécialiste";


                return (

                  <div
                    className="tm-doctor-card"
                    key={medecin.id}
                  >


                    {/* IMAGE */}

                    <div className="tm-doctor-image">

                      <button
                        className="tm-favorite"
                      >
                        ♡
                      </button>


                      <img
                        src={getImage(medecin)}
                        alt={name}
                        onError={(e) => {

                          e.currentTarget.src =
                            "/images/default-doctor.png";

                        }}
                      />

                    </div>



                    {/* INFO */}

                    <div className="tm-doctor-info">


                      <div className="tm-doctor-top">


                        <div className="tm-main-info">

                          <h3>

                            {name}

                            <span className="tm-verified">
                              ✓
                            </span>

                          </h3>


                          <p className="tm-speciality">

                            <span></span>

                            {speciality}

                          </p>


                          <p className="tm-description">

                            {medecin.description ||
                              "Medical specialist"}

                          </p>

                        </div>



                        <div className="tm-doctor-details">

                          <p>

                            ☎{" "}

                            {medecin.telephone ||
                              "Not provided"}

                          </p>


                          <p>

                            ✉{" "}

                            {email}

                          </p>


                          <p
                            className={
                              medecin.status === "active"
                                ? "tm-status-active"
                                : "tm-status-inactive"
                            }
                          >

                            ●{" "}

                            {medecin.status === "active"
                              ? "Available"
                              : "Unavailable"}

                          </p>

                        </div>

                      </div>



                      {/* FOOTER */}

                      <div className="tm-doctor-bottom">


                        <div className="tm-consultation">

                          <div>

                            <span>
                              Consultation Fee
                            </span>

                            <strong>
                              —
                            </strong>

                          </div>


                          <div>

                            <span>
                              Status
                            </span>

                            <strong>
                              {medecin.status ||
                                "—"}
                            </strong>

                          </div>

                        </div>



                        <Link
                          to={`/patient/medecin/${medecin.id}`}
                          className="tm-book"
                        >
                          Voir le profil
                        </Link>

                      </div>


                    </div>

                  </div>

                );

              }

            )

          )}

        </section>

      </div>

    </div>

  );

}

export default TousMedcine;
