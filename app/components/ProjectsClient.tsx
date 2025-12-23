"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsClient({ data }: { data: any }) {
    const { projects } = data;

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">My Projects</h1>
                    <p className="text-slate-600">A showcase of my technical endeavors and solutions.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-visible hover:shadow-xl transition-shadow duration-300 border border-slate-200 flex flex-col group"
                        >
                            <div className="p-8 flex flex-col h-full bg-white rounded-2xl z-10 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    {/* Placeholder links */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Github className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tags.map((tag: string) => (
                                        <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative accent */}
                            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-b-2xl"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
