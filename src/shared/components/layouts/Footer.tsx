const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-transparent backdrop-blur-sm text-slate-500 text-xs sm:text-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold tracking-tight">CJT</span>
            <span className="text-slate-700">|</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline italic">
              Built to keep you aligned with your Goals.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
