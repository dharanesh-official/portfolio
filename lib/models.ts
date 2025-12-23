import mongoose, { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const PortfolioSchema = new Schema({
    personal: {
        name: String,
        role: String,
        tagline: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        image: String, // Base64 string for the profile image
        social: {
            github: String,
            linkedin: String
        }
    },
    education: [{
        degree: String,
        period: String,
        school: String,
        details: String
    }],
    skills: [String],
    achievements: [String],
    projects: [{
        title: String,
        description: String,
        tags: [String]
    }]
}, { timestamps: true });

export const Admin = models.Admin || model('Admin', AdminSchema);
export const Portfolio = models.Portfolio || model('Portfolio', PortfolioSchema);
