
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import navbarImg from '../assets/logoss.png';
import { toast } from 'react-toastify';
import axios from 'axios';

const Menubar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn, isAccountVerified } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + '/logout');
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
        toast.success("Logout successful!");
      } else {
        toast.error(error.response.data.message || "Logout failed!");
      }
    } catch (error) {
      toast.error("Logout failed!");
      console.error("Logout error:", error);
    }
  };

  const sendVerificationOtp = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(backendUrl + "/send-otp");
      if (response.status === 200) {
        toast.success("Verification OTP sent to your email!");
      } else {
        toast.error("Failed to send verification OTP.");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to send verification OTP.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 w-100">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4 w-100">
        {/* Left: Logo and Title */}
        <div className="d-flex align-items-center gap-3">
          <img
            src={navbarImg}
            alt="logo"
            className="rounded-circle shadow-sm"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <h4 className="mb-0 fw-bold text-primary">Spring Security</h4>
        </div>

        {/* Right: Auth Controls */}
        {userData ? (
          <div className="position-relative" ref={dropdownRef}>
            <div
              className="btn btn-outline-primary rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{ width: "45px", height: "45px", cursor: "pointer" }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {userData.name[0].toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-end show mt-2 shadow" style={{ minWidth: '180px' }}>
                {!userData.isAccountVerified && (
                  <button
                    className="dropdown-item text-warning"
                    onClick={async () => {
                      await sendVerificationOtp(); // Wait for toast
                      navigate('email-verify'); // Then navigate
                    }}
                  >
                    Verify Email
                  </button>
                  
                )}
                <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>

                <button
  className="dropdown-item text-warning"
  onClick={() => navigate('/reset-password')} // Correct usage of navigate with onClick
>
  Reset Password
</button>

              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-primary rounded-pill px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
            onClick={() => navigate('/login')}
          >
            Login <i className="bi bi-box-arrow-in-right"></i>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Menubar;

// import { useNavigate } from 'react-router-dom';
// import { useContext, useState, useRef, useEffect } from 'react';
// import { AppContext } from '../context/AppContext';
// import navbarImg from '../assets/logoss.png';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const Menubar = () => {
//   const navigate = useNavigate();
//   const { userData, backendUrl, setUserData, setIsLoggedIn, isAccountVerified } = useContext(AppContext);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Add scroll effect for navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const response = await axios.post(backendUrl + '/logout');
//       if (response.status === 200) {
//         setIsLoggedIn(false);
//         setUserData(false);
//         navigate("/");
//         toast.success("Logout successful!");
//       } else {
//         toast.error(error.response.data.message || "Logout failed!");
//       }
//     } catch (error) {
//       toast.error("Logout failed!");
//       console.error("Logout error:", error);
//     }
//   };

//   const sendVerificationOtp = async () => {
//     axios.defaults.withCredentials = true;
//     try {
//       const response = await axios.post(backendUrl + "/send-otp");
//       if (response.status === 200) {
//         toast.success("Verification OTP sent to your email!");
//       } else {
//         toast.error("Failed to send verification OTP.");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Failed to send verification OTP.");
//     }
//   };

//   return (
//     <nav className={`navbar navbar-expand-lg navbar-light bg-white py-3 w-100 fixed-top ${isScrolled ? 'shadow-sm' : ''}`}
//       style={{
//         transition: 'all 0.3s ease',
//         zIndex: 1000
//       }}
//     >
//       <div className="container-fluid d-flex justify-content-between align-items-center px-lg-5 px-3 mx-auto" style={{ maxWidth: '1400px' }}>
//         {/* Left: Logo and Title with hover effect */}
//         <div 
//           className="d-flex align-items-center gap-3 cursor-pointer"
//           onClick={() => navigate('/')}
//           style={{
//             transition: 'transform 0.3s ease',
//             cursor: 'pointer'
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
//           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//         >
//           <img
//             src={navbarImg}
//             alt="logo"
//             className="rounded-circle shadow-sm"
//             style={{ 
//               width: "60px", 
//               height: "60px", 
//               objectFit: "cover",
//               transition: 'transform 0.3s ease'
//             }}
//           />
//           <h4 className="mb-0 fw-bold text-primary">Spring Security</h4>
//         </div>

//         {/* Right: Auth Controls */}
//         {userData ? (
//           <div className="position-relative" ref={dropdownRef}>
//             <div
//               className="btn btn-outline-primary rounded-circle d-flex justify-content-center align-items-center fw-bold position-relative"
//               style={{ 
//                 width: "50px", 
//                 height: "50px", 
//                 cursor: "pointer",
//                 transition: 'all 0.3s ease',
//                 borderWidth: '2px'
//               }}
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.1)';
//                 e.currentTarget.style.boxShadow = '0 0 10px rgba(13, 110, 253, 0.3)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = 'none';
//               }}
//             >
//               {userData.name[0].toUpperCase()}
//               {/* Animated indicator for unverified accounts */}
//               {!userData.isAccountVerified && (
//                 <span 
//                   className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
//                   style={{
//                     animation: 'pulse 2s infinite',
//                   }}
//                 >
//                   <span className="visually-hidden">Unverified</span>
//                 </span>
//               )}
//             </div>

//             {dropdownOpen && (
//               <div 
//                 className="dropdown-menu dropdown-menu-end show mt-2 shadow"
//                 style={{ 
//                   minWidth: '200px',
//                   animation: 'fadeIn 0.3s ease-out',
//                   border: 'none'
//                 }}
//               >
//                 <div className="px-3 py-2 border-bottom">
//                   <div className="fw-bold text-truncate">{userData.name}</div>
//                   <div className="small text-muted text-truncate">{userData.email}</div>
//                 </div>
                
//                 {!userData.isAccountVerified && (
//                   <button
//                     className="dropdown-item d-flex align-items-center"
//                     onClick={async () => {
//                       await sendVerificationOtp();
//                       navigate('email-verify');
//                     }}
//                     style={{
//                       color: '#ffc107',
//                       transition: 'all 0.2s ease'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
//                       e.currentTarget.style.paddingLeft = '1.5rem';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = '';
//                       e.currentTarget.style.paddingLeft = '';
//                     }}
//                   >
//                     <i className="bi bi-shield-exclamation me-2"></i> Verify Email
//                   </button>
//                 )}
                
//                 <button 
//                   className="dropdown-item d-flex align-items-center"
//                   onClick={() => navigate('/reset-password')}
//                   style={{
//                     transition: 'all 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
//                     e.currentTarget.style.paddingLeft = '1.5rem';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = '';
//                     e.currentTarget.style.paddingLeft = '';
//                   }}
//                 >
//                   <i className="bi bi-key me-2"></i> Reset Password
//                 </button>

//                 <button 
//                   className="dropdown-item d-flex align-items-center text-danger"
//                   onClick={handleLogout}
//                   style={{
//                     transition: 'all 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
//                     e.currentTarget.style.paddingLeft = '1.5rem';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = '';
//                     e.currentTarget.style.paddingLeft = '';
//                   }}
//                 >
//                   <i className="bi bi-box-arrow-right me-2"></i> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button
//             className="btn btn-primary rounded-pill px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
//             onClick={() => navigate('/login')}
//             style={{
//               transition: 'all 0.3s ease',
//               background: 'linear-gradient(135deg, #0d6efd, #0b5ed7)',
//               border: 'none'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'translateY(-2px)';
//               e.currentTarget.style.boxShadow = '0 5px 15px rgba(13, 110, 253, 0.3)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = '';
//               e.currentTarget.style.boxShadow = '';
//             }}
//           >
//             Login <i className="bi bi-box-arrow-in-right"></i>
//           </button>
//         )}
//       </div>

//       {/* CSS animations in JSX */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(-10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes pulse {
//             0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//             50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
//             100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//           }
//           .cursor-pointer {
//             cursor: pointer;
//           }
//         `}
//       </style>
//     </nav>
//   );
// };

// export default Menubar;