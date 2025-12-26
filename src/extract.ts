import ffmpeg from "fluent-ffmpeg";
import { createRequire } from "node:module";
import path from "path";


const require = createRequire(import.meta.url);
const ffmpegPath: string | null = require("ffmpeg-static");

const extractFrames = async (videoPath: string, outputDirPath: string): Promise<boolean> => {
    if(ffmpegPath){
        ffmpeg.setFfmpegPath(ffmpegPath)

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .output(outputDirPath)
                .outputOptions("-vf fps=15")
                .on("end", () => resolve(true))
                .on("error", () => reject(false))
                .run();        
        })
    } else {
        console.log("Критическая ошибка: модуль обработки видео не найден!");

        return new Promise(() => false);
    }
}

export default extractFrames;