import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PrendreRendezVous() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { medecinId, disponibilite } = location.state || {};

  if (!medecinId || !disponibilite) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Créneau introuvable.</h2>

        <button
          onClick={() => navigate("/patient/specialites")}
        >
          Retour
        </button>
      </div>
    );
  }

  const confirmerRendezVous = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/rendez-vous",
        {
          medecin_id: medecinId,
          date: disponibilite.date,
          heure: disponibilite.heure_debut.substring(0, 5),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      alert(
        response.data.message ||
          "Rendez-vous créé avec succès."
      );

      navigate("/patient/rendez-vous");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Impossible de créer le rendez-vous."
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Confirmer le rendez-vous</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <p>
          <strong>Date :</strong>{" "}
          {disponibilite.date}
        </p>

        <p>
          <strong>Heure de début :</strong>{" "}
          {disponibilite.heure_debut}
        </p>

        <p>
          <strong>Heure de fin :</strong>{" "}
          {disponibilite.heure_fin}
        </p>

        <button
          onClick={confirmerRendezVous}
          style={{ marginRight: "10px" }}
        >
          Confirmer le rendez-vous
        </button>

        <button
          onClick={() =>
            navigate(
              `/patient/medecins/${medecinId}/disponibilites`
            )
          }
        >
          Retour
        </button>
      </div>
    </div>
  );
}

export default PrendreRendezVous;