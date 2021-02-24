import { Util } from "../dts/factory.d.ts";
import { colors } from "./deps.ts";

// compile typescript code to string javascrit code
export const TsCompile: Util.TSC = async function (source, path, cut = true) {
  const temp = `./${Math.random().toString().replace(".", "")}.ts`;
  try {
    const file = await Deno.create(temp);
    const encoder = new TextEncoder();

    await file.write(encoder.encode(source));

    const { files } = await Deno.emit(temp, {
      bundle: undefined,
      check: true,
      compilerOptions: { strict: false },
    });

    // filter javascript output
    const [script] = Object.entries(files).flat().filter((chunk) =>
      !chunk.includes("file:///")
    );

    await Deno.remove(temp, { recursive: true });

    return (cut ? script.substring(3, script.length - 4) : script);

    // return files;
  } catch (error) {
    await Deno.remove(temp, { recursive: true });
    console.log(error);
    throw new Error(
      colors.red(
        `Typescript compilation Error in ${colors.yellow(path)}`,
      ),
    );
  }
};
