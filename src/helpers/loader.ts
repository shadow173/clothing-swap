import fastGlob from "fast-glob";
import { join } from "path";

export const loaderHelper = async <T>(
  source: string,
  root: string
): Promise<{ [path: string]: T }> => {
  const files = await fastGlob(source, {
    cwd: join(__dirname, "../", root),
  });

  const imports: { [path: string]: T } = {};

  for (const file in files) {
    const path = join(__dirname, "../", root, files[file]);
    const module = await import(path);
    imports[files[file]] = module.default as T;
  }

  return imports;
};
