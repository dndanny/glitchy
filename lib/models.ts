import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  name: { type: String, required: true },
}, { timestamps: true });

const FileSchema = new Schema({
  name: { type: String, required: true },
  language: { type: String, required: true }, 
  content: { type: String, default: '' },
});

const ProjectSchema = new Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Awesome Project' },
  files: [FileSchema],
}, { timestamps: true });

export const User = models.User || model('User', UserSchema, 'glitch_users');
export const Project = models.Project || model('Project', ProjectSchema, 'glitch_projects');