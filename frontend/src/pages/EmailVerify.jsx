// import { useRef, useState, useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import emailImg from "../assets/email-verify.webp";
// import Menubar from "../components/Menubar";
// import { AppContext } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const EmailVerify = () => {
//   const inputRef = useRef([]);
//   const [loading, setLoading] = useState(false);
//   const { getUserData, backendUrl, isLoggedIn, userData } = useContext(AppContext);
//   const navigate = useNavigate();
//   const [activeInput, setActiveInput] = useState(0);

//   const handleChange = (e, index) => {
//     const value = e.target.value.replace(/\D/, "");
//     e.target.value = value;
//     if (value && index < 5) {
//       inputRef.current[index + 1]?.focus();
//       setActiveInput(index + 1);
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value && index > 0) {
//       inputRef.current[index - 1]?.focus();
//       setActiveInput(index - 1);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const paste = e.clipboardData.getData("text").slice(0, 6).split("");
//     paste.forEach((digit, i) => {
//       if (inputRef.current[i]) {
//         inputRef.current[i].value = digit;
//       }
//     });
//     const next = paste.length < 6 ? paste.length : 5;
//     inputRef.current[next]?.focus();
//     setActiveInput(next);
//   };

//   const handleVerify = async () => {
//     const otp = inputRef.current.map((input) => input.value).join("");

//     if (otp.length < 6) {
//       toast.error("Please enter a 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${backendUrl}/verify-otp`, { otp });

//       if (response.status === 200) {
//         toast.success("OTP verified successfully!");
//         getUserData();
//         navigate("/");
//       } else {
//         toast.error("Invalid OTP, please try again.");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error verifying OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn && userData && userData.isAccountVerified) {
//       navigate("/");
//     }
//   }, [isLoggedIn, userData, navigate]);

//   return (
//     <>
//       <Menubar />
//       <div 
//         className="d-flex flex-column justify-content-center align-items-center min-vh-100"
//         style={{
//           background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//           padding: "2rem"
//         }}
//       >
//         <Link
//           to="/"
//           className="mb-4 text-decoration-none text-dark d-flex align-items-center gap-3"
//           style={{
//             transition: "all 0.2s ease"
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
//           onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
//         >
//           <img
//             src={emailImg}
//             alt="Email Verification"
//             style={{ 
//               width: "60px", 
//               height: "60px",
//               borderRadius: "12px"
//             }}
//           />
//           <h3 className="fw-bold mb-0">Core-Security</h3>
//         </Link>

//         <div
//           className="p-4 p-md-5 bg-white rounded-4 shadow-lg text-center w-100"
//           style={{ 
//             maxWidth: "500px",
//             transition: "all 0.3s ease",
//             border: "none"
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
//           onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
//         >
//           <div className="mb-4">
//             <i 
//               className="bi bi-envelope-check-fill text-primary" 
//               style={{ fontSize: "3rem" }}
//             ></i>
//           </div>
//           <h4 className="fw-semibold mb-3">Verify Your Email</h4>
//           <p className="text-muted mb-4">
//             Enter the 6-digit code sent to your email address
//           </p>
        
//           <div className="d-flex justify-content-center gap-2 mb-4">
//             {[...Array(6)].map((_, i) => (
//               <input
//                 key={i}
//                 type="text"
//                 maxLength={1}
//                 className="form-control text-center fw-bold"
//                 ref={(el) => (inputRef.current[i] = el)}
//                 onChange={(e) => handleChange(e, i)}
//                 onKeyDown={(e) => handleKeyDown(e, i)}
//                 onPaste={handlePaste}
//                 onFocus={() => setActiveInput(i)}
//                 style={{
//                   width: "50px",
//                   height: "60px",
//                   fontSize: "1.5rem",
//                   borderRadius: "8px",
//                   border: activeInput === i ? "2px solid #0d6efd" : "1px solid #ced4da",
//                   transition: "all 0.3s ease",
//                   boxShadow: activeInput === i ? "0 0 0 3px rgba(13, 110, 253, 0.25)" : "none"
//                 }}
//               />
//             ))}
//           </div>

//           <button
//             className="btn btn-primary w-100 py-2 rounded-pill"
//             disabled={loading}
//             onClick={handleVerify}
//             style={{
//               background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
//               border: "none",
//               fontSize: "1rem",
//               transition: "all 0.3s ease"
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "translateY(-2px)";
//               e.currentTarget.style.boxShadow = "0 5px 15px rgba(13, 110, 253, 0.4)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "none";
//             }}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Verifying...
//               </>
//             ) : "Verify Email"}
//           </button>

//           <div className="mt-4 text-muted">
//             <p>Didn't receive the code? <Link to="/email-verify" className="text-primary">Resend</Link></p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmailVerify;

import { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailImg from "../assets/email-verify.webp";
import Menubar from "../components/Menubar";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, backendUrl, isLoggedIn, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeInput, setActiveInput] = useState(0);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next]?.focus();
    setActiveInput(next);
  };

  const handleVerify = async () => {
    const otp = inputRef.current.map((input) => input.value).join("");

    if (otp.length < 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/verify-otp`, { otp });

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <>
      <Menubar />
      <div 
        className="d-flex flex-column justify-content-center align-items-center min-vh-100"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "2rem"
        }}
      >
        <Link
          to="/"
          className="mb-4 text-decoration-none text-dark d-flex align-items-center gap-3"
          style={{
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <img
            src={emailImg}
            alt="Email Verification"
            style={{ 
              width: "60px", 
              height: "60px",
              borderRadius: "12px"
            }}
          />
          <h3 className="fw-bold mb-0">Core-Security</h3>
        </Link>

        <div
          className="p-4 p-md-5 bg-white rounded-4 shadow-lg text-center w-100"
          style={{ 
            maxWidth: "500px",
            transition: "all 0.3s ease",
            border: "none"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div className="mb-4">
            <i 
              className="bi bi-envelope-check-fill text-primary" 
              style={{ fontSize: "3rem" }}
            ></i>
          </div>
          <h4 className="fw-semibold mb-3">Verify Your Email</h4>
          <p className="text-muted mb-4">
            Enter the 6-digit code sent to your email address
          </p>
        
          <div className="d-flex justify-content-center gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="form-control text-center fw-bold"
                ref={(el) => (inputRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={() => setActiveInput(i)}
                style={{
                  width: "50px",
                  height: "60px",
                  fontSize: "1.5rem",
                  borderRadius: "8px",
                  border: activeInput === i ? "2px solid #0d6efd" : "1px solid #ced4da",
                  transition: "all 0.3s ease",
                  boxShadow: activeInput === i ? "0 0 0 3px rgba(13, 110, 253, 0.25)" : "none"
                }}
              />
            ))}
          </div>

          <button
            className="btn btn-primary w-100 py-2 rounded-pill"
            disabled={loading}
            onClick={handleVerify}
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
              border: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(13, 110, 253, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : "Verify Email"}
          </button>

          <div className="mt-4 text-muted">
            <p>Didn't receive the code? <Link to="/email-verify" className="text-primary">Resend</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;