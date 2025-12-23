"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import { Trash2, Plus, Upload, X, Shield, Lock, User } from "lucide-react";

// Types
type Education = { degree: string; period: string; school: string; details: string };
type Project = { title: string; description: string; tags: string[] };
type ContentData = {
    personal: {
        name: string;
        role: string;
        tagline: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        image?: string;
        social: { github: string; linkedin: string };
    };
    education: Education[];
    skills: string[];
    achievements: string[];
    projects: Project[];
};

type AdminUser = { id: string; username: string };

export default function AdminPage() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Data State
    const [data, setData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"personal" | "about" | "projects" | "contact" | "settings">("personal");

    // Admin Management State
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [newAdminUser, setNewAdminUser] = useState("");
    const [newAdminPass, setNewAdminPass] = useState("");

    const router = useRouter();

    // Image Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropModal, setShowCropModal] = useState(false);

    // --- Auth Checks ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                setIsAuthenticated(true);
                fetchData();
                fetchAdmins();
            } else {
                alert("Invalid credentials");
            }
        } catch (e) {
            alert("Login failed");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/content");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/auth/admins");
            if (res.ok) {
                setAdmins(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddAdmin = async () => {
        if (!newAdminUser || !newAdminPass) return alert("Please fill all fields");
        try {
            const res = await fetch("/api/auth/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newAdminUser, password: newAdminPass })
            });

            if (res.ok) {
                alert("Admin added successfully");
                setNewAdminUser("");
                setNewAdminPass("");
                fetchAdmins();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to add admin");
            }
        } catch (e) {
            alert("Error adding admin");
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;
        try {
            const res = await fetch(`/api/auth/admins?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchAdmins();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (e) {
            alert("Error deleting admin");
        }
    };

    const handleSave = async () => {
        if (!data) return;
        try {
            // Create a payload copy without the heavy image data
            // The image is handled separately via the /api/upload endpoint
            // This prevents 413 Payload Too Large errors
            const payload = { ...data, personal: { ...data.personal } };
            delete payload.personal.image;

            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                alert("Content saved successfully!");
                router.push("/");
            } else {
                const err = await res.json();
                console.error("Save failed:", err);
                alert(`Failed to save content: ${err.error || 'Unknown error'}`);
            }
        } catch (error) {
            alert("Error saving data.");
        }
    };

    // --- Image Handling Helpers (Same as before) ---
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setShowCropModal(true);
        }
    };
    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result as string), false);
            reader.readAsDataURL(file);
        });
    };
    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });
    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2d context");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) { reject(new Error('Canvas is empty')); return; }
                resolve(blob);
            }, 'image/png');
        });
    };
    const handleCropSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                const formData = new FormData();
                formData.append("file", croppedImageBlob);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    alert("Profile photo updated!");
                    setShowCropModal(false);
                    router.refresh();
                } else {
                    alert("Failed to upload image.");
                }
            } catch (e) {
                console.error(e);
                alert("Error cropping image.");
            }
        }
    };

    // --- Updates Helpers ---
    const updatePersonal = (field: string, value: string) => {
        if (!data) return;
        setData({ ...data, personal: { ...data.personal, [field]: value } });
    };
    const updateSocial = (platform: 'github' | 'linkedin', value: string) => {
        if (!data) return;
        setData({ ...data, personal: { ...data.personal, social: { ...data.personal.social, [platform]: value } } });
    };

    // --- Render ---

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-slate-200">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-slate-900 rounded-full text-white">
                            <Shield className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Secure Admin Login</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                placeholder="Enter password"
                            />
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg">
                            Access Dashboard
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (loading || !data) return <div className="p-10 text-center text-slate-900 font-medium">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Shield className="w-6 h-6 text-slate-900" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-all">
                            Save Changes
                        </button>
                        <button onClick={() => setIsAuthenticated(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 shadow-md transition-all">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 mb-8 w-fit mx-auto md:mx-0">
                    {(["personal", "contact", "about", "projects", "settings"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="space-y-8">

                    {/* PERSONAL TAB */}
                    {activeTab === "personal" && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                Profile Details
                            </h2>
                            <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
                                <label className="text-slate-700 font-medium mb-4">Profile Photo</label>
                                <div className="flex gap-4 items-center">
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                        <Upload className="w-4 h-4" /> Upload New
                                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                    <input value={data.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                                    <input value={data.personal.role} onChange={(e) => updatePersonal('role', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Tagline</label>
                                    <textarea rows={2} value={data.personal.tagline} onChange={(e) => updatePersonal('tagline', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTACT TAB */}
                    {activeTab === "contact" && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold mb-6 text-slate-800">Contact Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                                    <input value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                                    <input value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
                                    <input value={data.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Website URL</label>
                                    <input value={data.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                </div>

                                <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2">
                                    <h3 className="font-bold text-slate-800 mb-4">Social Profiles</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">GitHub URL</label>
                                            <input value={data.personal.social.github} onChange={(e) => updateSocial('github', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">LinkedIn URL</label>
                                            <input value={data.personal.social.linkedin} onChange={(e) => updateSocial('linkedin', e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-slate-50 focus:bg-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === "about" && (
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Education</h3>
                                    <button onClick={() => setData({ ...data, education: [...data.education, { degree: "New Degree", period: "", school: "", details: "" }] })} className="text-sm flex items-center gap-1 text-blue-600 hover:underline"><Plus className="w-4 h-4" /> Add</button>
                                </div>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                                            <button onClick={() => setData({ ...data, education: data.education.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                            <div className="grid gap-2">
                                                <input value={edu.degree} onChange={(e) => { const newEdu = data.education.map((item, idx) => idx === i ? { ...item, degree: e.target.value } : item); setData({ ...data, education: newEdu }); }} className="font-bold bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-slate-900 pb-1" placeholder="Degree Name" />
                                                <input value={edu.period} onChange={(e) => { const newEdu = data.education.map((item, idx) => idx === i ? { ...item, period: e.target.value } : item); setData({ ...data, education: newEdu }); }} className="text-sm bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-blue-600" placeholder="Period (e.g., 2020-2024)" />
                                                <input value={edu.school} onChange={(e) => { const newEdu = data.education.map((item, idx) => idx === i ? { ...item, school: e.target.value } : item); setData({ ...data, education: newEdu }); }} className="text-sm bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-slate-600" placeholder="School Name" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Skills</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-2">Separate skills with commas</p>
                                <textarea
                                    value={data.skills.join(", ")}
                                    onChange={(e) => setData({ ...data, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                                    className="w-full p-4 border rounded-lg text-slate-900 bg-slate-50 min-h-[100px]"
                                />
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Achievements</h3>
                                    <button onClick={() => setData({ ...data, achievements: [...data.achievements, "New Achievement"] })} className="text-sm flex items-center gap-1 text-blue-600 hover:underline"><Plus className="w-4 h-4" /> Add</button>
                                </div>
                                <div className="space-y-2">
                                    {data.achievements.map((ach, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input value={ach} onChange={(e) => { const newAch = data.achievements.map((item, idx) => idx === i ? e.target.value : item); setData({ ...data, achievements: newAch }); }} className="w-full p-2 border rounded-lg text-slate-900 bg-slate-50" />
                                            <button onClick={() => setData({ ...data, achievements: data.achievements.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === "projects" && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Projects</h2>
                                <button onClick={() => setData({ ...data, projects: [{ title: "New Project", description: "Project Description", tags: ["Tag"] }, ...data.projects] })} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700">
                                    <Plus className="w-4 h-4" /> Add Project
                                </button>
                            </div>
                            <div className="grid gap-6">
                                {data.projects.map((project, i) => (
                                    <div key={i} className="border border-slate-200 rounded-xl p-6 bg-slate-50 relative group">
                                        <button onClick={() => setData({ ...data, projects: data.projects.filter((_, idx) => idx !== i) })} className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="w-4 h-4" /></button>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                                                <input
                                                    value={project.title}
                                                    onChange={(e) => { const newProjs = data.projects.map((p, idx) => idx === i ? { ...p, title: e.target.value } : p); setData({ ...data, projects: newProjs }); }}
                                                    className="w-full text-lg font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                                <textarea
                                                    rows={2}
                                                    value={project.description}
                                                    onChange={(e) => { const newProjs = data.projects.map((p, idx) => idx === i ? { ...p, description: e.target.value } : p); setData({ ...data, projects: newProjs }); }}
                                                    className="w-full text-sm text-slate-600 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags (comma separated)</label>
                                                <input
                                                    value={project.tags.join(", ")}
                                                    onChange={(e) => { const newProjs = data.projects.map((p, idx) => idx === i ? { ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) } : p); setData({ ...data, projects: newProjs }); }}
                                                    className="w-full text-sm text-blue-600 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS (ADMINS) TAB */}
                    {activeTab === "settings" && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-slate-900" />
                                <h2 className="text-xl font-bold text-slate-800">Admin Management</h2>
                            </div>

                            {/* Create Admin Form */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Admin</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={newAdminUser}
                                        onChange={e => setNewAdminUser(e.target.value)}
                                        className="p-3 border rounded-lg text-slate-900 bg-white"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newAdminPass}
                                        onChange={e => setNewAdminPass(e.target.value)}
                                        className="p-3 border rounded-lg text-slate-900 bg-white"
                                    />
                                    <button
                                        onClick={handleAddAdmin}
                                        className="bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-700 transition-colors"
                                    >
                                        Create Admin
                                    </button>
                                </div>
                            </div>

                            {/* Admin List */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4">Existing Admins</h3>
                                <div className="space-y-3">
                                    {admins.map(admin => (
                                        <div key={admin.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-slate-900">{admin.username}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Admin"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    {admins.length === 0 && <p className="text-slate-500">No admins found.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* MODAL REMAINS THE SAME (Already included in file) */}
                {showCropModal && imageSrc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-900">Crop Profile Photo</h3>
                                <button onClick={() => setShowCropModal(false)}><X className="text-slate-500 hover:text-slate-900" /></button>
                            </div>
                            <div className="relative h-[400px] w-full bg-slate-900">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="p-6 bg-white flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500">Zoom</span>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowCropModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleCropSave} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">
                                        Save & Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
