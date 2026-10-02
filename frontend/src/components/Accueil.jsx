import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../style/Accueil.css";

import backgroundImage from "../photo/backrand.png";
import MeDsara from "../photo/medcine-sara.png";
import MeDfatima from "../photo/medcinde-fatima.jpg";
import MeDahmed from "../photo/medcineahmedjpg.jpg";
import MeDYoussef from "../photo/medcine-youssef.jpg";
import AboutImage from "../photo/about-hospital.png";
import rendezVous from "../photo/rendez-vous.png";

function Accueil() {
  const location = useLocation();

  const specialites = [
    {
      icon: "♡",
      name: "Cardiologie",
    },
    {
      icon: "✎",
      name: "Chirurgie",
      second: "générale",
    },
    {
      icon: "♀",
      name: "Gynécologie",
      second: "Obstétrique",
    },
    {
      icon: "♙",
      name: "Pédiatrie",
    },
    {
      icon: "🦴",
      name: "Orthopédie &",
      second: "Traumatologie",
    },
    {
      icon: "♧",
      name: "Urologie",
    },
  ];

  useEffect(() => {
    if (location.hash === "#specialites") {
      setTimeout(() => {
        const section = document.getElementById("specialites");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="clinic-home" id="Accueil">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="welcome-banner"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="welcome-layer">
          <div className="welcome-content">

            <h1>
              Votre santé,
              <br />
              <span>notre engagement</span>
            </h1>

            <p>
              Des soins de qualité, une équipe à votre écoute
              et des services médicaux adaptés à vos besoins.
            </p>

            <div className="welcome-actions">

              <Link
                to="/login"
                className="primary-action"
              >
                📅 Prendre rendez-vous
              </Link>

              <a
                href="#services"
                className="secondary-action"
              >
                🩺 Nos services
              </a>

            </div>

            <div className="clinic-stats">

              <div className="clinic-stat">
                <span>👨‍⚕️</span>

                <div>
                  <strong>150+</strong>
                  <small>Médecins</small>
                </div>
              </div>

              <div className="clinic-stat">
                <span>❤️</span>

                <div>
                  <strong>20+</strong>
                  <small>Spécialités</small>
                </div>
              </div>

              <div className="clinic-stat">
                <span>😊</span>

                <div>
                  <strong>15K+</strong>
                  <small>Patients</small>
                </div>
              </div>

              <div className="clinic-stat">

                <span
                  style={{
                    filter:
                      "sepia(2) saturate(10) hue-rotate(185deg) brightness(0.8)",
                  }}
                >
                  🏥
                </span>

                <div>
                  <strong>1</strong>
                  <small>Hôpital</small>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="care-services" id="services">

        <div className="care-heading">
          <h2>Nos services</h2>
          <div className="care-divider"></div>
        </div>

        <div className="care-grid">

          <div className="care-box">
            <div className="care-symbol">🩺</div>

            <h3>Consultations médicales</h3>

            <p>
              Des consultations assurées par des médecins
              spécialisés et expérimentés.
            </p>

            <span className="care-arrow">→</span>
          </div>

          <div className="care-box">
            <div className="care-symbol">🚑</div>

            <h3>Urgences</h3>

            <p>
              Un service d'urgence disponible 24h/24
              pour répondre rapidement à vos besoins.
            </p>

            <span className="care-arrow">→</span>
          </div>

          <div className="care-box">
            <div className="care-symbol">⚗️</div>

            <h3>Analyses médicales</h3>

            <p>
              Des analyses fiables réalisées avec des équipements
              modernes et performants.
            </p>

            <span className="care-arrow">→</span>
          </div>

          <div className="care-box">
            <div className="care-symbol">💊</div>

            <h3>Pharmacie</h3>

            <p>
              Une pharmacie hospitalière avec un large choix
              de médicaments.
            </p>

            <span className="care-arrow">→</span>
          </div>

          <div className="care-box">
            <div className="care-symbol">❤️</div>

            <h3>Imagerie médicale</h3>

            <p>
              Des équipements modernes pour des diagnostics
              rapides et précis.
            </p>

            <span className="care-arrow">→</span>
          </div>

          <div className="care-box">
            <div className="care-symbol">👶</div>

            <h3>Maternité & Pédiatrie</h3>

            <p>
              Des soins spécialisés pour les femmes,
              les enfants et les nouveau-nés.
            </p>

            <span className="care-arrow">→</span>
          </div>

        </div>
      </section>


      {/* =====================================================
          SPECIALITES
      ===================================================== */}

      <section
        className="medical-specialties"
        id="specialites"
      >

        <h2>Nos spécialités</h2>

        <div className="specialty-divider"></div>

        <div className="specialty-grid">

          {specialites.map((specialite, index) => (
            <div
              className="specialty-box"
              key={index}
            >

              <div className="specialty-symbol">
                {specialite.icon}
              </div>

              <div className="specialty-label">

                <span>
                  {specialite.name}
                </span>

                {specialite.second && (
                  <span>
                    {specialite.second}
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>

        <Link
          to="/Tousspecialites"
          className="specialty-more"
        >
          Voir toutes les spécialités
        </Link>

      </section>


      {/* =====================================================
          MEDECINS
      ===================================================== */}

      <section
        className="doctors-area"
        id="medecins"
      >

        <div className="doctors-heading">

          <div>
            <h2>Nos médecins à votre service</h2>
            <div className="doctors-divider"></div>
          </div>

          <Link
            to="/tousmedcine"
            className="doctors-more"
          >
            Voir tous les médecins →
          </Link>

        </div>


        <div className="doctors-grid">

          <div className="doctor-box">

            <div className="doctor-photo">
              <img
                src={MeDahmed}
                alt="Dr. Ahmed El Mansouri"
              />
            </div>

            <div className="doctor-details">

              <h3>
                Dr. Ahmed El Mansouri
              </h3>

              <p className="doctor-field">
                Cardiologue
              </p>

              <p className="doctor-years">
                12 ans d'expérience
              </p>

              <Link
                to="/patient/medecin/1"
                className="doctor-profile"
              >
                Voir le profil
                <span>→</span>
              </Link>

            </div>
          </div>


          <div className="doctor-box">

            <div className="doctor-photo">
              <img
                src={MeDfatima}
                alt="Dr. Fatima Zahra El Alami"
              />
            </div>

            <div className="doctor-details">

              <h3>
                Dr. Fatima Zahra El Alami
              </h3>

              <p className="doctor-field">
                Pédiatre
              </p>

              <p className="doctor-years">
                8 ans d'expérience
              </p>

              <Link
                to="/patient/medecin/2"
                className="doctor-profile"
              >
                Voir le profil
                <span>→</span>
              </Link>

            </div>
          </div>


          <div className="doctor-box">

            <div className="doctor-photo">
              <img
                src={MeDYoussef}
                alt="Dr. Youssef Benkirane"
              />
            </div>

            <div className="doctor-details">

              <h3>
                Dr. Youssef Benkirane
              </h3>

              <p className="doctor-field">
                Chirurgien
              </p>

              <p className="doctor-years">
                15 ans d'expérience
              </p>

              <Link
                to="/patient/medecin/3"
                className="doctor-profile"
              >
                Voir le profil
                <span>→</span>
              </Link>

            </div>
          </div>


          <div className="doctor-box">

            <div className="doctor-photo">
              <img
                src={MeDsara}
                alt="Dr. Sara Ait Ouhmane"
              />
            </div>

            <div className="doctor-details">

              <h3>
                Dr. Sara Ait Ouhmane
              </h3>

              <p className="doctor-field">
                Gynécologue
              </p>

              <p className="doctor-years">
                10 ans d'expérience
              </p>

              <Link
                to="/patient/medecin/4"
                className="doctor-profile"
              >
                Voir le profil
                <span>→</span>
              </Link>

            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          A PROPOS
      ===================================================== */}

      <section
        className="hospital-intro"
        id="apropos"
      >

        <div className="hospital-intro-box">

          <div className="hospital-picture">
            <img
              src={AboutImage}
              alt="Hôpital Mohammed VI Chefchaouen"
            />
          </div>


          <div className="hospital-copy">

            <h2>
              À propos de notre hôpital
            </h2>

            <div className="hospital-rule"></div>

            <p>
              L’Hôpital Mohammed V de Chefchaouen est un
              établissement de santé dédié à offrir des soins
              médicaux de qualité à la population de la région.
              Notre équipe médicale et paramédicale travaille
              chaque jour pour assurer une prise en charge
              humaine, moderne et adaptée aux besoins de chaque
              patient.
            </p>


            <div className="hospital-features">

              <div>
                <span>🖥️</span>
                <p>Équipements modernes</p>
              </div>

              <div>
                <span>👥</span>
                <p>Équipe médicale qualifiée</p>
              </div>

              <div>
                <span>❤️</span>
                <p>Soins personnalisés</p>
              </div>

              <div>
                <span>👂</span>
                <p>Écoute et proximité</p>
              </div>

            </div>


            <Link
              to="/a-propos"
              className="hospital-button"
            >
              En savoir plus →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          RENDEZ-VOUS
      ===================================================== */}

      <section className="booking-banner">

        <div className="booking-box">

          <div className="booking-picture">
            <img
              src={rendezVous}
              alt="Prendre rendez-vous"
            />
          </div>

          <div className="booking-copy">

            <h2>
              Besoin de consulter un médecin ?
            </h2>

            <p>
              Prenez rendez-vous en ligne rapidement et facilement.
            </p>

            <Link
              to="/login"
              className="booking-button"
            >
              <span>▣</span>
              Prendre rendez-vous
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          TEMOIGNAGES + ACTUALITES
      ===================================================== */}

      <section className="reviews-news">

        <div className="reviews-area">

          <div className="reviews-heading">
            <h2>
              Ce que pensent nos patients
            </h2>

            <div className="reviews-rule"></div>
          </div>


          <div className="reviews-grid">

            <div className="patient-review">

              <div className="review-stars">
                ★★★★★
              </div>

              <p>
                "Excellent accueil et prise en charge rapide.
                Le personnel est très à l'écoute."
              </p>

              <div className="review-person">

                <div className="review-avatar">
                  Y
                </div>

                <div>
                  <strong>Yassine B.</strong>
                  <small>Patient</small>
                </div>

              </div>

            </div>


            <div className="patient-review">

              <div className="review-stars">
                ★★★★★
              </div>

              <p>
                "Des médecins compétents et un service
                d'une grande qualité."
              </p>

              <div className="review-person">

                <div className="review-avatar">
                  A
                </div>

                <div>
                  <strong>Amina L.</strong>
                  <small>Patiente</small>
                </div>

              </div>

            </div>


            <div className="patient-review">

              <div className="review-stars">
                ★★★★★
              </div>

              <p>
                "Je recommande vivement cet hôpital.
                Merci pour votre professionnalisme."
              </p>

              <div className="review-person">

                <div className="review-avatar">
                  M
                </div>

                <div>
                  <strong>Mohamed R.</strong>
                  <small>Patient</small>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            ACTUALITES
        ===================================================== */}

        <div className="hospital-news">

          <div className="news-heading">

            <div>
              <h2>
                Actualités & Conseils
              </h2>

              <div className="news-rule"></div>
            </div>

            <Link to="/actualites">
              Voir toutes les actualités →
            </Link>

          </div>


          <div className="news-items">

            <div className="news-card">

              <div className="news-picture">
                <img
                  src="/images/rendez-vous.png"
                  alt="Rendez-vous"
                />
              </div>

              <div className="news-copy">

                <small>
                  12 Mai 2024
                </small>

                <h3>
                  Journée de dépistage gratuit du diabète
                </h3>

                <p>
                  Une journée dédiée à la sensibilisation
                  et au dépistage du diabète.
                </p>

              </div>

            </div>


            <div className="news-card">

              <div className="news-picture">
                <img
                  src="/images/rendez-vous.png"
                  alt="Rendez-vous"
                />
              </div>

              <div className="news-copy">

                <small>
                  06 Mai 2024
                </small>

                <h3>
                  Nouveaux équipements au service de l'imagerie
                </h3>

                <p>
                  L'hôpital se dote de nouveaux équipements
                  modernes pour des diagnostics plus précis.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        className="contact-area"
        id="contact"
      >

        <div className="contact-heading">

          <h2>
            Nous sommes à votre écoute
          </h2>

          <div className="contact-rule"></div>

        </div>


        <div className="contact-box">

          <div className="contact-details">

            <div className="contact-row">

              <div className="contact-symbol">
                📍
              </div>

              <div>
                <strong>Adresse</strong>

                <p>
                  Avenue Jamaleddine Al Afghani,
                  Chefchaouen, Maroc
                </p>
              </div>

            </div>


            <div className="contact-row">

              <div className="contact-symbol">
                📞
              </div>

              <div>
                <strong>Téléphone</strong>

                <p>
                  +212 539 98 62 44
                </p>
              </div>

            </div>


            <div className="contact-row">

              <div className="contact-symbol">
                ✉️
              </div>

              <div>
                <strong>Email</strong>

                <p>
                  contact@hopital.ma
                </p>
              </div>

            </div>


            <div className="contact-row">

              <div className="contact-symbol">
                🕐
              </div>

              <div>
                <strong>Horaires</strong>

                <p>
                  Lun - Ven : 08:00 - 17:00
                  <br />
                  Samedi : 08:00 - 13:00
                </p>
              </div>

            </div>

          </div>


          <div className="location-frame">

            <iframe
              title="Hôpital Mohammed V Chefchaouen"
              src="https://www.google.com/maps?q=Hôpital%20Mohammed%20V%20Chefchaouen%20Maroc&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Accueil;
