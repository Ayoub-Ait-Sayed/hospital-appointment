import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = user?.role?.toLowerCase();

  // =========================================================
  // NOTIFICATIONS LUES
  // =========================================================

  const getReadNotifications = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  };

  // =========================================================
  // MARQUER NOTIFICATION COMME LUE
  // =========================================================

  const markNotificationAsRead = (notificationId) => {
    const readNotifications = getReadNotifications();

    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId);

      localStorage.setItem(
        "readNotifications",
        JSON.stringify(readNotifications)
      );
    }

    setNotifications((prev) =>
      prev.filter(
        (notification) => notification.id !== notificationId
      )
    );

    setShowNotifications(false);
  };

  // =========================================================
  // CHARGER NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    if (!token || !user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const readNotifications = getReadNotifications();

        // =====================================================
        // ADMIN
        // =====================================================

        if (role === "admin") {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/admin/demandes-medecins",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );

          const demandes = response.data.medecins || [];

          const adminNotifications = demandes
            .map((medecin) => ({
              id: `doctor-${medecin.id}`,
              type: "admin",

              title: "Nouvelle demande de médecin",

              message: medecin.user?.name
                ? `Dr. ${medecin.user.name} a envoyé une demande`
                : "Nouvelle demande de médecin",

              specialite:
                medecin.specialite?.nom ||
                "Spécialité non définie",
            }))
            .filter(
              (notification) =>
                !readNotifications.includes(notification.id)
            );

          setNotifications(adminNotifications);
        }

        // =====================================================
        // MEDECIN
        // =====================================================

        else if (
          role === "medecin" ||
          role === "doctor"
        ) {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/medecin/rendez-vous",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );

          const rendezVous =
            response.data.rendez_vous ||
            response.data.rendezVous ||
            response.data.data ||
            response.data ||
            [];

          if (Array.isArray(rendezVous)) {
            const doctorNotifications = rendezVous
              .map((rdv) => ({
                id: `rdv-${rdv.id}`,
                type: "medecin",

                title: "Nouveau rendez-vous",

                message:
                  "Vous avez un nouveau rendez-vous.",

                date: rdv.date,
                heure: rdv.heure,
              }))
              .filter(
                (notification) =>
                  !readNotifications.includes(notification.id)
              );

            setNotifications(doctorNotifications);
          } else {
            setNotifications([]);
          }
        }

        // =====================================================
        // RESPONSABLE
        // =====================================================

        else if (role === "responsable") {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/specialites",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );

          const specialites =
            response.data.specialites ||
            response.data.data ||
            response.data ||
            [];

          if (Array.isArray(specialites)) {
            const responsableNotifications = specialites
              .map((specialite) => ({
                id: `specialite-${specialite.id}`,

                type: "responsable",

                title: "Nouvelle spécialité",

                message: `La spécialité "${
                  specialite.nom ||
                  "Nouvelle spécialité"
                }" a été ajoutée.`,
              }))
              .filter(
                (notification) =>
                  !readNotifications.includes(notification.id)
              );

            setNotifications(responsableNotifications);
          } else {
            setNotifications([]);
          }
        }

        // =====================================================
        // PATIENT
        // =====================================================

        else if (role === "patient") {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/patient/rendez-vous",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );

          const rendezVous =
            response.data.rendez_vous ||
            response.data.rendezVous ||
            response.data.data ||
            response.data ||
            [];

          if (Array.isArray(rendezVous)) {
            const patientNotifications = rendezVous
              .filter((rdv) => {
                const statut = String(
                  rdv.statut ||
                    rdv.status ||
                    ""
                ).toLowerCase();

                return (
                  statut === "accepte" ||
                  statut === "accepté" ||
                  statut === "accepted" ||
                  statut === "refuse" ||
                  statut === "refusé" ||
                  statut === "rejected"
                );
              })
              .map((rdv) => {
                const statut = String(
                  rdv.statut ||
                    rdv.status ||
                    ""
                ).toLowerCase();

                const accepte =
                  statut === "accepte" ||
                  statut === "accepté" ||
                  statut === "accepted";

                return {
                  id: `patient-rdv-${rdv.id}`,

                  type: "patient",

                  title: accepte
                    ? "Rendez-vous accepté"
                    : "Rendez-vous refusé",

                  message: accepte
                    ? "Le médecin a accepté votre rendez-vous."
                    : "Le médecin a refusé votre rendez-vous.",

                  date: rdv.date,
                  heure: rdv.heure,

                  accepte,
                };
              })
              .filter(
                (notification) =>
                  !readNotifications.includes(notification.id)
              );

            setNotifications(patientNotifications);
          } else {
            setNotifications([]);
          }
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error(
          "Erreur notifications:",
          error
        );

        setNotifications([]);
      }
    };

    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [token, role]);

  // =========================================================
  // CLICK NOTIFICATION
  // =========================================================

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);

    if (role === "admin") {
      navigate("/admin/demandes-medecins");
    }

    else if (
      role === "medecin" ||
      role === "doctor"
    ) {
      navigate("/medecin/rendez-vous");
    }

    else if (role === "responsable") {
      navigate("/responsable/medecins");
    }

    else if (role === "patient") {
      navigate("/patient/rendez-vous");
    }
  };

  // =========================================================
  // ICON NOTIFICATION
  // =========================================================

  const getNotificationIcon = (notification) => {
    if (notification.type === "admin") {
      return "👨‍⚕️";
    }

    if (notification.type === "medecin") {
      return "📅";
    }

    if (notification.type === "responsable") {
      return "🩺";
    }

    if (notification.type === "patient") {
      return notification.accepte
        ? "✅"
        : "❌";
    }

    return "🔔";
  };

  // =========================================================
  // RETOUR ACCUEIL / PREMIER DE LA PAGE
  // =========================================================

  const goHome = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  // =========================================================
  // NAVIGATION VERS SECTION
  // =========================================================

  const goToSection = (sectionId) => {
    if (location.pathname === "/") {
      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================================
  // NAVBAR
  // =========================================================

  return (
    <nav
      style={{
        width: "100%",
        height: "72px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #edf0f5",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "0 52px",

        boxSizing: "border-box",

        position: "sticky",
        top: 0,

        zIndex: 1000,

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* =====================================================
          LOGO
      ===================================================== */}

      <Link
        to="/"
        onClick={goHome}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "210px",
        }}
      >

        <div
          style={{
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <span
            style={{
              fontSize: "32px",
              filter:
                "sepia(2) saturate(10) hue-rotate(185deg) brightness(0.8)",
            }}
          >
            🏥
          </span>

        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "1",
          }}
        >

          <span
            style={{
              color: "#17325c",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "-0.3px",
            }}
          >
            MediCare Chefchaouen
          </span>

          <span
            style={{
              color: "#718096",
              fontSize: "9px",
              marginTop: "4px",
              fontWeight: "400",
            }}
          >
            Hôpital Mohammed V
          </span>

        </div>

      </Link>


      {/* =====================================================
          MENU
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: "28px",
        }}
      >

        {/* ACCUEIL */}

        <Link
          to="/"
          onClick={goHome}
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color:
              location.pathname === "/"
                ? "#2563eb"
                : "#40506b",
            fontSize: "14px",
            fontWeight:
              location.pathname === "/"
                ? "600"
                : "500",

            position: "relative",
          }}
        >
          Accueil

          {location.pathname === "/" && (
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                backgroundColor: "#2563eb",
                borderRadius:
                  "2px 2px 0 0",
              }}
            />
          )}

        </Link>


        {/* A PROPOS */}

        <button
          onClick ={()=>
            goToSection("apropos")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: "#40506b",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily:
              "Arial, Helvetica, sans-serif"
          }}
        >
          À propos
        </button>


        {/* NOS MEDECINS */}

        <button
          onClick={() =>
            goToSection("medecins")
          }
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: "#40506b",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily:
              "Arial, Helvetica, sans-serif",
          }}
        >
          Nos médecins
        </button>


        {/* SPECIALITES */}

        <button
          onClick={() =>
            goToSection("specialites")
          }
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: "#40506b",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily:
              "Arial, Helvetica, sans-serif",
          }}
        >
          Spécialités
        </button>


        {/* SERVICES */}

        <button
          onClick={() =>
            goToSection("services")
          }
          style={{
             border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: "#40506b",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily:
              "Arial, Helvetica, sans-serif",
          }}
        >
          Services
        </button>


        {/* CONTACT */}

        <Link
          to="/contact"
          style={{
            textDecoration: "none",
            color:
              location.pathname === "/contact"
                ? "#2563eb"
                : "#40506b",
            fontSize: "14px",
            fontWeight:
              location.pathname === "/contact"
                ? "600"
                : "500",
          }}
        >
          Contact
        </Link>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          minWidth: "210px",
          justifyContent: "flex-end",
        }}
      >

        {/* NOTIFICATIONS */}

        {user && (
          <div
            style={{
              position: "relative",
            }}
          >

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              style={{
                position: "relative",
                border: "none",
                backgroundColor:
                  "transparent",
                fontSize: "21px",
                cursor: "pointer",
                padding: "6px",
                color: "#40506b",
              }}
              title="Notifications"
            >
              🔔

              {notifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-1px",
                    right: "-2px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: "17px",
                    height: "17px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    border: "2px solid white",
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </button>


            {/* DROPDOWN */}

            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "48px",
                  width: "360px",
                  maxHeight: "420px",
                  overflowY: "auto",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.12)",
                  zIndex: 2000,
                }}
              >

                <div
                  style={{
                    padding: "16px 18px",
                    borderBottom:
                      "1px solid #edf0f5",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >

                  <strong
                    style={{
                      color: "#17325c",
                      fontSize: "15px",
                    }}
                  >
                    Notifications
                  </strong>

                  {notifications.length > 0 && (
                    <span
                      style={{
                        color: "#2563eb",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {notifications.length} nouvelle
                      {notifications.length > 1
                        ? "s"
                        : ""}
                    </span>
                  )}

                </div>


                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "35px 20px",
                      textAlign: "center",
                      color: "#718096",
                      fontSize: "13px",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "10px",
                      }}
                    >
                      🔔
                    </div>

                    Aucune notification

                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        style={{
                          padding: "14px 18px",
                          borderBottom:
                            "1px solid #f0f2f5",
                          cursor: "pointer",
                          transition:
                            "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "#f8faff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "white";
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >

                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor:
                                "#eff6ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "center",
                              fontSize: "19px",
                              flexShrink: 0,
                            }}
                          >
                            {getNotificationIcon(
                              notification
                            )}
                          </div>

                          <div
                            style={{
                              flex: 1,
                            }}
                          >

                            <strong
                              style={{
                                color: "#17325c",
                                fontSize: "13px",
                              }}
                            >
                              {
                                notification.title
                              }
                            </strong>

                            <p
                              style={{
                                margin: "5px 0 0",
                                fontSize: "12px",
                                color: "#718096",
                                lineHeight: "1.4",
                              }}
                            >
                              {
                                notification.message
                              }
                            </p>

                            {notification.specialite && (
                              <p
                                style={{
                                  margin:
                                    "4px 0 0",
                                  fontSize: "11px",
                                  color: "#2563eb",
                                }}
                              >
                                🩺{" "}
                                {
                                  notification.specialite
                                }
                              </p>
                            )}

                            {notification.date && (
                              <p
                                style={{
                                  margin:
                                    "4px 0 0",
                                  fontSize: "11px",
                                  color: "#2563eb",
                                }}
                              >
                                📅{" "}
                                {
                                  notification.date
                                }

                                {notification.heure &&
                                  ` - ${notification.heure}`}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>
            )}

          </div>
        )}


        {/* USER */}

        {user ? (
          <span
            style={{
              color: "#40506b",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            👤 {user?.name || ""}
          </span>
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              backgroundColor: "#0d5be1",
              color: "white",
              padding: "10px 21px",
              borderRadius: "7px",
              fontSize: "12px",
              fontWeight: "600",
              boxShadow:
                "0 3px 8px rgba(13,91,225,0.18)",
            }}
          >
            Se connecter
          </Link>
        )}


        {/* LOGOUT */}

        {user && (
          <button
            onClick={logout}
            style={{
              border: "none",
              backgroundColor: "#0d5be1",
              color: "white",
              padding: "10px 17px",
              borderRadius: "7px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
