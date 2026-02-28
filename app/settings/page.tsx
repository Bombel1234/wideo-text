'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/settings/themeSwith';
import { useTheme } from 'next-themes';
// let storedTheme = localStorage.getItem('theme');


export default function SettingsPage() {
    // const [theme, setTheme] = useState('light');
    const { theme, resolvedTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-bold">Ustawienia</h1>
                <p className="text-gray-500 text-sm">Zarządzaj swoją aplikacją</p>
            </header>

            <div className="space-y-6">
                {/* Sekcja: Ogólne */}
                <section className="p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Ogólne</h2>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium">Motyw</p>
                            {/* <p className="text-xs">{`Aktualny motyw: ${storedTheme}`}</p> */}
                        </div>
                        <p className="text-xs text-gray-500">
                            {`Aktualny motyw: ${theme === 'system' ? `Systemowy (${systemTheme})` : theme}`}
                        </p>
                        <ThemeToggle />
                    </div>
                </section>



                {/* Przyciski akcji */}
                <div className="flex justify-end gap-3 pt-4 text-black">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        onClick={()=>window.location.href ='/'}
                    >
                        Anuluj
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Zapisz zmiany
                    </button>
                </div>
            </div>
        </div>
    );
}
