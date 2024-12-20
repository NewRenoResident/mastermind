import "./server";

async function compileForPlatform(target, outfile) {
  console.log(`Compiling for ${target}...`);

  const proc = Bun.spawn([
    "bun",
    "build",
    "./compiler.js",
    "--compile",
    "--target",
    target,
    "--outfile",
    outfile,
  ]);

  const output = await new Response(proc.stdout).text();
  const error = await new Response(proc.stderr).text();

  console.log(`Compilation output for ${target}:`);
  console.log(output);

  if (error) {
    console.error(`Compilation errors for ${target}:`);
    console.error(error);
  } else {
    console.log(`Compilation successful for ${target}!`);
  }

  await proc.exited;
}

export async function compileGame() {
  // Создаем директорию для исполняемых файлов, если она не существует
  const executableDir = "executable";
  try {
    await Bun.write(executableDir, "");
  } catch (error) {
    console.log("Executable directory already exists");
  }

  const platforms = [
    {
      target: "bun-linux-x64",
      outfile: "executable/mastermind-linux-x64",
    },
    {
      target: "bun-linux-arm64",
      outfile: "executable/mastermind-linux-arm64",
    },
    {
      target: "bun-windows-x64",
      outfile: "executable/mastermind-windows-x64",
    },
    {
      target: "bun-darwin-arm64",
      outfile: "executable/mastermind-darwin-arm64",
    },
    {
      target: "bun-darwin-x64",
      outfile: "executable/mastermind-darwin-x64",
    },
  ];

  for (const platform of platforms) {
    await compileForPlatform(platform.target, platform.outfile);
  }

  console.log("Compilation for all platforms completed!");
}

// Компилируем игру при запуске
await compileGame();
