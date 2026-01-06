"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, Globe } from "lucide-react";

export default function ContactClient({ data }: { data: any }) {
    const { personal } = data;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        const formData = new FormData(e.currentTarget);
        const submitData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) throw new Error('Failed to send message');

            setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-white py-16 px-4 md:px-8 flex items-center justify-center">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">

                {/* Info Side */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <span className="text-blue-600 font-semibold tracking-wider text-sm">GET IN TOUCH</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">Let's Work Together</h1>
                        <p className="text-slate-600 text-lg">
                            I'm open to freelance opportunities, collaborations, and discussions about new projects.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Phone</p>
                                <p className="text-slate-900 font-semibold">{personal.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Email</p>
                                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personal.email}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                                    {personal.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Location</p>
                                <p className="text-slate-900 font-semibold">{personal.location || "Available Remote"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Website</p>
                                <p className="text-slate-900 font-semibold">{personal.website}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex gap-4">
                        <a href={'https://github.com/dharanesh-official'} className="p-3 bg-slate-50 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href={'https://www.linkedin.com/in/dharanesh-kumar-72269231b/'} className="p-3 bg-slate-50 rounded-full text-blue-700 hover:bg-blue-700 hover:text-white transition-all">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {status.type && (
                            <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {status.message}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">First Name</label>
                                <input type="text" name="firstName" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 text-slate-900" placeholder="Karthik" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Last Name</label>
                                <input type="text" name="lastName" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 text-slate-900" placeholder="S" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 text-slate-900" placeholder="yourmail@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Message</label>
                            <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 text-slate-900" placeholder="The Purpose of contacting..."></textarea>
                        </div>

                        <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}
