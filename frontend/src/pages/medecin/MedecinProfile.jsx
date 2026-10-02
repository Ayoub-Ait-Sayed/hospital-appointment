import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MedecinProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  // ================================
  // Charger profil
  // ================================

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/medecin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setProfile(response.data.medecin);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger le profil."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================================
  // Choisir image
  // ================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Vérifier type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir une image valide.");
      return;
    }

    // Vérifier taille : 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // ================================
  // Ajouter / modifier photo
  // ================================

  const handleUpload = async () => {
    if (!image) {
      setError("Veuillez choisir une photo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("image", image);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/medecin/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mettre à jour le profil
      setProfile(response.data.medecin);

      setImage(null);
      setPreview(null);

      alert("Photo ajoutée avec succès.");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible d'ajouter la photo."
      );
    } finally {
      setUploading(false);
    }
  };

  // ================================
  // Loading
  // ================================

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Chargement...</h2>
      </div>
    );
  }

  // ================================
  // Profil
  // ================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >

      <h1>Mon profil médecin</h1>

      <Link to="/medecin/dashboard">
        <button
          style={{
            padding: "10px 18px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Retour
        </button>
      </Link>

      {error && (
        <p
          style={{
            color: "red",
            background: "#ffecec",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {error}
        </p>
      )}

      {profile && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            background: "white",
            maxWidth: "600px",
          }}
        >

          {/* ================================
              PHOTO
          ================================ */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            {preview ? (

              <img
                src={preview}
                alt="Aperçu"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #0d6efd",
                }}
              />

            ) : profile.image ? (

              <img
                src={`http://127.0.0.1:8000/storage/${profile.image}`}
                alt="Photo du médecin"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #0d6efd",
                }}
              />

            ) : (

              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "#eef6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  fontSize: "60px",
                  border: "4px solid #dbeafe",
                }}
              >
                👨‍⚕️
              </div>

            )}

          </div>


          {/* ================================
              AJOUTER PHOTO
          ================================ */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            <label
              htmlFor="photo"
              style={{
                display: "inline-block",
                padding: "11px 20px",
                background: "#0d6efd",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              📷 {profile.image ? "Modifier la photo" : "Ajouter une photo"}
            </label>

            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              style={{
                display: "none",
              }}
            />

          </div>


          {/* ================================
              BOUTON ENREGISTRER
          ================================ */}

          {image && (

            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >

              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  padding: "11px 25px",
                  border: "none",
                  borderRadius: "8px",
                  background: uploading
                    ? "#999"
                    : "#198754",
                  color: "white",
                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {uploading
                  ? "Enregistrement..."
                  : "✓ Enregistrer la photo"}
              </button>

            </div>

          )}


          {/* ================================
              INFORMATIONS
          ================================ */}

          <h2>
            Dr. {profile.user?.name}
          </h2>

          <p>
            <strong>Email :</strong>{" "}
            {profile.user?.email}
          </p>

          <p>
            <strong>Téléphone :</strong>{" "}
            {profile.telephone || "Non renseigné"}
          </p>

          <p>
            <strong>Spécialité :</strong>{" "}
            {profile.specialite?.nom || "Non renseignée"}
          </p>

          <p>
            <strong>Description :</strong>{" "}
            {profile.description || "Aucune description"}
          </p>

        </div>
      )}

    </div>
  );
}

export default MedecinProfile;

