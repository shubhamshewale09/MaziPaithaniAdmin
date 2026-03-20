const Loader = ({ fullScreen = true, overlay = false, message = "Please wait..." }) => {
  const wrapperClassName = overlay
    ? "fixed inset-0 z-[95] flex items-center justify-center bg-[#2d140f]/25 px-4 backdrop-blur-[3px]"
    : fullScreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={wrapperClassName}>
      <div className="flex min-w-[220px] items-center gap-4 rounded-[22px] border border-[#ead8cf] bg-[#fffaf6] px-5 py-4 shadow-[0_24px_70px_rgba(45,20,15,0.18)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ead8cf] border-t-[#7a1e2c]" />
        <div>
          <p className="text-sm font-semibold text-[#341814]">Loading</p>
          <p className="text-xs text-[#8c6b5f]">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
