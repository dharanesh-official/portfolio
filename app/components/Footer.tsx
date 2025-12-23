export default function Footer() {
    return (
        <footer className="footer bg-slate-900 text-white p-10 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                <aside>
                    <h2 className="text-2xl font-bold">Dharanesh K</h2>
                    <p className="opacity-75">Web Developer & Cyber Security Enthusiast</p>
                    <p className="text-sm mt-2 opacity-50">© {new Date().getFullYear()} - All rights reserved</p>
                </aside>
                <nav className="flex gap-4">
                    <a href="https://linkedin.com/in/dharanesh-kumar" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
                    <a href="https://github.com/dharanesh-official" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info.dharaneshk@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Email</a>
                </nav>
            </div>
        </footer>
    );
}
