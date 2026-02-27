import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Baymax from "./Baymax";

const Login = () => {
    const navigate = useNavigate();

    // User specific state
    const [farmerId, setFarmerId] = useState("");
    const [password, setPassword] = useState("");

    const handleUserLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Mock Farmer Login Request:", { id: farmerId, pass: password });

        // Mock successful login immediately since there's no backend/firebase
        localStorage.setItem('userFarmerId', farmerId);
        navigate("/home");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B2525] p-4 font-sans text-white">
            <div className="bg-[#164040] w-full max-w-[420px] p-10 rounded-[2rem] shadow-2xl relative border border-white/10">

                {/* Baymax Animation */}
                <Baymax />

                <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
                    Farmer Login
                </h2>
                <p className="text-center text-white/40 text-sm mb-8">
                    Welcome to Swasthya Parivar
                </p>

                {/* USER LOGIN FORM */}
                <form onSubmit={handleUserLogin} className="space-y-5">
                    <div className="space-y-2">
                        <input
                            id="field-hid-secure"
                            name="field-hid-secure"
                            type="text"
                            placeholder="Farmer ID (Ex: HH-1234)"
                            className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#D1F072] transition-colors"
                            value={farmerId}
                            onChange={(e) => setFarmerId(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            id="field-hpass-secure"
                            name="field-hpass-secure"
                            type="password"
                            placeholder="Password"
                            className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#D1F072] transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#D1F072] text-[#0B2525] py-4 rounded-xl font-bold text-lg hover:bg-[#c1e062] hover:-translate-y-0.5 transition-all shadow-lg active:scale-95"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
