"use client";

import { motion } from "framer-motion";
import { BookOpen, Trophy, Code2 } from "lucide-react";

export default function AboutClient({ data }: { data: any }) {
    const { personal, education, skills, achievements } = data;

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold text-slate-900">About Me</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        I am {personal.name}, a {personal.role}. {personal.tagline}
                    </p>
                </motion.div>

                {/* Education Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                    </div>

                    <div className="space-y-8">
                        {education.map((edu: any, index: number) => (
                            <div key={index} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-8 last:pb-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                                <h3 className="text-xl font-semibold text-slate-900">{edu.degree}</h3>
                                <p className="text-sm font-medium text-blue-600 mt-1">{edu.period}</p>
                                <p className="text-slate-600 mt-2">{edu.school}</p>
                                {edu.details && <p className="text-slate-500 text-sm mt-1">{edu.details}</p>}
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Achievements Section - High Priority */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Trophy className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Achievements</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {achievements.map((item: string, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500 flex items-start gap-4 hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="mt-1 p-2 bg-amber-50 rounded-full text-amber-600 shrink-0">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <p className="text-lg font-medium text-slate-800 leading-snug">
                                    {item}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Skills Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-violet-100 rounded-lg">
                            <Code2 className="w-6 h-6 text-violet-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Technical Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string) => (
                            <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-200 transition-colors border border-slate-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
