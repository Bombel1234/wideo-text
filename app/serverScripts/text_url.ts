'use server'

import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processVideo(formData: FormData) {
  const url = formData.get('url') as string;
  const tempDir = os.tmpdir();
  const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);

  try {
    console.log('Начинаю скачивание аудио через ytdl-core...');

    // 1. Скачивание аудио потока вместо execSync
    await new Promise((resolve:any, reject:any) => {
      const stream = ytdl(url, { 
        filter: 'audioonly', 
        quality: 'highestaudio' 
      });

      const fileStream = fs.createWriteStream(audioPath);
      stream.pipe(fileStream);

      fileStream.on('finish', () => resolve());
      fileStream.on('error', (err) => reject(err));
      stream.on('error', (err) => reject(err));

    });

    if (!fs.existsSync(audioPath)) {
      throw new Error('Файл не был создан.');
    }

    console.log('Скачивание завершено. Отправка в Groq...');

    // 2. Транскрибация через Groq
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    // 3. Удаление временного файла
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    return { text: transcription.text };

  } catch (error: any) {
    console.error('Ошибка процесса:', error.message);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    
    // Если Vercel прервет выполнение по тайм-ауту (10-15 сек)
    if (error.message.includes('timeout')) {
      return { error: "Видео слишком длинное для бесплатного тарифа Vercel" };
    }
    
    return { error: `Ошибка: ${error.message}` };
  }
}
