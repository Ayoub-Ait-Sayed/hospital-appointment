import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "patient":
          navigate("/patient/dashboard");
          break;

        case "medecin":
          navigate("/medecin/dashboard");
          break;

        case "responsable":
          navigate("/responsable/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        default:
          setError("Rôle utilisateur غير معروف.");
      }
    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 422 ||
        error.response?.status === 401
      ) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError(
          error.response?.data?.message ||
            "Une erreur est survenue. Vérifiez que le serveur Laravel fonctionne."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <main className="login-content">

        {/* ================= LEFT ================= */}
        <section className="login-left">

          <div className="welcome-text">

            <h3>Bienvenue chez</h3>

            <h1>
              MediCare
              <br />
              Chefchaouen
            </h1>

            <div className="blue-line"></div>

            <p>
              Votre santé est notre priorité.
              <br />
              Connectez-vous pour accéder à votre
              <br />
              espace personnel et gérer vos rendez-vous
              <br />
              en toute simplicité.
            </p>

          </div>

          {/* FEATURES */}
          <div className="features">

            <div className="feature">
              <div className="feature-icon">▣</div>

              <div>
                <strong>Rendez-vous</strong>
                <small>en ligne</small>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Données</strong>
                <small>sécurisées</small>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">♙</div>

              <div>
                <strong>Suivi médical</strong>
                <small>personnalisé</small>
              </div>
            </div>

          </div>

          {/* IMAGE */}
          <div className="hospital-image">
            <img
              src="/src/photo/connexion-image.png"
              alt="Hôpital MediCare"
            />
          </div>

        </section>

        {/* ================= RIGHT ================= */}
        <section className="login-right">

          <div className="login-card">

            <div className="login-icon">
              <span>🔐</span>
            </div>

            <h1>Connexion</h1>

            <p className="login-subtitle">
              Connectez-vous à votre compte
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="form-group">

                <label>Email</label>

                <div className="input-wrapper">

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Entrez votre email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="form-group">

                <label>Mot de passe</label>

                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>

              <div className="forgot-password">
                Mot de passe oublié ?
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                <span>♙</span>

                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </button>

            </form>

            <div className="separator">
              <span></span>
              <strong>ou</strong>
              <span></span>
            </div>

            <div className="register">

              <p>
                Vous n'avez pas de compte ?
              </p>

              <button
                onClick={() => navigate("/register")}
                className="register-link"
              >
                Inscription
                <span>→</span>
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;