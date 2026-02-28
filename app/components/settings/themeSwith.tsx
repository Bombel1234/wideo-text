"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Выполняется только на клиенте после загрузки страницы
    useEffect(() => {
        setMounted(true)
    }, [])

    // Пока клиент не загрузился (mounted === false), 
    // возвращаем пустую кнопку или заглушку, чтобы сервер и клиент совпали
    if (!mounted) {
        return <button className="px-4 py-2 rounded-md ">Загрузка...</button>
    }

    return (
        <button 
            className="py-2 rounded-md text-3xl"
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                localStorage.setItem('theme', theme === "dark" ? "light" : "dark");
            }}
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    )
}
