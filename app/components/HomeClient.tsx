"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export default function HomeClient({ data }: { data: any }) {
    const { personal } = data;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-white text-slate-900 p-8 md:p-16 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center"
            >
                {/* Profile Photo Area */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100">
                    <Image
                        src={personal.hasImage ? "/api/image" : "/hero-image.png"}
                        alt={personal.name}
                        fill
                        className="object-cover"
                        priority // Prioritize loading this image
                    />
                </div>

                <span className="inline-block py-1.5 px-4 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-6 border border-slate-200">
                    {personal.role}
                </span>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight text-slate-900">
                    {personal.name.split(' ')[0]} <span className="text-blue-600">{personal.name.split(' ')[1]}</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {personal.tagline}
                </p>

                <div className="flex flex-row gap-4 justify-center mb-12">
                    <Link
                        href="#projects"
                        className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 text-lg"
                    >
                        View Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#contact"
                        className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-medium hover:bg-slate-50 transition-all text-lg"
                    >
                        Contact Me
                    </Link>
                    {personal.hasResume && (
                        <a
                            href="/api/resume"
                            className="flex items-center gap-2 bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-medium hover:bg-slate-200 transition-all text-lg"
                            download
                        >
                            Download Resume
                        </a>
                    )}
                </div>

                <div className="flex gap-8 text-slate-400">
                    <a href={personal.social.github} target="_blank" className="hover:text-slate-900 transition-colors transform hover:scale-110 duration-200">
                        <Github className="w-8 h-8" />
                    </a>
                    <a href={'https://www.linkedin.com/in/dharanesh-kumar-72269231b/'} target="_blank" className="hover:text-blue-700 transition-colors transform hover:scale-110 duration-200">
                        <Linkedin className="w-8 h-8" />
                    </a>
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personal.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors transform hover:scale-110 duration-200">
                        <Mail className="w-8 h-8" />
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
