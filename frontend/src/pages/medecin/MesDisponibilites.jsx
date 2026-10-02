import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/MesDisponibilites.css";

function MesDisponibilites() {
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    date: "",
    heure_debut: "",
    heure_fin: "",
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchDisponibilites = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/medecin/disponibilites",
        { headers }
      );

      setDisponibilites(response.data.disponibilites || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les disponibilités."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponibilites();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setForm({
      date: "",
      heure_debut: "",
      heure_fin: "",
    });

    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.date) {
      setError("Veuillez choisir une date.");
      return;
    }

    if (!form.heure_debut || !form.heure_fin) {
      setError("Veuillez choisir les heures.");
      return;
    }

    if (form.heure_debut >= form.heure_fin) {
      setError(
        "L'heure de début doit être avant l'heure de fin."
      );
      return;
    }

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateChoisie = new Date(`${form.date}T00:00:00`);

    if (dateChoisie < aujourdHui) {
      setError(
        "Vous ne pouvez pas ajouter une disponibilité dans le passé."
      );
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/medecin/disponibilites/${editingId}`,
          form,
          { headers }
        );

        setSuccess("Disponibilité modifiée avec succès.");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/medecin/disponibilites",
          form,
          { headers }
        );

        setSuccess("Disponibilité ajoutée avec succès.");
      }

      resetForm();
      await fetchDisponibilites();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Erreur lors de l'enregistrement."
      );
    }
  };

  const modifier = (disponibilite) => {
    setEditingId(disponibilite.id);

    setForm({
      date: disponibilite.date,
      heure_debut: disponibilite.heure_debut.substring(0, 5),
      heure_fin: disponibilite.heure_fin.substring(0, 5),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const supprimer = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette disponibilité ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axios.delete(
        `http://127.0.0.1:8000/api/medecin/disponibilites/${id}`,
        { headers }
      );

      setSuccess("Disponibilité supprimée avec succès.");

      await fetchDisponibilites();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    }
  };

  const formatDate = (date) => {
    const d = new Date(`${date}T00:00:00`);

    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="availability-page">
        <div className="availability-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de vos disponibilités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">

      {/* Background decoration */}
      <div className="availability-bg-circle circle-one"></div>
      <div className="availability-bg-circle circle-two"></div>

      <div className="availability-container">

        {/* ================= HEADER ================= */}

        <div className="availability-header">

          <div className="header-left">

            <Link
              to="/medecin/dashboard"
              className="back-button"
            >
              ←
              <span>Retour au dashboard</span>
            </Link>

            <div className="page-title">

              

              <div>
                <span className="page-label">
                  GESTION DU PLANNING
                </span>

                <h1>
                  Mes disponibilités
                </h1>

                <p>
                  Gérez vos horaires disponibles pour vos patients.
                </p>
              </div>

            </div>

          </div>

          <div className="header-badge">
            <span className="online-dot"></span>
            Planning actif
          </div>

        </div>


        {/* ================= MESSAGES ================= */}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">!</span>

            <div>
              <strong>Attention</strong>
              <p>{error}</p>
            </div>

            <button
              onClick={() => setError("")}
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>

            <div>
              <strong>Opération réussie</strong>
              <p>{success}</p>
            </div>

            <button
              onClick={() => setSuccess("")}
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}


        {/* ================= CONTENT ================= */}

        <div className="availability-grid">

          {/* ================= FORM ================= */}

          <div className="availability-form-card">

            <div className="card-top">

              <div className="card-icon blue">
                {editingId ? "✎" : "+"}
              </div>

              <div>
                <h2>
                  {editingId
                    ? "Modifier la disponibilité"
                    : "Ajouter une disponibilité"}
                </h2>

                <p>
                  {editingId
                    ? "Modifiez les horaires sélectionnés."
                    : "Ajoutez un nouveau créneau à votre planning."}
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Date
                </label>

                <div className="input-wrapper">

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date()
                      .toISOString()
                      .split("T")[0]}
                    required
                  />
                </div>

              </div>


              {/* HEURES */}

              <div className="time-grid">

                <div className="form-group">

                  <label>
                    Heure de début
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="time"
                      name="heure_debut"
                      value={form.heure_debut}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Heure de fin
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="time"
                      name="heure_fin"
                      value={form.heure_fin}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

              </div>


              {/* INFO */}

              <div className="form-info">
                <span>💡</span>

                <p>
                  Assurez-vous que l'heure de début est
                  antérieure à l'heure de fin.
                </p>
              </div>


              {/* BUTTONS */}

              <div className="form-buttons">

                <button
                  type="submit"
                  className="save-button"
                >
                  <span>
                    {editingId ? "✓" : "+"}
                  </span>

                  {editingId
                    ? "Enregistrer les modifications"
                    : "Ajouter la disponibilité"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
                )}

              </div>

            </form>

          </div>


          {/* ================= LISTE ================= */}

          <div className="availability-list-card">

            <div className="card-top list-header">

              <div>

                <div className="list-title-row">

                  <div className="card-icon green">
                    ✓
                  </div>

                  <div>
                    <h2>
                      Mes créneaux
                    </h2>

                    <p>
                      Vos disponibilités enregistrées
                    </p>
                  </div>

                </div>

              </div>

              <div className="count-badge">
                {disponibilites.length}
              </div>

            </div>


            {disponibilites.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📅
                </div>

                <h3>
                  Aucun créneau
                </h3>

                <p>
                  Vous n'avez encore enregistré
                  aucune disponibilité.
                </p>

              </div>

            ) : (

              <div className="availability-items">

                {disponibilites.map(
                  (disponibilite) => (

                    <div
                      className="availability-item"
                      key={disponibilite.id}
                    >

                      <div className="date-box">

                        <span className="date-day">
                          {new Date(
                            `${disponibilite.date}T00:00:00`
                          ).getDate()}
                        </span>

                        <span className="date-month">
                          {new Date(
                            `${disponibilite.date}T00:00:00`
                          )
                            .toLocaleDateString("fr-FR", {
                              month: "short",
                            })
                            .replace(".", "")
                            .toUpperCase()}
                        </span>

                      </div>


                      <div className="availability-info">

                        <h3>
                          {formatDate(
                            disponibilite.date
                          )}
                        </h3>

                        <div className="time-display">

                          <span>
                            🕐
                          </span>

                          <strong>
                            {disponibilite.heure_debut.substring(
                              0,
                              5
                            )}
                          </strong>

                          <span className="time-arrow">
                            →
                          </span>

                          <strong>
                            {disponibilite.heure_fin.substring(
                              0,
                              5
                            )}
                          </strong>

                        </div>

                      </div>


                      <div className="item-actions">

                        <button
                          onClick={() =>
                            modifier(disponibilite)
                          }
                          className="edit-button"
                          title="Modifier"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() =>
                            supprimer(
                              disponibilite.id
                            )
                          }
                          className="delete-button"
                          title="Supprimer"
                        >
                          🗑
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* ================= FOOTER INFO ================= */}

        <div className="bottom-info">

          <div className="bottom-info-icon">
            ✓
          </div>

          <div>
            <strong>
              Votre planning est important
            </strong>

            <p>
              Gardez vos disponibilités à jour afin
              de permettre à vos patients de prendre
              rendez-vous facilement.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MesDisponibilites;
