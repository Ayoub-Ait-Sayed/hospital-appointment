import "../../style/Contact.css";

function Contact() {
  return (
    <main className="contact-shell">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero__background">
          <span className="contact-hero__orb contact-hero__orb--one"></span>
          <span className="contact-hero__orb contact-hero__orb--two"></span>
        </div>

        <div className="contact-hero__inner">
          <div className="contact-hero__eyebrow">
            <span className="contact-hero__line"></span>
            <span>NOUS CONTACTER</span>
          </div>

          <h1 className="contact-hero__title">
            Parlons de votre
            <span> santé.</span>
          </h1>

          <p className="contact-hero__description">
            Une question, une demande d'information ou besoin
            d'accompagnement ? Notre équipe est là pour vous répondre.
          </p>

          <div className="contact-hero__badge">
            <span className="contact-hero__status-dot"></span>
            Notre équipe est à votre écoute
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="contact-layout">

        {/* INFORMATION PANEL */}
        <aside className="contact-panel">

          <div className="contact-panel__heading">
            <span className="contact-panel__mini-label">
              INFORMATIONS
            </span>

            <h2>
              Restons
              <br />
              <strong>en contact.</strong>
            </h2>

            <p>
              Retrouvez ici toutes les informations nécessaires
              pour nous joindre rapidement.
            </p>
          </div>

          <div className="contact-details">

            <article className="contact-detail">
              <div className="contact-detail__icon">
                <span>⌖</span>
              </div>

              <div className="contact-detail__content">
                <span className="contact-detail__label">
                  Notre adresse
                </span>

                <h3>Hôpital de Chefchaouen</h3>

                <p>
                  Chefchaouen, Maroc
                </p>
              </div>
            </article>

            <article className="contact-detail">
              <div className="contact-detail__icon">
                <span>◉</span>
              </div>

              <div className="contact-detail__content">
                <span className="contact-detail__label">
                  Téléphone
                </span>

                <h3>05 39 98 30 30</h3>

                <p>
                  Disponible pour vos demandes
                </p>
              </div>
            </article>

            <article className="contact-detail">
              <div className="contact-detail__icon">
                <span>✉</span>
              </div>

              <div className="contact-detail__content">
                <span className="contact-detail__label">
                  Adresse email
                </span>

                <h3>contact@hopitalchefchaouen.ma</h3>

                <p>
                  Nous vous répondons dans les meilleurs délais
                </p>
              </div>
            </article>

          </div>

          {/* HOURS */}
          <div className="contact-hours">

            <div className="contact-hours__top">
              <span className="contact-hours__icon">◷</span>

              <div>
                <span className="contact-hours__label">
                  HORAIRES D'ACCUEIL
                </span>

                <h3>Quand nous trouver</h3>
              </div>
            </div>

            <div className="contact-hours__rows">
              <div className="contact-hours__row">
                <span>Lundi — Vendredi</span>
                <strong>08:00 — 17:00</strong>
              </div>

              <div className="contact-hours__row contact-hours__row--emergency">
                <span>Urgences</span>
                <strong>24h / 24 · 7j / 7</strong>
              </div>
            </div>

          </div>

        </aside>

        {/* FORM PANEL */}
        <section className="contact-form">

          <div className="contact-form__header">
            <div>
              <span className="contact-form__eyebrow">
                FORMULAIRE DE CONTACT
              </span>

              <h2>
                Envoyez-nous
                <br />
                <span>un message.</span>
              </h2>
            </div>

            <div className="contact-form__number">
              01
            </div>
          </div>

          <form className="contact-form__body">

            <div className="contact-form__grid">

              <div className="field">
                <label htmlFor="fullname">
                  Nom complet
                </label>

                <div className="field__wrapper">
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Votre nom complet"
                  />

                  <span className="field__symbol">
                    ◯
                  </span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">
                  Adresse email
                </label>

                <div className="field__wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                  />

                  <span className="field__symbol">
                    @
                  </span>
                </div>
              </div>

            </div>

            <div className="field">
              <label htmlFor="subject">
                Sujet de votre demande
              </label>

              <div className="field__wrapper">
                <input
                  id="subject"
                  type="text"
                  placeholder="Comment pouvons-nous vous aider ?"
                />

                <span className="field__symbol">
                  #
                </span>
              </div>
            </div>

            <div className="field">
              <div className="field__label-row">
                <label htmlFor="message">
                  Votre message
                </label>

                <span>
                  Facultatif
                </span>
              </div>

              <div className="field__wrapper field__wrapper--textarea">
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Écrivez votre message ici..."
                ></textarea>
              </div>
            </div>

            <div className="contact-form__footer">

              <div className="contact-form__privacy">
                <span className="contact-form__privacy-icon">
                  ✓
                </span>

                <p>
                  Vos informations restent confidentielles
                  et ne seront utilisées que pour répondre
                  à votre demande.
                </p>
              </div>

              <button
                type="submit"
                className="contact-form__submit"
              >
                <span>Envoyer le message</span>
                <span className="contact-form__arrow">
                  →
                </span>
              </button>

            </div>

          </form>

        </section>

      </section>

      {/* BOTTOM STRIP */}
      <section className="contact-bottom">
        <div className="contact-bottom__inner">

          <div>
            <span className="contact-bottom__label">
              BESOIN D'UNE ASSISTANCE URGENTE ?
            </span>

            <h2>
              Les urgences sont ouvertes
              <span> 24h/24.</span>
            </h2>
          </div>

          <div className="contact-bottom__badge">
            <span></span>
            Service d'urgence
          </div>

        </div>
      </section>

    </main>
  );
}

export default Contact;
