# DSA Practice Questions Website

A professional, elegant DSA (Data Structures and Algorithms) questions website for Training and Placement Cell. This static website displays curated programming problems from LeetCode with advanced filtering and search capabilities.

## Features

- 📚 **Curated Question Bank** - DSA problems from LeetCode with company tags
- 🔍 **Debounced Search** - Real-time search with 300ms debounce for better performance
- 🏷️ **Multiple Topics** - Questions tagged with multiple relevant topics
- 📊 **Advanced Filtering** - Filter by difficulty level (Easy/Medium/Hard) and topic
- 🎨 **Clean UI** - Professional design without gradients, inspired by modern placement portals
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Loading** - Optimized static site built with Vite and React

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling (no gradients, elegant design)
- **Vite** - Build tool and dev server
- **CSV** - Simple data management

## Getting Started

### Prerequisites

- Node.js 22+ installed
- npm 10+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Adding Questions

Questions are stored in `public/questions.csv`. To add new questions:

1. Open `public/questions.csv`
2. Add a new row with the following format:

```csv
id,title,topics,difficulty,leetcode_url,company_tags
26,Your Question Title,Topic1|Topic2|Topic3,Easy,https://leetcode.com/problems/your-problem/,Company1|Company2|Company3
```

### CSV Format

- **id**: Unique question number
- **title**: Question title
- **topics**: Pipe-separated list of topics (e.g., `Array|Hash Table|String`)
- **difficulty**: One of `Easy`, `Medium`, or `Hard`
- **leetcode_url**: Full LeetCode problem URL
- **company_tags**: Pipe-separated list of companies (e.g., `Amazon|Google|Microsoft`)

### Example Entry

```csv
26,Valid Sudoku,Array|Hash Table|Matrix,Medium,https://leetcode.com/problems/valid-sudoku/,Amazon|Apple|Google
```

## Project Structure

```
DsaCsvWebsite/
├── public/
│   ├── questions.csv          # Question data
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Site header
│   │   ├── Filters.tsx        # Search and filter controls
│   │   └── QuestionCard.tsx   # Individual question card
│   ├── utils/
│   │   └── csvParser.ts       # CSV parsing logic
│   ├── types.ts               # TypeScript interfaces
│   ├── App.tsx                # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Tailwind CSS imports
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Project dependencies
```

## Features in Detail

### Debounced Search
Search input has a 300ms debounce to reduce unnecessary filtering operations while typing.

### Multi-Topic Filtering
Each question can have multiple topics. When filtering by topic, questions matching any of their topics will be displayed.

### Difficulty Badges
- 🟢 **Easy** - Green badge
- 🟡 **Medium** - Yellow badge
- 🔴 **Hard** - Red badge

### Company Tags
Shows which companies have asked each question in interviews.

## Customization

### Change Colors

Edit the CSS module files:
- `src/components/QuestionCard.module.css` - Badge colors and card styling
- `src/components/Header.module.css` - Header appearance
- `src/components/Filters.module.css` - Filter controls styling
- `src/App.module.css` - Layout and grid styling

### Modify Colors

Edit CSS files to change badge colors and styling:

**For difficulty badges** (`src/components/QuestionCard.module.css`):
```css
.badgeEasy {
  background-color: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}
```

## Performance

- **Debounced Search**: Prevents excessive re-renders during typing
- **useMemo Optimization**: Filtered results are cached until dependencies change
- **Static CSV Loading**: Questions loaded once on mount
- **Lazy Rendering**: Only visible content is processed

## License

This project is created for Training and Placement Cell use.

## Support

For issues or questions, please contact your Training and Placement Cell coordinator.
