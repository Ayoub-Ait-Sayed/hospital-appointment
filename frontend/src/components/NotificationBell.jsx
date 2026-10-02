// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function NotificationBell() {
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] =
//     useState(false);

//   const token = localStorage.getItem("token");

//   const headers = {
//     Authorization: `Bearer ${token}`,
//     Accept: "application/json",
//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Charger les notifications
//   |--------------------------------------------------------------------------
//   */

//   const fetchNotifications = async () => {
//     try {

//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/notifications",
//         { headers }
//       );

//       setNotifications(
//         response.data.notifications || []
//       );

//     } catch (error) {

//       console.error(
//         "Erreur notifications :",
//         error
//       );

//     }
//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Charger automatiquement
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {

//     fetchNotifications();

//     // Actualiser toutes les 5 secondes
//     const interval = setInterval(
//       fetchNotifications,
//       5000
//     );

//     return () => clearInterval(interval);

//   }, [token]);


//   /*
//   |--------------------------------------------------------------------------
//   | Cliquer sur notification
//   |--------------------------------------------------------------------------
//   */

//   const ouvrirNotification = async (
//     notification
//   ) => {

//     try {

//       // Marquer comme lue
//       await axios.put(
//         `http://127.0.0.1:8000/api/notifications/${notification.id}/read`,
//         {},
//         { headers }
//       );

//       // Actualiser la liste
//       fetchNotifications();

//     } catch (error) {

//       console.error(error);

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Redirection selon le type
//     |--------------------------------------------------------------------------
//     */

//     if (
//       notification.type ===
//       "demande_medecin"
//     ) {

//       navigate(
//         "/admin/demandes-medecins"
//       );

//     }

//     if (
//       notification.type ===
//       "nouveau_rendez_vous"
//     ) {

//       navigate(
//         "/medecin/rendez-vous"
//       );

//     }

//     if (
//       notification.type ===
//       "rendez_vous_confirme"
//     ) {

//       navigate(
//         "/patient/rendez-vous"
//       );

//     }

//     if (
//       notification.type ===
//       "rendez_vous_annule"
//     ) {

//       navigate(
//         "/patient/rendez-vous"
//       );

//     }

//     setShowNotifications(false);
//   };


//   /*
//   |--------------------------------------------------------------------------
//   | Nombre notifications non lues
//   |--------------------------------------------------------------------------
//   */

//   const unreadCount =
//     notifications.filter(
//       (notification) =>
//         !notification.read
//     ).length;


//   return (
//     <div
//       style={{
//         position: "relative",
//       }}
//     >

//       {/* Bouton cloche */}

//       <button
//         onClick={() =>
//           setShowNotifications(
//             !showNotifications
//           )
//         }
//         style={{
//           position: "relative",
//           border: "none",
//           background: "transparent",
//           fontSize: "25px",
//           cursor: "pointer",
//         }}
//       >

//         🔔

//         {/* Badge */}

//         {unreadCount > 0 && (

//           <span
//             style={{
//               position: "absolute",
//               top: "-5px",
//               right: "-8px",
//               backgroundColor: "#e53935",
//               color: "white",
//               borderRadius: "50%",
//               minWidth: "20px",
//               height: "20px",
//               fontSize: "12px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontWeight: "bold",
//             }}
//           >
//             {unreadCount}
//           </span>

//         )}

//       </button>


//       {/* Dropdown */}

//       {showNotifications && (

//         <div
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "50px",
//             width: "380px",
//             maxHeight: "450px",
//             overflowY: "auto",
//             backgroundColor: "white",
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             boxShadow:
//               "0 5px 20px rgba(0,0,0,0.15)",
//             zIndex: 1000,
//           }}
//         >

//           <div
//             style={{
//               padding: "15px 20px",
//               borderBottom:
//                 "1px solid #eee",
//             }}
//           >
//             <strong>
//               Notifications
//             </strong>
//           </div>


//           {notifications.length === 0 ? (

//             <div
//               style={{
//                 padding: "25px",
//                 textAlign: "center",
//                 color: "#777",
//               }}
//             >
//               Aucune notification.
//             </div>

//           ) : (

//             notifications.map(
//               (notification) => (

//                 <div
//                   key={notification.id}
//                   onClick={() =>
//                     ouvrirNotification(
//                       notification
//                     )
//                   }
//                   style={{
//                     padding: "15px 20px",
//                     borderBottom:
//                       "1px solid #eee",
//                     cursor: "pointer",

//                     backgroundColor:
//                       notification.read
//                         ? "white"
//                         : "#eef5ff",
//                   }}
//                 >

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "12px",
//                     }}
//                   >

//                     <div
//                       style={{
//                         fontSize: "22px",
//                       }}
//                     >
//                       🔔
//                     </div>

//                     <div>

//                       <strong>
//                         {notification.message}
//                       </strong>

//                       <p
//                         style={{
//                           margin: "5px 0 0",
//                           fontSize: "12px",
//                           color: "#777",
//                         }}
//                       >
//                         {new Date(
//                           notification.created_at
//                         ).toLocaleString(
//                           "fr-FR"
//                         )}
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//               )
//             )

//           )}

//         </div>

//       )}

//     </div>
//   );
// }

// export default NotificationBell;
