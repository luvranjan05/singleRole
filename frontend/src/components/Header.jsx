// import React, { useContext } from 'react'; // <-- FIXED: added useContext
// import headerImg from '../assets/react1.jpg';

// import { AppContext } from "../context/AppContext.jsx";

// const Header = () => {
//     const { userData } = useContext(AppContext);

//     return (
//         <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: "90vh" }}>
//             <img
//                 src={headerImg}
//                 alt="header"
//                 className="mb-4 rounded-circle shadow"
//                 style={{ width: "120px", height: "120px", objectFit: "cover" }}
//             />
//             <h5 className="fw-semibold mb-2">
//                 Hello,  {userData ? userData.name : 'developers'} <span role="img" aria-label="wave">👍How are you ?</span>
//             </h5>
//             <h3 className="text-primary mb-2">Welcome to My Product</h3>
//             <h1 className="mb-4 fw-bold" style={{ maxWidth: "600px" }}>
//                 Let's start a quick product tour and you can set up authentication in no time.
//             </h1>
//             <button className="btn btn-outline-dark rounded-pill px-4 shadow-sm">
//                 Get Started
//             </button>
//         </div>
//     );
// };

// export default Header;

import React, { useContext } from 'react';
import headerImg from '../assets/react1.jpg';
import { AppContext } from "../context/AppContext";

const Header = () => {
    const { userData } = useContext(AppContext);

    return (
        <div 
            className="container d-flex flex-column align-items-center justify-content-center text-center py-5 position-relative"
            style={{ 
                minHeight: "90vh",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                overflow: "hidden"
            }}
        >
            {/* Animated background elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i}
                        className="position-absolute rounded-circle"
                        style={{
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            background: "rgba(13, 110, 253, 0.05)",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <img
                src={headerImg}
                alt="header"
                className="mb-4 rounded-circle shadow"
                style={{ 
                    width: "140px", 
                    height: "140px", 
                    objectFit: "cover",
                    border: "4px solid white",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(0)",
                    transition: "all 0.3s ease",
                    zIndex: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            />
            
            <h5 
                className="fw-semibold mb-2 position-relative"
                style={{ zIndex: 1 }}
            >
                Hello, {userData ? userData.name : 'developers'} 
                <span 
                    role="img" 
                    aria-label="wave"
                    style={{
                        display: "inline-block",
                        animation: "wave 2s infinite",
                        transformOrigin: "70% 70%"
                    }}
                >
                    👍 How are you?
                </span>
            </h5>
            
            <h3 
                className="text-primary mb-2 position-relative"
                style={{ zIndex: 1 }}
            >
                Welcome to My Product
            </h3>
            
            <h1 
                className="mb-4 fw-bold position-relative"
                style={{ 
                    maxWidth: "600px",
                    zIndex: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
            >
                Let's start a quick product tour and you can set up authentication in no time.
            </h1>
            
            <button 
                className="btn btn-primary rounded-pill px-4 shadow-sm position-relative"
                style={{
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
                    border: "none",
                    padding: "10px 24px",
                    fontSize: "1.1rem"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 15px rgba(13, 110, 253, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
            >
                Get Started
            </button>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0) rotate(0deg); }
                    }
                    @keyframes wave {
                        0% { transform: rotate(0deg); }
                        10% { transform: rotate(-10deg); }
                        20% { transform: rotate(12deg); }
                        30% { transform: rotate(-10deg); }
                        40% { transform: rotate(9deg); }
                        50% { transform: rotate(0deg); }
                        100% { transform: rotate(0deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Header;