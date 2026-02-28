"use client";

import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "../themeSwith";
import {Ellipsis} from "lucide-react";

export default function ThreeDotsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Кнопка три точки */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Ellipsis className="w-10 h-10 text-gray-600" />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-6 mt-2 w-68 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button className="block w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100">
              Редактировать
            </button>
            <button className="block w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100">
              Поделиться
            </button>
            <button className="block w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100"
              onClick={() => location.href = '/settings'}
            >
              Settings
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}
