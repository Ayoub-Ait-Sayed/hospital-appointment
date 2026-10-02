import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/UsersAdmin.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // =========================
  // Charger utilisateurs
  // =========================

  const fetchUsers = async () => {
    try {
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/users",
        { headers }
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Modifier rôle
  // =========================

  const modifierRole = async (id, role) => {
    if (!role) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin/users/${id}/role`,
        { role },
        { headers }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la modification du rôle."
      );
    }
  };

  // =========================
  // Supprimer utilisateur
  // =========================

  const supprimer = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous supprimer cet utilisateur ?"
    );

    if (!confirmation) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/admin/users/${id}`,
        { headers }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    }
  };

  // =========================
  // Recherche + filtre
  // =========================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue);

    const matchesRole =
      filterRole === "all" ||
      user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // =========================
  // Statistiques
  // =========================

  const totalUsers = users.length;

  const totalPatients = users.filter(
    (user) => user.role === "patient"
  ).length;

  const totalMedecins = users.filter(
    (user) => user.role === "medecin"
  ).length;

  const totalResponsables = users.filter(
    (user) => user.role === "responsable"
  ).length;

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="users-page">

     


      {/* =========================
          HEADER
      ========================= */}

      <div className="users-header">

        <div>
          <h1>Gestion des utilisateurs</h1>

          <p>
            Tableau de bord&nbsp; / &nbsp;Utilisateurs
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="back-button"
        >
          ← Retour
        </Link>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =========================
          STATISTIQUES
      ========================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            👥
          </div>

          <div>
            <h3>{totalUsers}</h3>
            <p>Total utilisateurs</p>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon green">
            👤
          </div>

          <div>
            <h3>{totalPatients}</h3>
            <p>Patients</p>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon purple">
            🩺
          </div>

          <div>
            <h3>{totalMedecins}</h3>
            <p>Médecins</p>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon orange">
            🛡️
          </div>

          <div>
            <h3>{totalResponsables}</h3>
            <p>Responsables</p>
          </div>
        </div>

      </div>


      {/* =========================
          USERS CONTAINER
      ========================= */}

      <div className="users-container">

        {/* Header liste */}

        <div className="users-list-header">

          <div>
            <h2>Liste des utilisateurs</h2>
            <p>
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </p>
          </div>


          <div className="users-tools">

            <div className="user-search">
              🔍

              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>


            <select
              className="role-filter"
              value={filterRole}
              onChange={(e) =>
                setFilterRole(e.target.value)
              }
            >
              <option value="all">
                Tous les rôles
              </option>

              <option value="patient">
                Patient
              </option>

              <option value="medecin">
                Médecin
              </option>

              <option value="responsable">
                Responsable
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

          </div>

        </div>


        {/* =========================
            TABLE
        ========================= */}

        {filteredUsers.length === 0 ? (

          <div className="empty-users">

            <div className="empty-icon">
              👥
            </div>

            <h3>
              Aucun utilisateur trouvé
            </h3>

            <p>
              Aucun utilisateur ne correspond à votre recherche.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="users-table">

              <thead>
                <tr>

                  <th>#</th>

                  <th>Utilisateur</th>

                  <th>Email</th>

                  <th>Rôle</th>

                  <th>Téléphone</th>

                  <th>Actions</th>

                </tr>
              </thead>


              <tbody>

                {filteredUsers.map((user, index) => {

                  const photoUrl = user.photo
                    ? user.photo.startsWith("http")
                      ? user.photo
                      : `http://127.0.0.1:8000/storage/${user.photo}`
                    : null;


                  return (
                    <tr key={user.id}>

                      {/* ID */}

                      <td className="user-number">
                        {index + 1}
                      </td>


                      {/* USER */}

                      <td>

                        <div className="user-cell">

                          <div className="user-avatar">

                            {photoUrl ? (

                              <img
                                src={photoUrl}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.style.display =
                                    "none";
                                  e.target.nextSibling.style.display =
                                    "flex";
                                }}
                              />

                            ) : null}


                            <div
                              className="default-avatar"
                              style={{
                                display: photoUrl
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              👤
                            </div>

                          </div>


                          <div className="user-name">

                            <strong>
                              {user.name}
                            </strong>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>
                        <span className="email-text">
                          {user.email}
                        </span>
                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={`role-badge ${
                            user.role || "unknown"
                          }`}
                        >
                          {user.role === "patient" &&
                            "Patient"}

                          {user.role === "medecin" &&
                            "Médecin"}

                          {user.role === "responsable" &&
                            "Responsable"}

                          {user.role === "admin" &&
                            "Admin"}

                          {!user.role &&
                            "Non défini"}
                        </span>


                        <select
                          className="role-select"
                          value={user.role || ""}
                          onChange={(e) =>
                            modifierRole(
                              user.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Modifier
                          </option>

                          <option value="patient">
                            Patient
                          </option>

                          <option value="medecin">
                            Médecin
                          </option>

                          <option value="responsable">
                            Responsable
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                      </td>


                      {/* TELEPHONE */}

                      <td>
                        <span className="phone-text">
                          {user.telephone ||
                            user.phone ||
                            "Non renseigné"}
                        </span>
                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            title="Modifier le rôle"
                            onClick={() =>
                              modifierRole(
                                user.id,
                                user.role
                              )
                            }
                          >
                            ✏️
                          </button>


                          <button
                            className="delete-button"
                            title="Supprimer"
                            onClick={() =>
                              supprimer(user.id)
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Users;