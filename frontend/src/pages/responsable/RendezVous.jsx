import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Responsable-RendezVous.css";

function RendezVous() {
  // =====================================================
  // STATES
  // =====================================================

  const [rendezVous, setRendezVous] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRdv, setSelectedRdv] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("Tous les statuts");

  const [specialiteFilter, setSpecialiteFilter] =
    useState("Toutes les spécialités");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // =====================================================
  // AUTH
  // =====================================================

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =====================================================
  // NORMALISER TEXTE
  // =====================================================

  const normalizeText = (value) => {
    if (!value) {
      return "";
    }

    return value
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]+/g, "_");
  };

  // =====================================================
  // NORMALISER STATUT
  // =====================================================

  const normalizeStatus = (status) => {
    return normalizeText(status);
  };

  // =====================================================
  // GET PATIENT NAME
  // =====================================================

  const getPatientName = (rdv) => {
    return (
      rdv?.patient?.user?.name ||
      rdv?.patient?.name ||
      rdv?.user?.name ||
      "Non renseigné"
    );
  };

  // =====================================================
  // GET PATIENT EMAIL
  // =====================================================

  const getPatientEmail = (rdv) => {
    return (
      rdv?.patient?.user?.email ||
      rdv?.patient?.email ||
      "Non renseigné"
    );
  };

  // =====================================================
  // GET PATIENT PHONE
  // =====================================================

  const getPatientPhone = (rdv) => {
    return (
      rdv?.patient?.user?.telephone ||
      rdv?.patient?.user?.phone ||
      rdv?.patient?.telephone ||
      rdv?.patient?.phone ||
      "Non renseigné"
    );
  };

  // =====================================================
  // GET MEDECIN NAME
  // =====================================================

  const getMedecinName = (rdv) => {
    return (
      rdv?.medecin?.user?.name ||
      rdv?.medecin?.name ||
      "Non renseigné"
    );
  };

  // =====================================================
  // GET SPECIALITE
  // =====================================================

  const getSpecialite = (rdv) => {
    return (
      rdv?.medecin?.specialite?.nom ||
      rdv?.medecin?.specialite?.name ||
      rdv?.specialite?.nom ||
      rdv?.specialite?.name ||
      "Non renseignée"
    );
  };

  // =====================================================
  // GET DATE
  // =====================================================

  const getDateValue = (rdv) => {
    if (!rdv?.date) {
      return "";
    }

    return rdv.date.toString().substring(0, 10);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date non renseignée";
    }

    const dateString = date.toString().substring(0, 10);

    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  };

  // =====================================================
  // FORMAT DATE LONGUE
  // =====================================================

  const formatDateLong = (date) => {
    if (!date) {
      return "";
    }

    const dateString = date.toString().substring(0, 10);

    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const [year, month, day] = parts;

    const localDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return localDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // GET TIME
  // =====================================================

  const getTime = (rdv) => {
    if (!rdv?.heure) {
      return "--:--";
    }

    return rdv.heure.toString().substring(0, 5);
  };

  // =====================================================
  // GET TODAY
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
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        rendezVousResponse,
        patientsResponse,
        medecinsResponse,
      ] = await Promise.all([
        axios.get(
          "http://127.0.0.1:8000/api/responsable/rendez-vous",
          { headers }
        ),

        axios.get(
          "http://127.0.0.1:8000/api/responsable/patients",
          { headers }
        ),

        axios.get(
          "http://127.0.0.1:8000/api/responsable/medecins",
          { headers }
        ),
      ]);

      // =================================================
      // RENDEZ-VOUS
      // =================================================

      const rendezVousData =
        rendezVousResponse.data?.rendez_vous ||
        rendezVousResponse.data?.rendezVous ||
        rendezVousResponse.data?.rendezvous ||
        [];

      // =================================================
      // PATIENTS
      // =================================================

      const patientsData =
        patientsResponse.data?.patients ||
        [];

      // =================================================
      // MEDECINS
      // =================================================

      const medecinsData =
        medecinsResponse.data?.medecins ||
        [];

      setRendezVous(
        Array.isArray(rendezVousData)
          ? rendezVousData
          : []
      );

      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : []
      );

      setMedecins(
        Array.isArray(medecinsData)
          ? medecinsData
          : []
      );
    } catch (err) {
      console.error(
        "Erreur récupération données :",
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
    fetchData();
  }, []);

  // =====================================================
  // DETAILS
  // =====================================================

  const voirDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/responsable/rendez-vous/${id}`,
        { headers }
      );

      setSelectedRdv(
        response.data?.rendez_vous
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de charger les détails."
      );
    }
  };

  // =====================================================
  // MODIFIER STATUT
  // =====================================================

  const modifierStatut = async (id, statut) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/responsable/rendez-vous/${id}`,
        {
          statut,
        },
        {
          headers,
        }
      );

      setSelectedRdv(null);

      await fetchData();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la modification du statut."
      );
    }
  };

  // =====================================================
  // SUPPRIMER
  // =====================================================

  const supprimer = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce rendez-vous ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/responsable/rendez-vous/${id}`,
        {
          headers,
        }
      );

      setSelectedRdv(null);

      await fetchData();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    }
  };

  // =====================================================
  // SPECIALITES
  // =====================================================

  const specialites = useMemo(() => {
    const values = rendezVous
      .map((rdv) => getSpecialite(rdv))
      .filter(
        (specialite) =>
          specialite &&
          specialite !== "Non renseignée"
      );

    return [...new Set(values)].sort();
  }, [rendezVous]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRendezVous = useMemo(() => {
    const searchValue = normalizeText(search);

    return rendezVous.filter((rdv) => {
      const patient = normalizeText(
        getPatientName(rdv)
      );

      const medecin = normalizeText(
        getMedecinName(rdv)
      );

      const specialite = normalizeText(
        getSpecialite(rdv)
      );

      const statut = normalizeStatus(
        rdv?.statut
      );

      const id = String(
        rdv?.id || ""
      );

      // -------------------------------
      // SEARCH
      // -------------------------------

      const matchesSearch =
        !searchValue ||
        patient.includes(searchValue) ||
        medecin.includes(searchValue) ||
        specialite.includes(searchValue) ||
        id.includes(searchValue);

      // -------------------------------
      // STATUS
      // -------------------------------

      const selectedStatus =
        normalizeStatus(statusFilter);

      const matchesStatus =
        statusFilter === "Tous les statuts" ||
        statut === selectedStatus;

      // -------------------------------
      // SPECIALITE
      // -------------------------------

      const matchesSpecialite =
        specialiteFilter ===
          "Toutes les spécialités" ||
        getSpecialite(rdv) ===
          specialiteFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSpecialite
      );
    });
  }, [
    rendezVous,
    search,
    statusFilter,
    specialiteFilter,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredRendezVous.length /
      itemsPerPage
  );

  const paginatedRendezVous =
    filteredRendezVous.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  // =====================================================
  // RESET PAGE FILTER
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    specialiteFilter,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    const today = getToday();

    // -----------------------------------------------
    // RDV AUJOURD'HUI
    // -----------------------------------------------

    const todayCount = rendezVous.filter(
      (rdv) => getDateValue(rdv) === today
    ).length;

    // -----------------------------------------------
    // PATIENTS
    // -----------------------------------------------
    // On prend directement le nombre retourné
    // par /responsable/patients
    // -----------------------------------------------

    const patientsCount =
      patients.length;

    // -----------------------------------------------
    // MEDECINS
    // -----------------------------------------------
    // On prend directement le nombre retourné
    // par /responsable/medecins
    // -----------------------------------------------

    const medecinsCount =
      medecins.length;

    // -----------------------------------------------
    // EN ATTENTE
    // -----------------------------------------------

    const pendingCount =
      rendezVous.filter((rdv) => {
        const status = normalizeStatus(
          rdv?.statut
        );

        return (
          status === "en_attente" ||
          status === "attente" ||
          status === "pending"
        );
      }).length;

    // -----------------------------------------------
    // ANNULES
    // -----------------------------------------------

    const cancelledCount =
      rendezVous.filter((rdv) => {
        const status = normalizeStatus(
          rdv?.statut
        );

        return (
          status === "annule" ||
          status === "annulee" ||
          status === "cancelled" ||
          status === "canceled"
        );
      }).length;

    return {
      todayCount,
      patientsCount,
      medecinsCount,
      pendingCount,
      cancelledCount,
    };
  }, [
    rendezVous,
    patients,
    medecins,
  ]);

  // =====================================================
  // DATE RANGE FROM DATA
  // =====================================================

  const dateRange = useMemo(() => {
    const dates = rendezVous
      .map((rdv) => getDateValue(rdv))
      .filter(Boolean)
      .sort();

    if (dates.length === 0) {
      return "Aucune date";
    }

    const firstDate = dates[0];
    const lastDate =
      dates[dates.length - 1];

    return `${formatDate(
      firstDate
    )} - ${formatDate(lastDate)}`;
  }, [rendezVous]);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value =
      normalizeStatus(status);

    if (
      value === "confirme" ||
      value === "confirmee" ||
      value === "confirmed"
    ) {
      return "status-confirmed";
    }

    if (
      value === "annule" ||
      value === "annulee" ||
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "status-cancelled";
    }

    if (
      value === "termine" ||
      value === "terminee" ||
      value === "completed"
    ) {
      return "status-completed";
    }

    return "status-pending";
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    const value =
      normalizeStatus(status);

    if (
      value === "confirme" ||
      value === "confirmee" ||
      value === "confirmed"
    ) {
      return "Confirmé";
    }

    if (
      value === "annule" ||
      value === "annulee" ||
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "Annulé";
    }

    if (
      value === "termine" ||
      value === "terminee" ||
      value === "completed"
    ) {
      return "Terminé";
    }

    return "En attente";
  };

  // =====================================================
  // CURRENT DATE
  // =====================================================

  const currentDate =
    new Date().toLocaleDateString(
      "fr-FR"
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rdv-loading">
        <div className="loader"></div>

        <p>
          Chargement des rendez-vous...
        </p>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="rdv-page">

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="rdv-container">

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="page-title">

          <div className="title-left">

            <div className="calendar-title-icon">
              📅
            </div>

            <div>

              <h1>
                Gestion des rendez-vous
              </h1>

              <p>
                Consultez, gérez et suivez tous
                les rendez-vous de votre établissement.
              </p>

            </div>

          </div>

          <div className="date-box">

            📅

            <div>

              <small>
                Aujourd'hui
              </small>

              <strong>
                {currentDate}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="stattts-grid">

          {/* RDV AUJOURD'HUI */}

          <div className="stat-card blue">

            <div className="stat-icon">
              📅
            </div>

            <div className="stat-content">

              <span>
                Rendez-vous aujourd'hui
              </span>

              <strong>
                {stats.todayCount}
              </strong>

              <small className="positive">
                Rendez-vous du jour
              </small>

            </div>

          </div>

          {/* PATIENTS */}

          <div className="stat-card green">

            <div className="stat-icon">
              👥
            </div>

            <div className="stat-content">

              <span>
                Patients enregistrés
              </span>

              <strong>
                {stats.patientsCount}
              </strong>

              <small className="positive">
                Total des patients
              </small>

            </div>

          </div>

          {/* MEDECINS */}

          <div className="stat-card purple">

            <div className="stat-icon">
              👨‍⚕️
            </div>

            <div className="stat-content">

              <span>
                Médecins actifs
              </span>

              <strong>
                {stats.medecinsCount}
              </strong>

              <small className="positive">
                Médecins enregistrés
              </small>

            </div>

          </div>

          {/* ATTENTE */}

          <div className="stat-card orange">

            <div className="stat-icon">
              ◷
            </div>

            <div className="stat-content">

              <span>
                En attente
              </span>

              <strong>
                {stats.pendingCount}
              </strong>

              <small className="negative">
                Rendez-vous à traiter
              </small>

            </div>

          </div>

          {/* ANNULES */}

          <div className="stat-card red">

            <div className="stat-icon">
              ×
            </div>

            <div className="stat-content">

              <span>
                Annulés
              </span>

              <strong>
                {stats.cancelledCount}
              </strong>

              <small className="negative">
                Rendez-vous annulés
              </small>

            </div>

          </div>

        </div>

        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="table-card">

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="filters">

            {/* SEARCH */}

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Rechercher un patient, médecin ou spécialité..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option>
                Tous les statuts
              </option>

              <option value="confirme">
                Confirmé
              </option>

              <option value="en_attente">
                En attente
              </option>

              <option value="annule">
                Annulé
              </option>

              <option value="termine">
                Terminé
              </option>

            </select>

            {/* SPECIALITE */}

            <select
              value={specialiteFilter}
              onChange={(e) =>
                setSpecialiteFilter(
                  e.target.value
                )
              }
            >

              <option>
                Toutes les spécialités
              </option>

              {specialites.map(
                (specialite) => (
                  <option
                    key={specialite}
                    value={specialite}
                  >
                    {specialite}
                  </option>
                )
              )}

            </select>

            {/* DATE RANGE FROM DATABASE */}

            <div className="date-filter">

              📅

              <span>
                {dateRange}
              </span>

            </div>

            {/* NEW RDV */}

            <Link
              to="/responsable/rendez-vous/create"
              className="new-rdv-btn"
            >

              <span>
                ＋
              </span>

              Nouveau rendez-vous

            </Link>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Patient
                  </th>

                  <th>
                    Médecin
                  </th>

                  <th>
                    Spécialité
                  </th>

                  <th>
                    Date & Heure
                  </th>

                  <th>
                    Statut
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {paginatedRendezVous.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="empty-row"
                    >
                      Aucun rendez-vous trouvé.
                    </td>

                  </tr>

                ) : (

                  paginatedRendezVous.map(
                    (rdv) => {

                      const patient =
                        getPatientName(rdv);

                      const medecin =
                        getMedecinName(rdv);

                      const specialite =
                        getSpecialite(rdv);

                      return (

                        <tr
                          key={rdv.id}
                        >

                          {/* ID */}

                          <td>

                            <strong>
                              {rdv.id}
                            </strong>

                          </td>

                          {/* PATIENT */}

                          <td>

                            <div className="person-cell">

                              <div className="person-avatar patient-avatar">

                                {patient
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {patient}
                                </strong>

                                <small>
                                  {getPatientPhone(
                                    rdv
                                  )}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* MEDECIN */}

                          <td>

                            <div className="person-cell">

                              <div className="person-avatar doctor-avatar">
                                👨‍⚕️
                              </div>

                              <strong>
                                {medecin}
                              </strong>

                            </div>

                          </td>

                          {/* SPECIALITE */}

                          <td>

                            <div className="speciality">

                              <span className="speciality-icon">
                                ✚
                              </span>

                              {specialite}

                            </div>

                          </td>

                          {/* DATE */}

                          <td>

                            <div className="datetime">

                              <strong>
                                {formatDate(
                                  rdv.date
                                )}
                              </strong>

                              <span>
                                {getTime(rdv)}
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`status-badge ${getStatusClass(
                                rdv.statut
                              )}`}
                            >

                              {getStatusLabel(
                                rdv.statut
                              )}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="actions">

                              <button
                                className="action view"
                                title="Voir"
                                onClick={() =>
                                  voirDetails(
                                    rdv.id
                                  )
                                }
                              >
                                👁
                              </button>

                              <button
                                className="action edit"
                                title="Modifier"
                                onClick={() =>
                                  voirDetails(
                                    rdv.id
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                className="action delete"
                                title="Supprimer"
                                onClick={() =>
                                  supprimer(
                                    rdv.id
                                  )
                                }
                              >
                                🗑
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

          <div className="table-footer">

            <span>

              Affichage de{" "}

              <strong>
                {filteredRendezVous.length === 0
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
                  filteredRendezVous.length
                )}
              </strong>

              {" "}sur{" "}

              <strong>
                {filteredRendezVous.length}
              </strong>

              {" "}rendez-vous

            </span>

            <div className="pagination">

              {/* PREVIOUS */}

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

              {/* PAGES */}

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
                    currentPage ===
                    page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                >
                  {page}
                </button>

              ))}

              {/* NEXT */}

              <button
                disabled={
                  totalPages === 0 ||
                  currentPage ===
                    totalPages
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

      {selectedRdv && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedRdv(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-label">
                  RENDEZ-VOUS
                </span>

                <h2>
                  Rendez-vous #
                  {selectedRdv.id}
                </h2>

              </div>

              <button
                className="close-modal"
                onClick={() =>
                  setSelectedRdv(null)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="modal-body">

              {/* PATIENT */}

              <div className="detail-section">

                <h3>
                  Informations du patient
                </h3>

                <div className="detail-grid">

                  <div>

                    <label>
                      Patient
                    </label>

                    <strong>
                      {getPatientName(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                  <div>

                    <label>
                      Email
                    </label>

                    <strong>
                      {getPatientEmail(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                  <div>

                    <label>
                      Téléphone
                    </label>

                    <strong>
                      {getPatientPhone(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              {/* MEDECIN */}

              <div className="detail-section">

                <h3>
                  Informations du médecin
                </h3>

                <div className="detail-grid">

                  <div>

                    <label>
                      Médecin
                    </label>

                    <strong>
                      {getMedecinName(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                  <div>

                    <label>
                      Spécialité
                    </label>

                    <strong>
                      {getSpecialite(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              {/* APPOINTMENT */}

              <div className="appointment-info">

                <div>

                  <span>
                    📅
                  </span>

                  <div>

                    <small>
                      Date
                    </small>

                    <strong>
                      {formatDate(
                        selectedRdv.date
                      )}
                    </strong>

                  </div>

                </div>

                <div>

                  <span>
                    🕐
                  </span>

                  <div>

                    <small>
                      Heure
                    </small>

                    <strong>
                      {getTime(
                        selectedRdv
                      )}
                    </strong>

                  </div>

                </div>

                <div>

                  <span>
                    ●
                  </span>

                  <div>

                    <small>
                      Statut
                    </small>

                    <strong>
                      {getStatusLabel(
                        selectedRdv.statut
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="modal-footer">

              <button
                className="btn-confirm"
                onClick={() =>
                  modifierStatut(
                    selectedRdv.id,
                    "confirme"
                  )
                }
              >
                ✓ Confirmer
              </button>

              <button
                className="btn-cancel"
                onClick={() =>
                  modifierStatut(
                    selectedRdv.id,
                    "annule"
                  )
                }
              >
                × Annuler
              </button>

              <button
                className="btn-complete"
                onClick={() =>
                  modifierStatut(
                    selectedRdv.id,
                    "termine"
                  )
                }
              >
                ✓ Terminer
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default RendezVous;
