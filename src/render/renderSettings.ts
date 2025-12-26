const options = ["1. Тип отрисовки", "Назад"];
let selected = 0;

const renderSettings = (): Promise<number> => {
    return new Promise((resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdout.write("\x1b[?25l"); 

        const render = () => {
            process.stdout.write("\x1b[H");

            console.log("Данное приложение проигрывает указанный видеофайл в консоли\n");
            console.log("Для выбора опций используйте ↑ / ↓ + Enter\n");
            console.log("Настройки:");

            for (let i = 0; i < options.length; i++) {
                if (i === selected) {
                    console.log(`\x1b[32m> ${options[i]}\x1b[0m`);
                } else {
                    console.log(`  ${options[i]}`);
                }
            }
        };

        render();

        const onKeyPress = (key: string) => {
            if (key === "\u0003") { // Ctrl+C
                process.stdout.write("\x1b[?25h");
                process.exit();
            }

            if (key === "\u001b[A") { // ↑
                selected = (selected - 1 + options.length) % options.length;
            } else if (key === "\u001b[B") { // ↓
                selected = (selected + 1) % options.length;
            } else if (key === "\r") { // Enter
                cleanup();
                resolve(selected);
                return;
            }

            render();
        };

        const cleanup = () => {
            process.stdin.off("data", onKeyPress);
            process.stdout.write("\x1b[?25h"); // показать курсор
            process.stdin.setRawMode(false);
        };

        process.stdin.on("data", onKeyPress);
    });
};

export default renderSettings;