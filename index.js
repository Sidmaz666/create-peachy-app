#!/usr/bin/env node
/**
 * create-peachy-app
 * ------------------
 * This CLI tool bootstraps a new Peachy app by:
 *   • Checking if the target directory exists and is empty.
 *   • Cloning the boilerplate from https://github.com/Sidmaz666/peachy.
 *   • Setting up directories by removing unnecessary ones (src/app/docs and src/app/blog).
 *   • Setting up package.json:
 *       - "name": uses the project directory basename only.
 *       - "version": "0.0.0"
 *       - "description": ""
 *       - Removing "keywords" and "author"
 *   • Customizing application files:
 *       - Replacing src/index.css with provided Tailwind content.
 *       - Removing unwanted component files from src/app/components.
 *       - Updating src/app/layout.js (removing Header/Footer imports and JSX).
 *       - Overwriting src/app/page.js with new content.
 *   • Setting up version control by removing the existing .git folder and initializing a new git repository.
 *   • Installing dependencies.
 *   • Displaying available npm scripts in a neat box.
 *
 * Usage: npx create-peachy-app <project-directory>
 */

const { exec } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');
const util = require('util');

const chalk = require('chalk').default; // For chalk v5 (ESM-only)
const ora = require('ora').default;     // For ora (ESM-only)
const boxen = require('boxen').default;

const execAsync = util.promisify(exec);

