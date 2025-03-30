# create-peachy-app

`create-peachy-app` is a CLI tool designed to bootstrap a new [Peachy](https://github.com/Sidmaz666/peachy) application with ease. It automates the setup process, allowing developers to focus on building their applications rather than configuring boilerplate code.

## Features

- **Directory Validation**: Ensures the target directory exists and is empty before proceeding.
- **Boilerplate Cloning**: Clones the Peachy boilerplate from the official repository.
- **Project Customization**:
  - Removes unnecessary directories (`src/app/docs` and `src/app/blog`).
  - Updates `package.json` with project-specific details.
  - Replaces default styles with Tailwind CSS configurations.
  - Removes unused components and updates key application files.
- **Version Control**: Reinitializes Git for the new project.
- **Dependency Installation**: Installs all required dependencies automatically.
- **Developer-Friendly Output**: Displays available npm scripts in a clean, readable format.

## Prerequisites

- **Node.js**: Version 14.0.0 or higher.
- **Git**: Ensure Git is installed and accessible from the command line.

## Installation

You don't need to install this tool globally. Use it directly with `npx`:

```bash
npx create-peachy-app <project-directory>
```

Replace `<project-directory>` with the desired name of your project folder.

## Usage

1. Run the CLI tool:
   ```bash
   npx create-peachy-app my-peachy-app
   ```
   This will create a new directory named `my-peachy-app` and set up the project inside it.

2. Navigate to the project directory:
   ```bash
   cd my-peachy-app
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

After running the CLI, your project will have the following structure:

```
my-peachy-app/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   ├── index.css
├── package.json
├── .gitignore
└── README.md
```

## Available Scripts

Once the setup is complete, you can use the following npm scripts:

- **`npm start`**: Start the development server.
- **`npm run build`**: Build the application for production.

## Contributing

Contributions are welcome! If you'd like to improve this tool, please fork the repository and submit a pull request.


Happy coding with Peachy! 🌟
