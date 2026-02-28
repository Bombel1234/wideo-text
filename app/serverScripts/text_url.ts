'use server'

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import Groq from 'groq-sdk'; // Используем родной SDK

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processVideo(formData: FormData) {
  const url = formData.get('url') as string;
  const tempDir = os.tmpdir();
  const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);

  try {
    // 1. Скачивание (обязательно в кавычках для Windows)
    console.log('Скачивание видео...');
    execSync(`yt-dlp -x --audio-format mp3 --audio-quality 5 --no-check-certificate -o "${audioPath}" "${url}"`);

    if (!fs.existsSync(audioPath)) {
      throw new Error('Не удалось создать аудиофайл. Проверьте ссылку на видео.');
    }

    // 2. Транскрибация через официальный SDK
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    // 3. Удаление файла
    fs.unlinkSync(audioPath);

    return { text: transcription.text };

  } catch (error: any) {
    console.error('--- ДЕТАЛИ ОШИБКИ ---');
    // Выводим конкретную ошибку от Groq, если она есть
    if (error.error?.message) {
      console.error('Groq API Error:', error.error.message);
    } else {
      console.error(error.message);
    }

    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    return { error: `Ошибка: ${error.message}` };
  }
}
