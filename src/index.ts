import readline from "node:readline/promises";
import { createRequire } from "node:module";
import path from "path";
import fs from "fs"
import extractFrames from "./extract.js";
import sleep from "./sleep.js";
import renderFrame from "./render/renderFrame.js";
import renderMenu from "./render/renderMenu.js";
import renderSettings from "./render/renderSettings.js";
import renderColors from "./render/renderColors.js";

const require = createRequire(import.meta.url);
const ffmpegPath: string | null = require("ffmpeg-static");

const columns = process.stdout.columns ?? 80;
const rows = process.stdout.rows ?? 40;

const framesDirPath = path.join(process.cwd(), "frames");

if(fs.existsSync(framesDirPath)){
    fs.rmSync(framesDirPath, {force: true, recursive: true})
}
fs.mkdirSync(framesDirPath)

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

let colorRendering = false;

do {
    console.clear()

    let choiceMenuOption = await renderMenu();

    switch(choiceMenuOption){
        case 0: {
            let videoPath;
            
            do {
                console.clear();
                console.log("Данное приложение проигрывает указанный видеофайл в консоли\n");
                console.log("Для выхода из режима запуска напишите Выход\n");
                videoPath = await rl.question("Введите путь к видео: ");

                if(fs.existsSync(videoPath)){
                    process.stdout.write("\x1b[?25l");

                    const fps = 20;
                    const frameTime = 1000 / fps;

                    if(await extractFrames(videoPath, path.join(framesDirPath, "frame-%05d.png"))){
                        const files = fs.readdirSync(framesDirPath);

                        for(const file of files){
                            const frameStart = Date.now();

                            await renderFrame(path.join(framesDirPath, file), {columns, rows, colorRendering})
                        
                            const delta = Date.now() - frameStart;
                            const delay = Math.max(0, frameTime - delta);

                            await sleep(delay);

                            fs.unlinkSync(path.join(framesDirPath, file))
                        }

                        console.clear();
                        process.stdout.write("\x1b[?25h");
                    }
                    break;
                }
            } while(videoPath !== "Выход" && !fs.existsSync(videoPath))
            break;
        }
        case 1: {
            let choiceSettingsOption = 0;
            do {
                console.clear();
                choiceSettingsOption = await renderSettings();

                switch(choiceSettingsOption){
                    case 0: {
                        console.clear();
                        let choiceColorOption = await renderColors(colorRendering);
                        if(choiceColorOption === 0 || choiceColorOption === 1){
                            colorRendering = choiceColorOption === 0 ? true : false;
                        }
                        break;
                    }
                    case 1:
                    default: {
                        break;
                    }
                }
            } while(choiceSettingsOption !== 1);
            choiceSettingsOption = 0;
            break;
        }
        case 2:
        default: {
            process.exit()
            break;
        }
    }

    choiceMenuOption = 0;
} while(true);
