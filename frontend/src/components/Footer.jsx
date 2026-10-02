import React from "react";
import "../style/footer.css";
import gstLogo from "../photo/logo-hopetal-sans.png";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn
} from "react-icons/fa";

function Footer() {
  return (
    <>
    <footer className="footer">

      {/* Décorations */}
      <span className="footer-plus plus-1">+</span>
      <span className="footer-plus plus-2">+</span>
      <span className="footer-circle circle-1"></span>
      <span className="footer-circle circle-2"></span>

      <div className="footer-content">

        {/* ================= BRAND ================= */}
        <div className="footer-brand">

          <img
            src={gstLogo}
            alt="Groupe de Santé Territoriale"
            className="gst-logo"
          />

          <p className="brand-description">
            Nous nous engageons à offrir des soins
            de qualité accessibles à tous, avec
            humanité et professionnalisme.
          </p>

          <div className="social-links">

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>

              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
          

          </div>

        </div>


        {/* ================= LIENS UTILES ================= */}
        <div className="footer-column">

          <h3>Liens utiles</h3>

          <div className="footer-title-line"></div>

          <a href="/">
            <span>›</span>
            Accueil
          </a>

          <a href="/about">
            <span>›</span>
            À propos
          </a>

          <a href="/medecins">
            <span>›</span>
            Nos médecins
          </a>

          <a href="/specialites">
            <span>›</span>
            Spécialités
          </a>

          <a href="/services">
            <span>›</span>
            Services
          </a>

          <a href="/actualites">
            <span>›</span>
            Actualités
          </a>

          <a href="/contact">
            <span>›</span>
            Contact
          </a>

        </div>


        {/* ================= ESPACE PATIENT ================= */}
        <div className="footer-column">

          <h3>Espace patient</h3>

          <div className="footer-title-line"></div>

          <a href="/login">
            <span>›</span>
            Se connecter
          </a>

          <a href="/rendez-vous">
            <span>›</span>
            Prendre rendez-vous
          </a>

          <a href="/mes-rendez-vous">
            <span>›</span>
            Mes rendez-vous
          </a>

          <a href="/ordonnances">
            <span>›</span>
            Mes ordonnances
          </a>

          <a href="/analyses">
            <span>›</span>
            Résultats d’analyses
          </a>

          <a href="/dossier-medical">
            <span>›</span>
            Dossier médical
          </a>

        </div>


        {/* ================= CONTACT ================= */}
        <div className="footer-column contact-column">

          <h3>Nous contacter</h3>

          <div className="footer-title-line"></div>


          {/* Adresse */}
          <div className="contact-item">

            <div className="contact-icon">
              📍
            </div>

            <div>
              <strong>Hôpital Mohammed V</strong>

              <p>
                Avenue Sidi Abdelhamid
                <br />
                Chefchaouen, Maroc
              </p>
            </div>

          </div>


          {/* Téléphone */}
          <div className="contact-item">

            <div className="contact-icon">
              ☎
            </div>

            <div>
              <strong>+212 539 98 98 98</strong>
            </div>

          </div>


          {/* Email */}
          <div className="contact-item">

            <div className="contact-icon">
              ✉
            </div>

            <div>
              <strong>contact@gsttth.ma</strong>
            </div>

          </div>


          {/* Horaires */}
          <div className="contact-item">

            <div className="contact-icon">
              ◷
            </div>

            <div>
              <strong>Lun - Ven : 08:00 - 17:00</strong>

              <p>
                Samedi : 08:00 - 13:00
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}
      

    </footer>
    <div className="footer-bottom">

        <div className="copyright">

          <strong>
            ayyoub ait sayed <span class="copyr">&copy;</span> 2026 hôpital de Chefchaouen.
          </strong>

        </div>


        <div className="legal-links">

          <a href="/confidentialite">
            Confidentialité
          </a>

          <span>|</span>

          <a href="/conditions">
            Conditions d'utilisation
          </a>

          <span>|</span>

          <a href="/aide">
            Aide
          </a>

        </div>


        {/* ECG */}
        <div className="ecg">

          <svg
            viewBox="0 0 300 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="
                0,45
                70,45
                110,45
                115,55
                130,15
                145,65
                158,30
                170,45
                300,45
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>

        </div>

      </div>
      </>
  );
}

export default Footer;