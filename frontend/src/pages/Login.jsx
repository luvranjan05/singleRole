// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import loginImg from "../assets/login.png";
// import { AppContext } from "../context/AppContext"; // Adjust path if needed

// const Login = () => {
//   const navigate = useNavigate();
//   const { backendUrl ,setIsLoggedIn , getUserData} = useContext(AppContext);

//   const [showPassword, setShowPassword] = useState(false);
//   const [isCreateAccount, setIsCreateAccount] = useState(true);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     axios.defaults.withCredentials = true; 
//     setLoading(true);

//     try{
//       if(isCreateAccount){
          
//           //for register
//       const response = await axios.post(`${backendUrl}/register`, {name,email,password});
//       if(response.status === 201){
//         navigate("/");
//         toast.success("Account created successfully! Please verify your email");
//       } else{
//         toast.error("Email already exists!");
//       }

//       }else{
//         //login api
//         const response = await axios.post(`${backendUrl}/login`, {email,password});

//         if(response.status === 200){
//           setIsLoggedIn(true);
//           getUserData(); // Fetch user data after login
//           navigate("/");
//           toast.success("Login successful!");
//       } else{
//           toast.error("Invalid credentials!");
//       }

//     }
    
//     } catch(error){
//       toast.error(error.response.data.message);
//     }


//   }

//   return (
//     <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
//       <div className="col-md-6 col-lg-4 p-5 bg-white shadow rounded-4">
//         {/* Logo */}
//         <div className="text-center mb-4">
//           <img
//             src={loginImg}
//             alt="login"
//             className="shadow"
//             style={{
//               width: "100px",
//               height: "100px",
//               borderRadius: "20%",
//               objectFit: "cover",
//               border: "3px solid #007bff",
//             }}
//           />
//         </div>

//         {/* Title */}
//         <h3 className="text-center text-primary fw-bold mb-4">
//           {isCreateAccount ? "Create Account" : "Login"}
//         </h3>

//         <form onSubmit={onSubmitHandler}>
//           {isCreateAccount && (
//             <div className="mb-3">
//               <label htmlFor="fullname" className="form-label">Full Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="fullname"
//                 placeholder="Enter your full name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">Email address</label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="form-label">Password</label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="form-control"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={() => setShowPassword((prev) => !prev)}
//               >
//                 <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100 rounded-pill fw-semibold"
//             disabled={loading}
//           >
//             {loading ? "Please wait..." : isCreateAccount ? "Sign Up" : "Login"}
//           </button>

//           <div className="text-center mt-3">
//             <Link to="/reset-password" className="text-decoration-none text-primary">
//               Forgot Password?
//             </Link>
//           </div>
//         </form>

//         {/* Toggle */}
//         <div className="text-center mt-3">
//           <button
//             type="button"
//             className="btn btn-link text-primary"
//             onClick={() => setIsCreateAccount((prev) => !prev)}
//           >
//             {isCreateAccount
//               ? "Already have an account? Login"
//               : "Don't have an account? Create one"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import loginImg from "../assets/login.png";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true; 
    setLoading(true);

    try {
      if(isCreateAccount) {
        const response = await axios.post(`${backendUrl}/register`, {name,email,password});
        if(response.status === 201) {
          navigate("/");
          toast.success("Account created successfully! Please verify your email");
        } else {
          toast.error("Email already exists!");
        }
      } else {
        const response = await axios.post(`${backendUrl}/login`, {email,password});
        if(response.status === 200) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
          toast.success("Login successful!");
        } else {
          toast.error("Invalid credentials!");
        }
      }
    } catch(error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFormType = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsCreateAccount(prev => !prev);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div 
      className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <div 
        className={`col-md-6 col-lg-4 p-5 bg-white shadow rounded-4 ${isAnimating ? 'animate-flip' : ''}`}
        style={{
          transition: "all 0.3s ease",
          transformStyle: "preserve-3d",
          border: "1px solid rgba(0,0,0,0.1)",
          maxWidth: "450px",
          width: "90%"
        }}
      >
        {/* Logo */}
        <div 
          className="text-center mb-4"
          style={{
            transform: "translateY(0)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <img
            src={loginImg}
            alt="login"
            className="shadow"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "20%",
              objectFit: "cover",
              border: "3px solid #007bff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
          />
        </div>

        {/* Title */}
        <h3 
          className="text-center text-primary fw-bold mb-4"
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block"
          }}
        >
          {isCreateAccount ? "Create Account" : "Login"}
        </h3>

        <form onSubmit={onSubmitHandler}>
          {isCreateAccount && (
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#0d6efd"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#ced4da"}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#0d6efd"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ced4da"}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: "12px 15px",
                  borderRadius: "8px 0 0 8px",
                  border: "1px solid #ced4da",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#0d6efd"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#ced4da"}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  borderRadius: "0 8px 8px 0",
                  borderLeft: "none",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
              border: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(13, 110, 253, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 5px rgba(13, 110, 253, 0.3)";
            }}
          >
            {loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                {isCreateAccount ? "Signing Up..." : "Logging In..."}
              </>
            ) : isCreateAccount ? "Sign Up" : "Login"}
          </button>

          <div className="text-center mt-3">
            <Link 
              to="/reset-password" 
              className="text-decoration-none text-primary fw-medium"
              style={{
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Toggle */}
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link text-primary fw-medium"
            onClick={toggleFormType}
            style={{
              transition: "all 0.2s ease",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {isCreateAccount
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </button>
        </div>

        <style>
          {`
            @keyframes flip {
              0% { transform: rotateY(0deg); }
              50% { transform: rotateY(90deg); }
              100% { transform: rotateY(0deg); }
            }
            .animate-flip {
              animation: flip 0.6s ease;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Login;