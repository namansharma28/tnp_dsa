# DSA Questions Website - Setup Guide

## ✅ Project Setup Complete!

Your professional DSA questions website for the Training and Placement Cell is ready to use.

## 🚀 Quick Start

### Run Development Server
```bash
npm run dev
```
Then open your browser to the URL shown (usually http://localhost:5173)

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder - ready to deploy!

### Preview Production Build
```bash
npm run preview
```

## 📁 What's Included

### ✨ Features Implemented

1. **Debounced Search (300ms)** - Search by question title or topics without lag
2. **Multiple Topics per Question** - Each question can have multiple relevant topics
3. **Difficulty Filter** - Filter by Easy, Medium, or Hard
4. **Topic Filter** - Filter by specific DSA topics (Array, String, Tree, etc.)
5. **Responsive Design** - Works on all devices
6. **Professional UI** - Clean design, no gradients, elegant and simple
7. **Company Tags** - Shows which companies asked each question
8. **Direct LeetCode Links** - One-click access to solve problems

### 📊 Sample Data

The `public/questions.csv` file contains 25 curated DSA problems with:
- Multiple topics per question (e.g., "Array|Hash Table|Sliding Window")
- Difficulty levels
- Company tags
- Direct LeetCode URLs

### 🎨 Design Highlights

- **No gradients** - Clean, professional solid colors
- **Difficulty badges**:
  - 🟢 Easy - Green
  - 🟡 Medium - Yellow
  - 🔴 Hard - Red
- **Topic tags** - Blue badges for each topic
- **Company tags** - Gray badges showing companies
- **Clean cards** - Professional card layout with hover effects
- **Responsive grid** - 1-4 columns depending on screen size

## 📝 Adding More Questions

Edit `public/questions.csv` and add rows in this format:

```csv
id,title,topics,difficulty,leetcode_url,company_tags
26,Two Sum,Array|Hash Table,Easy,https://leetcode.com/problems/two-sum/,Amazon|Google
```

### CSV Column Definitions

- **id**: Unique number
- **title**: Question title (no commas)
- **topics**: Use `|` to separate multiple topics (e.g., `Array|DFS|BFS`)
- **difficulty**: Must be `Easy`, `Medium`, or `Hard`
- **leetcode_url**: Full LeetCode problem URL
- **company_tags**: Use `|` to separate companies (e.g., `Amazon|Google|Microsoft`)

## 🛠️ Customization

### Change Header Text
Edit `src/components/Header.tsx`:
```typescript
<h1>Your Custom Title</h1>
<p>Your custom description</p>
```

### Modify Colors
Edit `src/components/QuestionCard.tsx` to change badge colors.

### Add More Filters
Edit `src/App.tsx` to add additional filtering logic.

## 📂 Project Structure

```
DsaCsvWebsite/
├── public/
│   ├── questions.csv          ← Your question data
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx         ← Site header
│   │   ├── Filters.tsx        ← Search and filters
│   │   └── QuestionCard.tsx   ← Question card design
│   ├── utils/
│   │   └── csvParser.ts       ← CSV parsing logic
│   ├── types.ts               ← TypeScript types
│   ├── App.tsx                ← Main app logic
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎯 Key Technologies

- **React 19** - Modern UI framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling with no conflicts
- **Vite** - Fast build tool
- **CSV** - Simple data management

## 🚢 Deployment

After running `npm run build`, deploy the `dist/` folder to:
- **GitHub Pages** - Free hosting for static sites
- **Netlify** - Drag and drop deployment
- **Vercel** - One-click deployment
- **Any static hosting** - Just upload the dist folder

### Example: Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist` folder to your repository
3. Enable GitHub Pages in repository settings
4. Point it to the `dist` folder or main branch

## 💡 Tips

1. **Search is debounced** - Waits 300ms after typing stops before filtering
2. **Multiple topics work** - Questions match if ANY of their topics match the filter
3. **Combine filters** - Search + Difficulty + Topic all work together
4. **CSV is simple** - Easy to edit in Excel, Google Sheets, or any text editor
5. **No database needed** - Pure static site, easy to host anywhere

## 🔧 Troubleshooting

### Build fails?
```bash
npm install
npm run build
```

### Blank page?
Check browser console for errors and ensure `questions.csv` is in `public/` folder.

### Questions not showing?
Verify CSV format matches the structure exactly (no extra commas, proper pipe separators).

## 📞 Support

For issues or questions, contact your Training and Placement Cell coordinator.

---

**Built with ❤️ for Training and Placement Cell**
