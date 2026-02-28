'use client';

import Image from "next/image";
import { ThemeToggle } from "./components/themeSwith";

import ThreeDotsMenu from "./components/page/headerDot";
import { processVideo } from './serverScripts/text_url';
import { useState, useRef } from 'react';


export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [isCopy, setIsCopy] = useState('Kopiuj')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    setText(''); // Очищаем текст перед новым поиском
    try {
      const result = await processVideo(formData);
      if (result.text) setText(result.text);
      if (result.error) alert(result.error);
    } catch (err) {
      alert("Ошибка сети1");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async () => {
    const el = textAreaRef.current;
    setIsCopy('Skopiowano!')
    if (!el) return;

    const content = el.value;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      ((navigator as any).platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 2. Jeśli to iOS, wymuszamy Toast od razu (poprawia UX)
    if (isIOS) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    // 1. Сначала пробуем современный способ (требует HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(content);
        return;
      } catch (err) {
        console.warn("Navigator API не сработал, пробуем старый метод...");
      }
    }


    try {
      el.select();
      el.setSelectionRange(0, 99999); // Важно для iOS

      // Используем кастинг типов для TypeScript, чтобы убрать предупреждение
      (document as any).execCommand('copy');

      // Снимаем выделение, чтобы не пугать пользователя
      window.getSelection()?.removeAllRanges();
      el.blur();

    } catch (err) {
      console.error("Оба метода копирования не удались", err);
      alert("Не удалось скопировать. Пожалуйста, сделайте это вручную.");
    }
  };



  return (
    <div className="min-h-screen w-full">

      <header className="flex justify-between items-center px-3 bg-orange-500 py-4">
        <h1 className=" text-2xl font-bold text-center">
          Ekstraktor tekstu z wideo
        </h1>
        <ThreeDotsMenu />
      </header>
      <div className="w-screen py-6 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
          TikTok / Facebook / YouTube Видео
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            name="url"
            type="url"
            placeholder="Wklej link do wideo..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-all"
          >
            {loading ? (
              <>
                {/* ИСПРАВЛЕННЫЙ SVG: добавлен полный адрес xmlns */}
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Przetwarzanie wideo...
              </>
            ) : (
              'Pobierz tekst z wideo'
            )}
          </button>
        </form>
      </div>



      {/* Блок результата */}
      {text && (
        <div className="px-4">
          <div className="mt-10 p-4 rounded-xl shadow-lg  border-blue-800 border-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl">Tekst z wideo:</h2>
              <button
                onClick={copyToClipboard}

                className="text-2xl text-blue-500 hover:underline"
              >
                {isCopy}
              </button>
            </div>
            <textarea
              ref={textAreaRef}
              defaultValue={text}
              className="text-gray-800 w-full h-80 p-4 bg-gray-300 text-2xl"></textarea>
          </div>
        </div>




      )}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full shadow-xl">
          Tekst skopiowany!
        </div>
      )}

    </div>
  );
}
