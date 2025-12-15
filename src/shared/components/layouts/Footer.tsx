const Footer = () => {
	return (
		<footer className="border-t border-slate-700/60 bg-slate-900/80 text-slate-400 text-xs sm:text-sm">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<span>© {new Date().getFullYear()} ChallengeTracker</span>
				<span className="hidden sm:inline">Built to keep your coding streak alive.</span>
			</div>
		</footer>
	);
};

export default Footer;