async function main() {
  try {
    // Parse command line arguments.
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error(chalk.red('Usage: create-peachy-app <project-directory>'));
      process.exit(1);
    }
    // Use provided directory path.
    const providedPath = args[0];
    // Extract the project name as the basename.
    const projectName = path.basename(path.resolve(providedPath));
    const targetDir = path.resolve(process.cwd(), providedPath);

    // Check if target directory exists and if it's empty.
    try {
      await fs.access(targetDir);
      const files = await fs.readdir(targetDir);
      if (files.length > 0) {
        console.error(chalk.red(`Error: Directory "${targetDir}" is not empty.`));
        process.exit(1);
      }
    } catch (err) {
      // Directory does not exist. It will be created during clone.
    }

    // Clone repository.
    const cloneSpinner = ora(chalk.cyan('Setting up project...')).start();
    try {
      await execAsync(`git clone https://github.com/Sidmaz666/peachy.git "${targetDir}"`);
      cloneSpinner.succeed(chalk.green('Repository cloned.'));
    } catch (err) {
      cloneSpinner.fail(chalk.red('Project setup failed: Cloning repository failed.'));
      process.exit(1);
    }

    // Setting up directories: remove docs and blog directories.
    const docsDir = path.join(targetDir, 'src', 'app', 'docs');
    const blogDir = path.join(targetDir, 'src', 'app', 'blog');
    const dirSpinner = ora(chalk.cyan('Setting up directories...')).start();
    try {
      await fs.rm(docsDir, { recursive: true, force: true });
      await fs.rm(blogDir, { recursive: true, force: true });
      dirSpinner.succeed(chalk.green('Directories set up.'));
    } catch (err) {
      dirSpinner.warn(chalk.yellow('Some issues encountered during directory setup.'));
    }

    // Setting up package.json.
    const pkgPath = path.join(targetDir, 'package.json');
    const pkgSpinner = ora(chalk.cyan('Setting up package.json...')).start();
    try {
      const pkgData = await fs.readFile(pkgPath, 'utf-8');
      const pkgJson = JSON.parse(pkgData);

      // Set "name" to the extracted project name.
      pkgJson.name = projectName;
      // Remove unwanted fields.
      delete pkgJson.keywords;
      delete pkgJson.author;
      // Set version and description.
      pkgJson.version = "0.0.0";
      pkgJson.description = "";

      await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2), 'utf-8');
      pkgSpinner.succeed(chalk.green('package.json set up.'));
    } catch (err) {
      pkgSpinner.fail(chalk.red('Failed to set up package.json.'));
      process.exit(1);
    }

    // Customizing application files.
    const customizeSpinner = ora(chalk.cyan('Customizing application files...')).start();

    // Replace content of src/index.css.
    const cssPath = path.join(targetDir, 'src', 'index.css');
    const newCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 30 33% 99%;
    --foreground: 20 14.3% 4.1%;
    
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    
    --primary: 24 100% 50%;
    --primary-foreground: 60 9.1% 97.8%;
    
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 24 100% 50%;
    
    --radius: 0.75rem;
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 60 9.1% 97.8%;
    
    --card: 20 14.3% 4.1%;
    --card-foreground: 60 9.1% 97.8%;
    
    --popover: 20 14.3% 4.1%;
    --popover-foreground: 60 9.1% 97.8%;
    
    --primary: 24 100% 50%;
    --primary-foreground: 60 9.1% 97.8%;
    
    --secondary: 12 6.5% 15.1%;
    --secondary-foreground: 60 9.1% 97.8%;
    
    --muted: 12 6.5% 15.1%;
    --muted-foreground: 24 5.4% 63.9%;
    
    --accent: 12 6.5% 15.1%;
    --accent-foreground: 60 9.1% 97.8%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 60 9.1% 97.8%;
    
    --border: 12 6.5% 15.1%;
    --input: 12 6.5% 15.1%;
    --ring: 24 100% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "ss01", "ss02", "cv01", "cv02", "cv03";
  }

  .glass {
    @apply backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl;
  }

  .dark .glass {
    @apply backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl;
  }

  .grid-matrix {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }

  .grid-bg {
    position: relative;
    height: 100%;
    width: 100%;
    background-image: 
      linear-gradient(to right, rgba(255, 107, 61, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 107, 61, 0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0;
    mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0.4) 50%, transparent 85%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0.4) 50%, transparent 85%);
  }

  .dark .grid-bg {
    background-image: 
      linear-gradient(to right, rgba(255, 107, 61, 0.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 107, 61, 0.12) 1px, transparent 1px);
  }

  .grid-horizontal-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.7;
  }
  
  .grid-horizontal-lines::before {
    content: "";
    position: absolute;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent 5%, rgba(255, 107, 61, 0.7) 50%, transparent 95%);
    animation: grid-horizontal-sweep 8s linear infinite;
    top: 80px;
  }
  
  .grid-horizontal-lines::after {
    content: "";
    position: absolute;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent 5%, rgba(255, 107, 61, 0.7) 50%, transparent 95%);
    animation: grid-horizontal-sweep 10s linear infinite 4s;
    top: 200px;
  }

  .grid-vertical-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.7;
  }
  
  .grid-vertical-lines::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 5%, rgba(255, 107, 61, 0.7) 50%, transparent 95%);
    animation: grid-vertical-sweep 9s linear infinite 2s;
    left: 120px;
  }
  
  .grid-vertical-lines::after {
    content: "";
    position: absolute;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 5%, rgba(255, 107, 61, 0.7) 50%, transparent 95%);
    animation: grid-vertical-sweep 12s linear infinite 5s;
    left: 240px;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(90deg, rgba(255, 140, 100, 1) 0%, rgba(255, 107, 61, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
}

@keyframes grid-horizontal-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes grid-vertical-sweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background-color: hsl(var(--background));
}

::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--background));
}

::-webkit-scrollbar-thumb:hover {
  filter: brightness(85%);
}

* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary)) hsl(var(--background));
}

#root {
  margin: 0 auto;
  width: 100%;
}

