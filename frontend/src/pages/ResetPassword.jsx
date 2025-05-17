import React, { useRef, useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ResetP from "../assets/Resetp.png";
import Menubar from "../components/Menubar";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify"; // ✅ Added toast
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const { backendUrl } = useContext(AppContext);
    axios.defaults.withCredentials = true;

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        paste.forEach((digit, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputsRef.current[next]?.focus();
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/send-reset-otp?email=${email}`);
            if (response.status === 200) {
                toast.success("OTP sent successfully to your email!");
                setIsEmailSent(true);
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            toast.error(error.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = () => {
        const otpValue = inputsRef.current.map((input) => input.value).join("");
        if (otpValue.length < 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }
        setOtp(otpValue);
        setIsOtpSubmitted(true);
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/reset-password`, { email, otp, newPassword });
            if (response.status === 200) {
                toast.success("Password reset successfully!");
                navigate("/login");
            } else {
                toast.error("Failed to reset password");
            }
        } catch (error) {
            toast.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };
   

    return (
        <>
            <Menubar />
            <div className="container py-5 d-flex justify-content-center align-items-center flex-column">
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100" style={{ maxWidth: "600px" }}>
                    <div className="card-image" style={{ background: `url(${ResetP}) no-repeat center / cover`, height: "200px" }}></div>
                    <div className="card-body p-4">
                        <Link to="/" className="brand-logo d-flex align-items-center mb-3 text-decoration-none">
                            <img src={ResetP} alt="Reset Password" className="logo me-2" style={{ width: "40px" }} />
                            <span className="fs-4 fw-bold text-dark">Core-Security</span>
                        </Link>
                        <h3 className="mb-3">Reset Password</h3>
                        <p className="text-muted">Enter your registered email address</p>

                        {!isEmailSent ? (
                            <form onSubmit={onSubmitEmail}>
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                    className="form-control mb-3"
                                />
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Sending..." : "Submit"}
                                </button>
                            </form>
                        ) : (
                            <p className="alert alert-success">OTP sent successfully. Check your email.</p>
                        )}
                    </div>
                </div>

                {isEmailSent && (
                    <div className="mt-4 text-center">
                        <h5>Enter OTP</h5>
                        <div className="d-flex justify-content-center gap-2 mb-3">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="form-control text-center"
                                    style={{ width: "40px" }}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>
                        <button className="btn btn-success" onClick={handleVerify} disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {isOtpSubmitted && (
                    <div className="mt-4 w-100" style={{ maxWidth: "400px" }}>
                        <h5 className="mb-3 text-center">Set New Password</h5>
                        <form onSubmit={onSubmitNewPassword}>
                            <input
                                type="password"
                                placeholder="New Password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                required
                                className="form-control mb-3"
                            />
                            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                                {loading ? "Resetting..." : "Submit"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default ResetPassword;
