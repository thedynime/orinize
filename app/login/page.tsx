import type { Metadata } from 'next';
import LoginExperience from './view';
import '../landing.css';
import './style.css';
export const metadata: Metadata = { title: 'Continue with Dynime — Orinize', description: 'Connect your next conversation with Orinize through Dynime.' };
export default function LoginPage() { return <LoginExperience/>; }
