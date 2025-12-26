import sharp from "sharp";

interface Params {
    columns: number;
    rows: number;
    colorRendering: boolean;
}

const colors: string[] = [".", "*", "<", "#", "%", "@"];

const renderFrame = async (framePath: string, params: Params) => {
    const {data, info} = await sharp(framePath)
        .resize(params.columns, params.rows)
        .raw()
        .toBuffer({resolveWithObject: true});

    if(params.colorRendering) {
        let index = 0;
        let output = "";

        for (let i = 0; i < params.rows; i++) {
            for (let j = 0; j < params.columns; j++) {
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                const brightness = Math.min(
                    colors.length - 1,
                    Math.floor((0.22 * r + 0.71 * g + 0.07 * b) / 255 * colors.length)
                );

                output += `\x1b[38;2;${r};${g};${b}m█`;

                index += 3;
            }

            output += "\x1b[0m\n";
        }

        process.stdout.write(output);

        process.stdout.write("\x1b[H");
        process.stdout.write(output);
    } else {
        let index = 0;
        let output = "";

        for (let i = 0; i < params.rows; i++) {
            for (let j = 0; j < params.columns; j++) {
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                const brightness = Math.min(
                    colors.length - 1,
                    Math.floor((0.22 * r + 0.71 * g + 0.07 * b) / 255 * colors.length)
                );

                output += colors[brightness];

                index += 3;
            }
            process.stdout.write("\n");
        }

        process.stdout.write(output);
    }
}

export default renderFrame;