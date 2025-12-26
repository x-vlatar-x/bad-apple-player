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
        // let index = 0;
        // let output = "";

        // for (let y = 0; y < params.rows * 2; y += 2) {
        //     for (let x = 0; x < params.columns; x++) {
        //         const i1 = (y * params.columns + x) * 3;
        //         const i2 = ((y + 1) * params.columns + x) * 3;

        //         const r1 = data[i1];
        //         const g1 = data[i1 + 1];
        //         const b1 = data[i1 + 2];

        //         const r2 = data[i2];
        //         const g2 = data[i2 + 1];
        //         const b2 = data[i2 + 2];

        //         output += `\x1b[38;2;${r1};${g1};${b1}m\x1b[48;2;${r2};${g2};${b2}m▀`;
        //     }

        //     output += "\x1b[0m\n";
        // }

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