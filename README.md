# Microsoft SQL Server Statistics IO and Time Parser
Sometimes reading SQL Server output from Statistics IO and Statistics Time can be a total drag. This page will help with that. Just paste in the output of Statistics IO and/or Statistics Time and press Parse. Your output will be formatted and totaled. Enjoy.

Useful links:
 - [SET STATISTICS IO (Transact-SQL)](https://msdn.microsoft.com/en-us/library/ms184361.aspx)
 - [SET STATISTICS TIME (Transact-SQL)](https://msdn.microsoft.com/en-us/library/ms190287.aspx)

## [Example](/Example.md)

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/StatisticsParser.git
cd StatisticsParser
```

2. Install dependencies:
```bash
npm install
```

This will install all required packages including:
- Vite (build tool)
- Luxon (date/time handling)
- DataTables (table display)
- Bootstrap (UI framework)
- SASS (CSS preprocessing)

### Development

1. Start the development server:
```bash
npm run dev
```

This will start Vite's development server with hot module replacement (HMR) enabled. The application will be available at `http://localhost:5173` by default.

2. Make your changes to the code. The development server will automatically reload when you save changes.

### Building for Production

1. Create a production build:
```bash
npm run build
```

This will create an optimized production build in the `dist` directory.

2. Preview the production build locally:
```bash
npm run preview
```

### Project Structure

```
StatisticsParser/
├── src/
│   ├── assets/
│   │   ├── js/
│   │   │   ├── modules/
│   │   │   │   ├── parser.js      # Core parsing logic
│   │   │   │   ├── language.js    # Language handling
│   │   │   │   └── ui.js          # UI components
│   │   │   ├── main.js            # Main application entry
│   │   │   └── statisticsparser.js # Display logic
│   │   ├── css/
│   │   │   └── styles.scss        # Main styles
│   │   └── data/
│   │       └── languagetext-*.json # Language files
│   └── index.html                 # Main HTML file
├── dist/                          # Production build output
├── package.json                   # Project configuration
└── vite.config.js                # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.
