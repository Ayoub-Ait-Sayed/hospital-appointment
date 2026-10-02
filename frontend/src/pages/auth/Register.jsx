import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "../../style/Register.css";
import inscriptionImage from "../../photo/inscription-image.png";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/register", form);

      setMessage(
        response.data.message || "Inscription réussie !"
      );

      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError = Object.values(errors)[0]?.[0];

        setMessage(
          firstError || "Erreur lors de l'inscription."
        );

      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);

      } else {
        setMessage("Erreur lors de l'inscription.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* =========================
          LEFT SIDE
      ========================== */}

      <section className="register-left">

        <div className="register-welcome">

          <span className="welcome-small">
            Bienvenue chez
          </span>

          <h1>
            MediCare
            <br />
            Chefchaouen
          </h1>

          <div className="welcome-line"></div>

          <p>
            Votre santé est notre priorité.
            <br />
            Inscrivez-vous pour accéder à
            <br />
            votre espace personnel et gérer
            <br />
            vos rendez-vous en toute simplicité.
          </p>

        </div>

        <img
          src={inscriptionImage}
          alt="Illustration MediCare Chefchaouen"
          className="register-image"
        />

      </section>


      {/* =========================
          RIGHT SIDE
      ========================== */}

      <section className="register-right">

        <div className="register-card">

          {/* HEADER */}

          <div className="register-card-header">

            <div className="register-icon">
              👤
            </div>

            <h2>
              Inscription
            </h2>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* NOM */}

            <div className="form-group">

              <label htmlFor="name">
                Nom
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Entrez votre nom complet"
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Entrez votre email"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* MOT DE PASSE */}

            <div className="form-group">

              <label htmlFor="password">
                Mot de passe
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>


            {/* CONFIRMATION */}

            <div className="form-group">

              <label htmlFor="password_confirmation">
                Confirmation du mot de passe
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>


            {/* MESSAGE */}

            {message && (
              <div className="register-message">
                {message}
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Inscription..."
                  : "S'inscrire"}
              </span>

              {!loading && (
                <span className="button-arrow">
                  →
                </span>
              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="login-section">

            <div className="login-line">

              <span></span>

              <p>
                Vous avez déjà un compte ?
              </p>

              <span></span>

            </div>

            <Link
              to="/login"
              className="login-link"
            >
              Se connecter
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;