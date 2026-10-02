import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/adminSpecialité.css";

function Specialites() {
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    nom: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =========================================================
  // CHARGER LES SPÉCIALITÉS
  // =========================================================

  const fetchSpecialites = async () => {
    try {
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/specialites",
        { headers }
      );

      setSpecialites(response.data.specialites || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les spécialités."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialites();
  }, []);

  // =========================================================
  // CHANGEMENT FORMULAIRE
  // =========================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      nom: "",
      description: "",
    });

    setEditingId(null);
  };

  // =========================================================
  // AJOUTER / MODIFIER
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/specialites/${editingId}`,
          form,
          { headers }
        );

        alert("Spécialité modifiée avec succès.");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/admin/specialites",
          form,
          { headers }
        );

        alert("Spécialité ajoutée avec succès.");
      }

      resetForm();
      fetchSpecialites();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Une erreur est survenue."
      );
    }
  };

  // =========================================================
  // MODIFIER
  // =========================================================

  const modifier = (specialite) => {
    setEditingId(specialite.id);

    setForm({
      nom: specialite.nom || "",
      description: specialite.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const supprimer = async (id) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cette spécialité ?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/admin/specialites/${id}`,
        { headers }
      );

      alert("Spécialité supprimée avec succès.");

      fetchSpecialites();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    }
  };

  // =========================================================
  // RECHERCHE PAR NOM DE SPÉCIALITÉ UNIQUEMENT
  // =========================================================

  const filteredSpecialites = specialites.filter((specialite) => {
    const search = searchTerm.toLowerCase().trim();
    const nom = (specialite.nom || "").toLowerCase().trim();

    return nom.startsWith(search);
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="specialites-loading">
        <div className="loading-spinner"></div>

        <p>
          Chargement des spécialités...
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="specialites-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="specialites-page-header">

        <div className="header-icon">
          🩺
        </div>

        <div className="header-content">

          <h1>
            Gestion des spécialités
          </h1>

          <p>
            Gérez les spécialités médicales de l'établissement
          </p>

        </div>

        {/* ===================================================
            RETOUR
        =================================================== */}

        <Link
          to="/admin/dashboard"
          className="bace-button"
        >
          ← Retour
        </Link>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="specialites-layout">


        {/* ===================================================
            FORMULAIRE
        =================================================== */}

        <div className="specialite-form-card">

          <div className="card-title">

            <div className="title-icon">
              +
            </div>

            <h2>
              {editingId
                ? "Modifier une spécialité"
                : "Ajouter une spécialité"}
            </h2>

          </div>


          <form onSubmit={handleSubmit}>

            {/* NOM */}

            <div className="form-group">

              <label htmlFor="nom">
                Nom de la spécialité
              </label>

              <input
                id="nom"
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Ex : Cardiologie"
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description de la spécialité..."
                rows="5"
              />

            </div>


            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                type="submit"
                className="add-button"
              >
                {editingId
                  ? "Modifier"
                  : "Ajouter"}
              </button>


              {editingId && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}

            </div>

          </form>

        </div>


        {/* ===================================================
            LISTE
        =================================================== */}

        <div className="specialites-list-card">


          {/* HEADER LISTE */}

          <div className="list-header">

            <div className="list-title">

              <div className="title-icon">
                ☷
              </div>

              <h2>
                Liste des spécialités
              </h2>

            </div>


            <div className="list-actions">

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>


             <button
                type="button"
                className="refresh-button"
                onClick={() => {
                  setSearchTerm("");
                  fetchSpecialites();
                }}
                title="Actualiser"
              >
                ↻
              </button>

            </div>

          </div>


          {/* LISTE */}

          <div className="specialites-list">

            {filteredSpecialites.length === 0 ? (

              <div className="empty-specialites">

                <div>
                  🩺
                </div>

                <p>
                  {searchTerm
                    ? "Aucune spécialité ne correspond à votre recherche."
                    : "Aucune spécialité trouvée."}
                </p>

              </div>

            ) : (

              filteredSpecialites.map((specialite) => (

                <div
                  className="specialite-row"
                  key={specialite.id}
                >

                  {/* ICON */}

                  <div className="specialite-icon">
                    🩺
                  </div>


                  {/* INFO */}

                  <div className="specialite-info">

                    <h3>
                      {specialite.nom}
                    </h3>

                    <p>
                      {specialite.description ||
                        "Aucune description disponible."}
                    </p>

                  </div>


                  {/* ACTIONS */}

                  <div className="specialite-act">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        modifier(specialite)
                      }
                    >
                      Modifier
                    </button>


                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        supprimer(specialite.id)
                      }
                    >
                      Supprimer
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>


          {/* FOOTER */}

          <div className="list-footer">

            <span>
              Total :{" "}
              <strong>
                {filteredSpecialites.length}
              </strong>{" "}
              spécialité(s)
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Specialites;
