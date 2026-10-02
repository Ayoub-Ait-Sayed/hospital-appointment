import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/ResponsableMedecins.css";

function ResponsableMedecins() {
  // =========================
  // STATES
  // =========================

  const [medecins, setMedecins] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  // Recherche + filtres
  const [search, setSearch] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Médecin en modification
  const [editId, setEditId] = useState(null);

  // Formulaire
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialite_id: "",
    telephone: "",
    description: "",
    image: null,
  });

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =========================
  // RÉCUPÉRER LES MÉDECINS
  // =========================

  const fetchMedecins = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/responsable/medecins",
        { headers }
      );

      setMedecins(
        response.data?.medecins ||
        response.data?.data ||
        []
      );

    } catch (error) {
      console.error(
        "Erreur médecins :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RÉCUPÉRER LES SPÉCIALITÉS
  // =========================

  const fetchSpecialites = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/specialites",
        { headers }
      );

      setSpecialites(
        response.data?.specialites ||
        response.data?.data ||
        []
      );

    } catch (error) {
      console.error(
        "Erreur spécialités :",
        error
      );
    }
  };

  // =========================
  // CHARGEMENT
  // =========================

  useEffect(() => {
    fetchMedecins();
    fetchSpecialites();
  }, []);

  // =========================
  // FORMULAIRE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    setForm({
      ...form,
      [name]: files
        ? files[0]
        : value,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      specialite_id: "",
      telephone: "",
      description: "",
      image: null,
    });

    setEditId(null);
  };

  // =========================
  // OUVRIR AJOUT
  // =========================

  const ouvrirAjout = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================
  // MODIFIER MÉDECIN
  // =========================

  const modifierMedecin = (medecin) => {
    setEditId(medecin.id);

    setForm({
      name:
        medecin.user?.name ||
        medecin.name ||
        "",

      email:
        medecin.user?.email ||
        medecin.email ||
        "",

      password: "",

      specialite_id:
        medecin.specialite?.id ||
        medecin.specialite_id ||
        "",

      telephone:
        medecin.telephone ||
        "",

      description:
        medecin.description ||
        "",

      image: null,
    });

    setShowModal(true);
  };

  // =========================
  // AJOUTER / MODIFIER
  // =========================

  const ajouterMedecin = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "email",
        form.email
      );

      // Password uniquement si rempli
      if (form.password) {
        formData.append(
          "password",
          form.password
        );
      }

      formData.append(
        "specialite_id",
        form.specialite_id
      );

      formData.append(
        "telephone",
        form.telephone
      );

      formData.append(
        "description",
        form.description
      );

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      // =========================
      // MODIFICATION
      // =========================

      if (editId) {
        await axios.post(
          `http://127.0.0.1:8000/api/responsable/medecins/${editId}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",

              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Médecin modifié avec succès."
        );
      }

      // =========================
      // AJOUT
      // =========================

      else {
        await axios.post(
          "http://127.0.0.1:8000/api/responsable/medecins",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",

              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Médecin ajouté avec succès."
        );
      }

      resetForm();

      setShowModal(false);

      fetchMedecins();

    } catch (error) {
      console.error(
        "Erreur médecin :",
        error
      );

      console.error(
        "Response :",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Erreur lors de l'opération."
      );
    }
  };

  // =========================
  // SUPPRIMER
  // =========================

  const supprimerMedecin = async (id) => {
    if (
      !window.confirm(
        "Voulez-vous supprimer ce médecin ?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/responsable/medecins/${id}`,
        { headers }
      );

      alert(
        "Médecin supprimé avec succès."
      );

      fetchMedecins();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Erreur lors de la suppression."
      );
    }
  };

  // =========================
  // RECHERCHE + FILTRES
  // =========================

  const medecinsFiltres = medecins.filter(
    (medecin) => {

      const nom =
        medecin.user?.name ||
        medecin.name ||
        "";

      const email =
        medecin.user?.email ||
        medecin.email ||
        "";

      const telephone =
        medecin.telephone ||
        "";

      const specialite =
        medecin.specialite?.nom ||
        "";

      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchSearch =
        nom
          .toLowerCase()
          .includes(searchText) ||

        email
          .toLowerCase()
          .includes(searchText) ||

        telephone
          .toLowerCase()
          .includes(searchText) ||

        specialite
          .toLowerCase()
          .includes(searchText);

      const matchSpecialite =
        !filterSpecialite ||
        String(
          medecin.specialite?.id ||
          medecin.specialite_id ||
          ""
        ) ===
          String(filterSpecialite);

      const matchStatus =
        !filterStatus ||
        (
          medecin.status ||
          "active"
        ) === filterStatus;

      return (
        matchSearch &&
        matchSpecialite &&
        matchStatus
      );
    }
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="rm-loading">
        Chargement des médecins...
      </div>
    );
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="rm-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="rm-header">

        <div>

          <span className="rm-label">
            ESPACE RESPONSABLE
          </span>

          <h1>
            Gestion des médecins
          </h1>

          <p>
            Consultez et gérez les médecins de l'hôpital.
          </p>

        </div>

        <Link
          to="/responsable/dashboard"
          className="rm-back"
        >
          ← Retour
        </Link>

      </div>


      {/* =========================
          STATISTIQUES
      ========================= */}

      <div className="rm-stats">

        {/* TOTAL */}

        <div className="rm-stat">

          <div className="rm-stat-icon blue">
            👨‍⚕️
          </div>

          <div>

            <span>
              Total des médecins
            </span>

            <strong>
              {medecins.length}
            </strong>

            <small>
              Médecins enregistrés
            </small>

          </div>

        </div>


        {/* ACTIFS */}

        <div className="rm-stat">

          <div className="rm-stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Médecins actifs
            </span>

            <strong>
              {
                medecins.filter(
                  (m) =>
                    m.status === "active"
                ).length
              }
            </strong>

            <small>
              Actifs actuellement
            </small>

          </div>

        </div>


        {/* ATTENTE */}

        <div className="rm-stat">

          <div className="rm-stat-icon orange">
            !
          </div>

          <div>

            <span>
              En attente
            </span>

            <strong>
              {
                medecins.filter(
                  (m) =>
                    m.status === "pending"
                ).length
              }
            </strong>

            <small>
              En cours de validation
            </small>

          </div>

        </div>


        {/* DÉSACTIVÉS */}

        <div className="rm-stat">

          <div className="rm-stat-icon red">
            ×
          </div>

          <div>

            <span>
              Désactivés
            </span>

            <strong>
              {
                medecins.filter(
                  (m) =>
                    m.status === "inactive"
                ).length
              }
            </strong>

            <small>
              Médecins désactivés
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          ACTION BAR
      ========================= */}

      <div className="rm-actions">

        {/* RECHERCHE */}

        <input
          type="text"
          placeholder="🔍  Rechercher un médecin..."
          className="rm-search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        {/* SPECIALITÉ */}

        <select
          className="rm-filter"
          value={filterSpecialite}
          onChange={(e) =>
            setFilterSpecialite(
              e.target.value
            )
          }
        >

          <option value="">
            Toutes les spécialités
          </option>

          {specialites.map(
            (specialite) => (

              <option
                key={specialite.id}
                value={specialite.id}
              >
                {specialite.nom}
              </option>

            )
          )}

        </select>


        {/* STATUS */}

        <select
          className="rm-filter"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
        >

          <option value="">
            Tous les statuts
          </option>

          <option value="active">
            Actif
          </option>

          <option value="pending">
            En attente
          </option>

          <option value="inactive">
            Désactivé
          </option>

        </select>


        {/* AJOUT */}

        <button
          className="rm-add-button"
          onClick={ouvrirAjout}
        >
          <span>＋</span>
          Ajouter un médecin
        </button>

      </div>


      {/* =========================
          LISTE
      ========================= */}

      <div className="rm-list">

        <div className="rm-list-header">

          <h2>
            Liste des médecins
          </h2>

          <span>
            {medecinsFiltres.length} médecins
          </span>

        </div>


        {medecinsFiltres.length === 0 ? (

          <div className="rm-empty">

            <div>
              👨‍⚕️
            </div>

            <h3>
              Aucun médecin
            </h3>

            <p>
              Aucun médecin ne correspond à votre recherche.
            </p>

          </div>

        ) : (

          <div className="rm-table">

            {/* TABLE HEADER */}

            <div className="rm-table-head">

              <span>#</span>

              <span>
                Photo
              </span>

              <span>
                Nom & Prénom
              </span>

              <span>
                Email
              </span>

              <span>
                Spécialité
              </span>

              <span>
                Téléphone
              </span>

              <span>
                Statut
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* TABLE ROWS */}

            {medecinsFiltres.map(
              (medecin, index) => {

                const imageUrl =
                  medecin.image
                    ? `http://127.0.0.1:8000/storage/${medecin.image}`
                    : null;

                return (

                  <div
                    className="rm-table-row"
                    key={medecin.id}
                  >

                    {/* NUMÉRO */}

                    <span>
                      {index + 1}
                    </span>


                    {/* PHOTO */}

                    <div className="rm-doctor-photo">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt="Médecin"
                          onError={(e) => {
                            e.target.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <span>
                          👨‍⚕️
                        </span>

                      )}

                    </div>


                    {/* NOM */}

                    <strong>
                      {medecin.user?.name ||
                        medecin.name ||
                        "Médecin"}
                    </strong>


                    {/* EMAIL */}

                    <span>
                      {medecin.user?.email ||
                        medecin.email ||
                        "-"}
                    </span>


                    {/* SPECIALITÉ */}

                    <span>
                      {medecin.specialite?.nom ||
                        "-"}
                    </span>


                    {/* TELEPHONE */}

                    <span>
                      {medecin.telephone ||
                        "-"}
                    </span>


                    {/* STATUS */}

                    <span>

                      <span
                        className={`rm-status ${
                          medecin.status ||
                          "active"
                        }`}
                      >

                        ●{" "}

                        {medecin.status ===
                        "active"

                          ? "Actif"

                          : medecin.status ===
                            "pending"

                          ? "En attente"

                          : "Désactivé"}

                      </span>

                    </span>


                    {/* ACTIONS */}

                    <div className="rm-row-actions">

                      {/* MODIFIER */}

                      <button
                        className="rm-edit"
                        onClick={() =>
                          modifierMedecin(
                            medecin
                          )
                        }
                        title="Modifier"
                      >
                        ✎
                      </button>


                      {/* SUPPRIMER */}

                      <button
                        className="rm-delete"
                        onClick={() =>
                          supprimerMedecin(
                            medecin.id
                          )
                        }
                        title="Supprimer"
                      >
                        🗑
                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>


      {/* =================================================
          MODAL AJOUTER / MODIFIER MÉDECIN
      ================================================= */}

      {showModal && (

        <div
          className="rm-modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="rm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER MODAL */}

            <div className="rm-modal-header">

              <div className="rm-modal-title">

                <div className="rm-modal-icon">
                  👨‍⚕️
                </div>

                <div>

                  <h2>
                    {editId
                      ? "Modifier le médecin"
                      : "Ajouter un médecin"}
                  </h2>

                  <p>
                    {editId
                      ? "Modifier les informations du médecin"
                      : "Créer un nouveau profil médecin"}
                  </p>

                </div>

              </div>


              <button
                className="rm-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="rm-form"
              onSubmit={ajouterMedecin}
            >

              <div className="rm-form-grid">

                {/* NOM */}

                <div className="rm-field">

                  <label>
                    Nom complet
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex : Dr. Ahmed Benali"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="rm-field">

                  <label>
                    Email
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="exemple@hospital.com"
                    required
                  />

                </div>


                {/* PASSWORD */}

                <div className="rm-field">

                  <label>
                    Mot de passe

                    {!editId && (
                      <span>*</span>
                    )}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      editId
                        ? "Laisser vide pour conserver"
                        : "Choisir un mot de passe"
                    }
                    required={!editId}
                  />

                </div>


                {/* SPECIALITÉ */}

                <div className="rm-field">

                  <label>
                    Spécialité
                    <span>*</span>
                  </label>

                  <select
                    name="specialite_id"
                    value={
                      form.specialite_id
                    }
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Sélectionner une spécialité
                    </option>

                    {specialites.map(
                      (specialite) => (

                        <option
                          key={specialite.id}
                          value={specialite.id}
                        >
                          {specialite.nom}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* TELEPHONE */}

                <div className="rm-field">

                  <label>
                    Téléphone
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    required
                  />

                </div>


                {/* IMAGE */}

                <div className="rm-field">

                  <label>
                    Photo du médecin
                  </label>

                  <div className="rm-upload">

                    <input
                      type="file"
                      name="image"
                      id="doctor-image"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleChange}
                    />

                    <label
                      htmlFor="doctor-image"
                      className="rm-upload-label"
                    >

                      <div>
                        ☁
                      </div>

                      <strong>
                        Cliquer pour choisir une image
                      </strong>

                      <small>
                        PNG, JPG, JPEG, WEBP
                        <br />
                        (max 2MB)
                      </small>

                    </label>

                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="rm-field rm-description">

                <label>
                  Description
                  <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Entrez la description du médecin..."
                  required
                />

              </div>


              {/* FOOTER */}

              <div className="rm-modal-footer">

                <button
                  type="button"
                  className="rm-cancel"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Annuler
                </button>


                <button
                  type="submit"
                  className="rm-submit"
                >

                  {editId
                    ? "✓ Enregistrer les modifications"
                    : "＋ Ajouter le médecin"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default ResponsableMedecins;

