import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import { SellerButton } from "../../components/seller/SellerUI";
import { changePassword } from "../../services/auth/ChangePassword";
import { sendForgotPasswordOtp, verifyOtp, resetPasswordWithOtp } from "../../services/auth/ForgotPassword";
import { showGlobalSuccess, showGlobalError } from "../../Utils/feedbackModal";

const ErrorBanner = ({ msg }) => (
  <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
    <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
    <p className="text-sm font-medium text-red-600">{msg}</p>
  </div>
);

const PasswordField = ({ id, name, label, placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="seller-label" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a67d65]">
          <Lock size={16} />
        </span>
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          className="seller-input pl-10 pr-12"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a67d65] hover:text-[#7a1e2c] transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");

  const handlePwChange = (e) => {
    setPwError("");
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      return setPwError("All fields are required.");
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwError("New passwords do not match.");
    }
    if (pwForm.newPassword.length < 6) {
      return setPwError("New password must be at least 6 characters.");
    }
    try {
      const userId = localStorage.getItem("UserId");
      const res = await changePassword({
        userId: Number(userId),
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      showGlobalSuccess(res, "Password changed successfully.");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showGlobalError(err, "Failed to change password.");
    }
  };

  // ── Forgot Password Modal ──────────────────────────────────────
  const [modalOpen, setModalOpen]   = useState(false);
  const [fpStep, setFpStep]         = useState(1); // 1=email, 2=otp, 3=new password
  const [fpEmail, setFpEmail]       = useState("");
  const [fpOtp, setFpOtp]           = useState("");
  const [fpNewPw, setFpNewPw]       = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [fpError, setFpError]       = useState("");

  const openModal = () => { setModalOpen(true); setFpStep(1); setFpEmail(""); setFpOtp(""); setFpNewPw(""); setFpConfirmPw(""); setFpError(""); };
  const closeModal = () => setModalOpen(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!fpEmail) return setFpError("Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) return setFpError("Please enter a valid email.");
    try {
      const res = await sendForgotPasswordOtp(fpEmail);
      showGlobalSuccess(res, "OTP sent to your email.");
      setFpError("");
      setFpStep(2);
    } catch (err) {
      showGlobalError(err, "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!fpOtp) return setFpError("Please enter the OTP.");
    try {
      const res = await verifyOtp(fpEmail, fpOtp);
      showGlobalSuccess(res, "OTP verified successfully.");
      setFpError("");
      setFpStep(3);
    } catch (err) {
      showGlobalError(err, "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!fpNewPw || !fpConfirmPw) return setFpError("All fields are required.");
    if (fpNewPw !== fpConfirmPw) return setFpError("Passwords do not match.");
    if (fpNewPw.length < 6) return setFpError("Password must be at least 6 characters.");
    try {
      const res = await resetPasswordWithOtp(fpEmail, fpOtp, fpNewPw);
      showGlobalSuccess(res, "Password reset successfully.");
      closeModal();
    } catch (err) {
      showGlobalError(err, "Failed to reset password.");
    }
  };

  const stepMeta = [
    { step: 1, label: "Enter Email",    icon: <Mail size={15} /> },
    { step: 2, label: "Verify OTP",     icon: <ShieldAlert size={15} /> },
    { step: 3, label: "Reset Password", icon: <KeyRound size={15} /> },
  ];

  return (
    <>
      <MetaTitle title="Settings" />

      {/* ── Forgot Password Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(6px)", background: "rgba(47,29,24,0.45)" }}>
          <div className="seller-panel seller-rise w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="relative flex items-center gap-3 border-b border-[rgba(122,30,44,0.1)] bg-gradient-to-r from-[rgba(122,30,44,0.06)] to-transparent px-6 py-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a1e2c] to-[#ab3647] text-white shadow">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#381c17]">Forgot Password</h2>
                <p className="text-xs text-[#7d655d]">
                  {fpStep === 1 && "We'll send an OTP to your email"}
                  {fpStep === 2 && "Enter the OTP sent to your email"}
                  {fpStep === 3 && "Set your new password"}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#a67d65] hover:bg-[rgba(122,30,44,0.08)] hover:text-[#7a1e2c] transition-colors">
                <X size={17} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0 border-b border-[rgba(122,30,44,0.08)] bg-[rgba(247,241,237,0.6)] px-6 py-3">
              {stepMeta.map((s, i) => (
                <React.Fragment key={s.step}>
                  <div className="flex items-center gap-1.5">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      fpStep === s.step ? "bg-[#7a1e2c] text-white shadow" :
                      fpStep > s.step  ? "bg-[rgba(122,30,44,0.15)] text-[#7a1e2c]" :
                                         "bg-[rgba(122,30,44,0.07)] text-[#a67d65]"
                    }`}>
                      {fpStep > s.step ? <CheckCircle2 size={13} /> : s.step}
                    </div>
                    <span className={`text-[11px] font-semibold ${ fpStep === s.step ? "text-[#7a1e2c]" : "text-[#a67d65]" }`}>{s.label}</span>
                  </div>
                  {i < stepMeta.length - 1 && <div className="mx-2 h-px flex-1 bg-[rgba(122,30,44,0.12)]" />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1 — Email */}
            {fpStep === 1 && (
              <form className="space-y-5 p-6" onSubmit={handleSendOtp}>
                <div className="space-y-1.5">
                  <label className="seller-label" htmlFor="fpEmail">Email Address</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a67d65]"><Mail size={16} /></span>
                    <input
                      id="fpEmail"
                      type="email"
                      className="seller-input pl-10"
                      placeholder="Enter your registered email"
                      value={fpEmail}
                      onChange={(e) => { setFpError(""); setFpEmail(e.target.value); }}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {fpError && <ErrorBanner msg={fpError} />}
                <div className="seller-soft-panel rounded-2xl px-4 py-3 text-xs leading-6 text-[#7c665d]">
                  📧 An OTP will be sent to your registered email address.
                </div>
                <div className="flex gap-3">
                  <SellerButton type="submit" variant="primary" className="flex-1"><Mail size={15} /> Send OTP</SellerButton>
                  <SellerButton type="button" variant="ghost" onClick={closeModal}>Cancel</SellerButton>
                </div>
              </form>
            )}

            {/* Step 2 — Verify OTP */}
            {fpStep === 2 && (
              <form className="space-y-5 p-6" onSubmit={handleVerifyOtp}>
                <div className="seller-soft-panel rounded-2xl px-4 py-3 text-xs text-[#7c665d]">
                  OTP sent to <span className="font-bold text-[#7a1e2c]">{fpEmail}</span>
                </div>
                <div className="space-y-1.5">
                  <label className="seller-label" htmlFor="fpOtp">Enter OTP</label>
                  <input
                    id="fpOtp"
                    type="text"
                    maxLength={6}
                    className="seller-input text-center text-2xl font-bold tracking-[0.5em]"
                    placeholder="------"
                    value={fpOtp}
                    onChange={(e) => { setFpError(""); setFpOtp(e.target.value.replace(/\D/g, "")); }}
                    autoComplete="off"
                  />
                </div>
                {fpError && <ErrorBanner msg={fpError} />}
                <div className="flex gap-3">
                  <SellerButton type="submit" variant="primary" className="flex-1"><ShieldAlert size={15} /> Verify OTP</SellerButton>
                  <button type="button" onClick={() => { setFpStep(1); setFpError(""); setFpOtp(""); }} className="text-sm font-semibold text-[#7a1e2c] hover:underline underline-offset-4">Resend</button>
                </div>
              </form>
            )}

            {/* Step 3 — Reset Password */}
            {fpStep === 3 && (
              <form className="space-y-5 p-6" onSubmit={handleResetPassword}>
                <div className="seller-soft-panel rounded-2xl px-4 py-3 text-xs text-[#7c665d]">
                  OTP verified for <span className="font-bold text-[#7a1e2c]">{fpEmail}</span>
                </div>
                <PasswordField id="fpNewPw" name="fpNewPw" label="New Password" placeholder="Minimum 6 characters" value={fpNewPw}
                  onChange={(e) => { setFpError(""); setFpNewPw(e.target.value); }} />
                <PasswordField id="fpConfirmPw" name="fpConfirmPw" label="Confirm New Password" placeholder="Repeat new password" value={fpConfirmPw}
                  onChange={(e) => { setFpError(""); setFpConfirmPw(e.target.value); }} />
                {fpError && <ErrorBanner msg={fpError} />}
                <div className="seller-soft-panel rounded-2xl px-4 py-3 text-xs leading-6 text-[#7c665d]">
                  💡 Use a mix of letters, numbers, and symbols for a stronger password.
                </div>
                <SellerButton type="submit" variant="primary" className="w-full"><KeyRound size={15} /> Reset Password</SellerButton>
              </form>
            )}

          </div>
        </div>
      )}

      <div className="seller-page space-y-6">

        {/* Hero */}
        <section className="seller-hero seller-rise px-6 py-8 sm:px-10">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7a1e2c] to-[#ab3647] shadow-lg text-white">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#a67d65]">Account Settings</p>
              <h1 className="seller-display mt-1 text-3xl font-bold text-[#5f1320] sm:text-4xl">Security & Password</h1>
              <p className="mt-1 text-sm text-[#6f5a53]">Keep your seller account protected with a strong, unique password.</p>
            </div>
          </div>
        </section>

        {/* Card */}
        <div className="mx-auto max-w-xl">
          <section className="seller-panel seller-rise overflow-hidden">

            {/* Card header strip */}
            <div className="flex items-center gap-3 border-b border-[rgba(122,30,44,0.1)] bg-gradient-to-r from-[rgba(122,30,44,0.04)] to-transparent px-6 py-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(122,30,44,0.08)] text-[#7a1e2c]">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#381c17]">Change Password</h2>
                <p className="text-xs text-[#7d655d]">Update your login credentials below</p>
              </div>
            </div>

            {/* Form body */}
            <form className="space-y-5 p-6" onSubmit={handleChangePassword}>
              <PasswordField
                id="oldPassword"
                name="oldPassword"
                label="Current Password"
                placeholder="Enter your current password"
                value={pwForm.oldPassword}
                onChange={handlePwChange}
              />
              <PasswordField
                id="newPassword"
                name="newPassword"
                label="New Password"
                placeholder="Minimum 6 characters"
                value={pwForm.newPassword}
                onChange={handlePwChange}
              />
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Repeat your new password"
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
              />

              {pwError && <ErrorBanner msg={pwError} />}

              {/* Tip */}
              <div className="seller-soft-panel rounded-2xl px-4 py-3 text-xs leading-6 text-[#7c665d]">
                💡 Use a mix of letters, numbers, and symbols for a stronger password.
              </div>

              {/* Divider */}
              <div className="seller-divider" />

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SellerButton type="submit" variant="primary">
                  <KeyRound size={15} /> Update Password
                </SellerButton>
                <button
                  type="button"
                  onClick={openModal}
                  className="text-sm font-semibold text-[#7a1e2c] underline-offset-4 hover:underline transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>

          </section>
        </div>

      </div>
    </>
  );
};

export default Settings;