a, button {
  cursor: pointer;
}`;
    try {
      await fs.writeFile(cssPath, newCssContent, 'utf-8');
    } catch (err) {
      // Continue even if CSS replacement fails.
    }

    // Remove specific component files.
    const componentsDir = path.join(targetDir, 'src', 'components');
    const filesToRemove = ['CodeBlock.js', 'Footer.js', 'Header.js', 'Peach3dModel.js'];
    for (const file of filesToRemove) {
      const filePath = path.join(componentsDir, file);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        // Ignore if the file doesn't exist.
      }
    }

    // Update src/app/layout.js: remove Header/Footer imports and JSX.
    const layoutPath = path.join(targetDir, 'src', 'app', 'layout.js');
    try {
      let layoutContent = await fs.readFile(layoutPath, 'utf-8');
      // Remove import lines for Header or Footer.
      layoutContent = layoutContent
        .split('\n')
        .filter(line => !/import\s+.*(Header|Footer)/.test(line))
        .join('\n');
      // Remove <Header/> and <Footer/> occurrences from the JSX.
      layoutContent = layoutContent.replace(/<Header\s*\/>/g, '');
      layoutContent = layoutContent.replace(/<Footer\s*\/>/g, '');
      await fs.writeFile(layoutPath, layoutContent, 'utf-8');
    } catch (err) {
      // If layout.js doesn't exist or fails, skip.
    }

    // Overwrite src/app/page.js with provided content.
    const pagePath = path.join(targetDir, 'src', 'app', 'page.js');
    const newPageContent = `import { Peachy, useState } from "@peach/component";
import Button from "@components/Button";
import PeachyLogo from "@components/PeachyLogo";
import ThemeToggle from "@components/ThemeToggle";

export default function Index(){
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid-matrix">
        <div className="grid-bg"></div>
        <div className="grid-horizontal-lines"></div>
        <div className="grid-vertical-lines"></div>
      </div>

      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <PeachyLogo />
          <span className="text-xl font-semibold">peachy</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://docs.example.com" className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors">
            <span>Docs</span>
          </a>
          <a href="https://github.com/example/peachy" className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors">
            <span>GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pb-20 relative z-10">
        <section className="py-20 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-gradient">Peachy</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            A simple starter with an increment button
          </p>

          <div className="flex items-center space-x-4">
            <Button onClick={handleIncrement}>
              Increment
            </Button>
            <span className="text-2xl font-bold">Count: {count}</span>
          </div>
        </section>
      </main>
    </div>
  );
};
`;
    try {
      await fs.writeFile(pagePath, newPageContent, 'utf-8');
    } catch (err) {
      // If page.js update fails, continue.
    }
    customizeSpinner.succeed(chalk.green('Application files customized.'));

    // Setting up version control: remove .git and reinitialize.
    const gitDir = path.join(targetDir, '.git');
    const gitSpinner = ora(chalk.cyan('Setting up version control...')).start();
    try {
      await fs.rm(gitDir, { recursive: true, force: true });
      await execAsync('git init', { cwd: targetDir });
      gitSpinner.succeed(chalk.green('Version control set up.'));
    } catch (err) {
      gitSpinner.fail(chalk.red('Failed to set up version control.'));
      process.exit(1);
    }

    // Installing dependencies.
    const npmSpinner = ora(chalk.cyan('Installing dependencies...')).start();
    try {
      await execAsync('npm install', { cwd: targetDir });
      npmSpinner.succeed(chalk.green('Dependencies installed.'));
    } catch (err) {
      npmSpinner.fail(chalk.red('Dependency installation failed.'));
      process.exit(1);
    }

    // Finalizing setup and fetching available npm scripts.
    const finalizeSpinner = ora(chalk.cyan('Finalizing setup...')).start();
    let availableScripts = '';
    try {
      const pkgData = await fs.readFile(pkgPath, 'utf-8');
      const pkgJson = JSON.parse(pkgData);
      const scripts = pkgJson.scripts;
      if (scripts && Object.keys(scripts).length > 0) {
        availableScripts = Object.entries(scripts)
          .map(([script, command]) => `npm run ${script}  ->  ${command}`)
          .join('\n');
      } else {
        availableScripts = 'No npm scripts available.';
      }
      finalizeSpinner.succeed(chalk.green('Setup finalized.'));
    } catch (err) {
      finalizeSpinner.warn(chalk.yellow('Final setup encountered issues.'));
      availableScripts = 'Unable to fetch npm scripts.';
    }

    console.log(chalk.green.bold('Project setup complete! Happy Coding!'));
    // Display available npm scripts in a square box.
    const boxedScripts = boxen(chalk.cyan.bold(availableScripts), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    });
    console.log(boxedScripts);
  } catch (err) {
    console.error(chalk.red('Unexpected error:'), err);
    process.exit(1);
  }
}

main();
