"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Projects", path: "#projects" },
    { name: "Contact", path: "#contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200/20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-bold whitespace-nowrap text-slate-900 dark:text-white">
                            Dharanesh K
                        </span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? <X /> : <Menu />}
                    </button>

                    <div className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            href={item.path}
                                            className={`block py-2 px-3 rounded-sm md:p-0 transition-colors duration-200 ${isActive
                                                ? "text-blue-700 dark:text-blue-500 bg-blue-50 md:bg-transparent font-bold"
                                                : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                                }`}
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-underline"
                                                    className="hidden md:block h-0.5 bg-blue-700 dark:bg-blue-500 w-full mt-1"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
