import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Responsable-Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("Tous les genres");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  /* =====================================================
     FETCH PATIENTS
  ===================================================== */

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/responsable/patients",
        { headers }
      );

      setPatients(response.data?.patients || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /* =====================================================
     DETAILS
  ===================================================== */

  const voirDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/responsable/patients/${id}`,
        { headers }
      );

      setSelectedPatient(response.data?.patient);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de charger les détails."
      );
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const supprimer = async (id) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer ce patient ?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/responsable/patients/${id}`,
        { headers }
      );

      setSelectedPatient(null);

      await fetchPatients();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    }
  };

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (value) => {
    if (!value) return "";

    return value
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  /* =====================================================
     GET NAME
  ===================================================== */

  const getName = (patient) => {
    return (
      patient?.user?.name ||
      patient?.name ||
      "Nom non disponible"
    );
  };

  /* =====================================================
     GET EMAIL
  ===================================================== */

  const getEmail = (patient) => {
    return (
      patient?.user?.email ||
      patient?.email ||
      "Non renseigné"
    );
  };

  /* =====================================================
     GET PHONE
  ===================================================== */

  const getPhone = (patient) => {
    return (
      patient?.telephone ||
      patient?.phone ||
      patient?.user?.telephone ||
      patient?.user?.phone ||
      "Non renseigné"
    );
  };

  /* =====================================================
     GET GENRE
  ===================================================== */

  const getGenre = (patient) => {
    return (
      patient?.genre ||
      patient?.gender ||
      patient?.sexe ||
      patient?.user?.genre ||
      patient?.user?.gender ||
      "Non renseigné"
    );
  };

  /* =====================================================
     GET STATUS
  ===================================================== */

  const getStatus = (patient) => {
    return (
      patient?.statut ||
      patient?.status ||
      "Actif"
    );
  };

  /* =====================================================
     GET BIRTH DATE
  ===================================================== */

  const getBirthDate = (patient) => {
    const date =
      patient?.date_naissance ||
      patient?.dateNaissance ||
      patient?.birth_date ||
      patient?.dateNaissance;

    if (!date) {
      return "Non renseignée";
    }

    const value = date.toString().substring(0, 10);

    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredPatients = useMemo(() => {
    const searchValue = normalizeText(search);

    return patients.filter((patient) => {
      const name = normalizeText(getName(patient));
      const email = normalizeText(getEmail(patient));
      const phone = normalizeText(getPhone(patient));
      const genre = normalizeText(getGenre(patient));
      const status = normalizeText(getStatus(patient));

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesGenre =
        genreFilter === "Tous les genres" ||
        normalizeText(genreFilter) === genre;

      const matchesStatus =
        statusFilter === "Tous les statuts" ||
        normalizeText(statusFilter) === status;

      return (
        matchesSearch &&
        matchesGenre &&
        matchesStatus
      );
    });
  }, [
    patients,
    search,
    genreFilter,
    statusFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredPatients.length / itemsPerPage
  );

  const paginatedPatients =
    filteredPatients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    genreFilter,
    statusFilter,
  ]);

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    const total = patients.length;

    const actifs = patients.filter(
      (patient) =>
        normalizeText(getStatus(patient)) ===
          "actif" ||
        normalizeText(getStatus(patient)) ===
          "active"
    ).length;

    const inactifs = patients.filter(
      (patient) => {
        const status =
          normalizeText(getStatus(patient));

        return (
          status === "inactif" ||
          status === "inactive"
        );
      }
    ).length;

    const avecRdv = patients.filter(
      (patient) =>
        patient?.rendez_vous?.length > 0 ||
        patient?.rendezVous?.length > 0 ||
        patient?.rdv_count > 0 ||
        patient?.rendez_vous_count > 0
    ).length;

    return {
      total,
      actifs,
      inactifs,
      avecRdv,
    };
  }, [patients]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="patients-loading">
        <div className="patients-loader"></div>

        <p>
          Chargement des patients...
        </p>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="patients-page">

      <main className="patients-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="patients-header">

          <div className="patients-title">

            <div className="patients-title-icon">
              👥
            </div>

            <div>
              <h1>
                Gestion des patients
              </h1>

              <p>
                Consultez, gérez et suivez tous
                les patients de votre établissement.
              </p>
            </div>

          </div>

          <Link
            to="/responsable/patients/create"
            className="add-patient-btn"
          >
            <span>＋</span>
            Ajouter un patient
          </Link>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="patients-error">
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="patients-stats">

          <div className="patient-stat-card blue">

            <div className="patient-stat-icon">
              👥
            </div>

            <div>
              <span>
                Total des patients
              </span>

              <strong>
                {stats.total}
              </strong>

              <small className="stat-positive">
                ↑ Patients enregistrés
              </small>
            </div>

          </div>

          <div className="patient-stat-card green">

            <div className="patient-stat-icon">
              👤
            </div>

            <div>
              <span>
                Patients actifs
              </span>

              <strong>
                {stats.actifs}
              </strong>

              <small className="stat-positive">
                ↑ Patients actifs
              </small>
            </div>

          </div>

          <div className="patient-stat-card purple">

            <div className="patient-stat-icon">
              📅
            </div>

            <div>
              <span>
                Patients avec RDV
              </span>

              <strong>
                {stats.avecRdv}
              </strong>

              <small className="stat-positive">
                ↑ Rendez-vous associés
              </small>
            </div>

          </div>

          <div className="patient-stat-card orange">

            <div className="patient-stat-icon">
              ⚠
            </div>

            <div>
              <span>
                Patients inactifs
              </span>

              <strong>
                {stats.inactifs}
              </strong>

              <small className="stat-negative">
                ↓ Patients inactifs
              </small>
            </div>

          </div>

        </div>

        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="patients-table-card">

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="patients-filters">

            <div className="patients-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Rechercher un patient (nom, téléphone, email...)"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={genreFilter}
              onChange={(e) =>
                setGenreFilter(e.target.value)
              }
            >
              <option>
                Tous les genres
              </option>

              <option value="Femme">
                Femme
              </option>

              <option value="Homme">
                Homme
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option>
                Tous les statuts
              </option>

              <option value="Actif">
                Actif
              </option>

              <option value="Inactif">
                Inactif
              </option>
            </select>

            <div className="patients-date-filter">
              📅
              <span>
                Toutes les dates
              </span>
            </div>

            <button
              className="filter-btn"
              type="button"
            >
              ⚙ Filtres
            </button>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="patients-table-wrapper">

            <table className="patients-table">

              <thead>
                <tr>

                  <th>ID</th>

                  <th>Patient</th>

                  <th>Téléphone</th>

                  <th>Email</th>

                  <th>Genre</th>

                  <th>Date de naissance</th>

                  <th>Statut</th>

                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {paginatedPatients.length === 0 ? (

                  <tr>
                    <td
                      colSpan="8"
                      className="patients-empty"
                    >
                      Aucun patient trouvé.
                    </td>
                  </tr>

                ) : (

                  paginatedPatients.map(
                    (patient) => {

                      const name =
                        getName(patient);

                      const genre =
                        getGenre(patient);

                      const status =
                        getStatus(patient);

                      return (
                        <tr
                          key={patient.id}
                        >

                          {/* ID */}

                          <td>
                            <strong className="patient-id">
                              {patient.id}
                            </strong>
                          </td>

                          {/* PATIENT */}

                          <td>

                            <div className="patient-person">

                              <div className="patient-avatar">
                                {name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {name}
                              </strong>

                            </div>

                          </td>

                          {/* PHONE */}

                          <td>
                            {getPhone(patient)}
                          </td>

                          {/* EMAIL */}

                          <td>
                            {getEmail(patient)}
                          </td>

                          {/* GENRE */}

                          <td>

                            <span
                              className={`gender-badge ${
                                normalizeText(
                                  genre
                                ) === "femme"
                                  ? "female"
                                  : "male"
                              }`}
                            >
                              {genre}
                            </span>

                          </td>

                          {/* DATE */}

                          <td>
                            <div className="birth-date">
                              {getBirthDate(
                                patient
                              )}
                            </div>
                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`patient-status ${
                                normalizeText(
                                  status
                                ) === "actif" ||
                                normalizeText(
                                  status
                                ) === "active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              {status}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="patient-actions">

                              <button
                                className="patient-action view"
                                onClick={() =>
                                  voirDetails(
                                    patient.id
                                  )
                                }
                              >
                                👁
                                <span>
                                  Voir
                                </span>
                              </button>

                              <Link
                                to={`/responsable/patients/${patient.id}/edit`}
                                className="patient-action edit"
                              >
                                ✎
                                <span>
                                  Modifier
                                </span>
                              </Link>

                              <button
                                className="patient-action delete"
                                onClick={() =>
                                  supprimer(
                                    patient.id
                                  )
                                }
                              >
                                🗑
                                <span>
                                  Supprimer
                                </span>
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="patients-footer">

            <span>

              Affichage de{" "}

              <strong>
                {filteredPatients.length === 0
                  ? 0
                  : (currentPage - 1) *
                      itemsPerPage +
                    1}
              </strong>

              {" "}à{" "}

              <strong>
                {Math.min(
                  currentPage *
                    itemsPerPage,
                  filteredPatients.length
                )}
              </strong>

              {" "}sur{" "}

              <strong>
                {filteredPatients.length}
              </strong>

              {" "}patients

            </span>

            <div className="patients-pagination">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
              >
                ‹
              </button>

              {Array.from(
                {
                  length:
                    Math.max(
                      totalPages,
                      1
                    ),
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>

              ))}

              <button
                disabled={
                  totalPages === 0 ||
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
              >
                ›
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* =================================================
          MODAL DETAILS
      ================================================= */}

      {selectedPatient && (

        <div
          className="patient-modal-overlay"
          onClick={() =>
            setSelectedPatient(null)
          }
        >

          <div
            className="patient-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="patient-modal-header">

              <div>

                <span>
                  PATIENT
                </span>

                <h2>
                  Détails du patient
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-modal-body">

              <div className="modal-patient-profile">

                <div className="modal-patient-avatar">
                  {getName(selectedPatient)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h3>
                    {getName(selectedPatient)}
                  </h3>

                  <span>
                    Patient #{selectedPatient.id}
                  </span>

                </div>

              </div>

              <div className="patient-detail-grid">

                <div>
                  <label>
                    Nom
                  </label>

                  <strong>
                    {getName(
                      selectedPatient
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Email
                  </label>

                  <strong>
                    {getEmail(
                      selectedPatient
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Téléphone
                  </label>

                  <strong>
                    {getPhone(
                      selectedPatient
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Genre
                  </label>

                  <strong>
                    {getGenre(
                      selectedPatient
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Date de naissance
                  </label>

                  <strong>
                    {getBirthDate(
                      selectedPatient
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Statut
                  </label>

                  <strong>
                    {getStatus(
                      selectedPatient
                    )}
                  </strong>
                </div>

              </div>

            </div>

            <div className="patient-modal-footer">

              <button
                className="modal-delete-btn"
                onClick={() =>
                  supprimer(
                    selectedPatient.id
                  )
                }
              >
                🗑 Supprimer
              </button>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                Fermer
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Patients;
