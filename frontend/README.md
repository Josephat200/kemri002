# KEMRI RH Survey Frontend

Modern React + TypeScript frontend for the KEMRI Reproductive Health Survey data collection system.

## Features

✅ **Respondent Management**
- Create, read, update, and delete respondent records
- Comprehensive form with validation
- Search and filter by school or date range

✅ **Modern UI**
- Built with React 18 + TypeScript
- Tailwind CSS for styling
- shadcn/ui components for consistency
- Responsive design for all screen sizes

✅ **Data Validation**
- Client-side validation with Zod schemas
- Real-time error messages
- Type-safe form handling with React Hook Form

✅ **State Management**
- React Query for server state
- Context API for app state
- Alert notifications

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **API**: Axios
- **State**: React Query + Context API
- **Routing**: React Router

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client & services
│   │   ├── client.ts          # Axios instance
│   │   └── respondent.ts      # Respondent endpoints
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AlertContainer.tsx # Alert notifications
│   │   ├── RespondentForm.tsx # Form component
│   │   └── RespondentList.tsx # List component
│   ├── contexts/              # React contexts
│   │   └── AppContext.tsx     # App state
│   ├── layouts/               # Layout components
│   │   └── Layout.tsx         # Main layout
│   ├── lib/                   # Utilities
│   │   ├── constants.ts       # Constants
│   │   ├── utils.ts           # Utility functions
│   │   └── validations.ts     # Zod schemas
│   ├── pages/                 # Page components
│   │   ├── HomePage.tsx
│   │   ├── CreateRespondentPage.tsx
│   │   ├── RespondentsPage.tsx
│   │   └── EditRespondentPage.tsx
│   ├── types/                 # TypeScript types
│   │   ├── api.ts
│   │   └── respondent.ts
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── postcss.config.js
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3000`

### Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Update `.env` if your backend is running on a different URL:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Running Commands

### Development
```bash
npm run dev       # Start dev server with hot reload
```

### Build
```bash
npm run build     # Create production build
npm run preview   # Preview production build locally
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run type-check     # Check TypeScript types
```

## API Integration

### Base URL
The frontend connects to the backend API at:
```
http://localhost:3000/api/v1
```

This is configured in:
- `.env` file (environment variable)
- `src/api/client.ts` (Axios instance)

### Available Endpoints

**Respondents**
- `GET /respondents` - List all
- `POST /respondents` - Create
- `GET /respondents/:id` - Get by ID
- `PUT /respondents/:id` - Update
- `DELETE /respondents/:id` - Delete
- `GET /respondents/school/:schoolName` - Filter by school
- `GET /respondents/stats/date-range` - Date range query
- `GET /respondents/stats/summary` - Statistics

## Usage Guide

### Creating a Respondent

1. Click "Add New Respondent" button
2. Fill in all required fields (marked with *)
3. For optional sections that depend on other fields:
   - "RH Sources" section shows if "Has RH info" is checked
   - "Topics Covered" section shows if "Has RH info" is checked
4. Submit the form

### Viewing Respondents

1. Click "Respondents" in navigation
2. View the list with pagination
3. Use previous/next buttons or page numbers to navigate

### Editing a Respondent

1. Go to Respondents list
2. Click the Edit button (pencil icon)
3. Update fields as needed
4. Submit to save changes

### Deleting a Respondent

1. Go to Respondents list
2. Click the Delete button (trash icon)
3. Confirm deletion

## Form Validation

The form uses Zod schemas for validation. Key validation rules:

- **Age**: 15-19 years (required)
- **Serial Number**: 1-20 characters (required, unique)
- **School Name**: 1-100 characters (required)
- **Boolean Fields**: 0 or 1
- **Range Fields**: Min/max constraints enforced
- **Dates**: Valid date format required

Validation errors appear inline under each field.

## Error Handling

Errors are displayed in alert notifications at the top-right of the screen:
- **Success**: Green notification
- **Error**: Red notification
- **Info**: Blue notification
- **Warning**: Yellow notification

Errors automatically dismiss after 4 seconds.

## State Management

### React Query
Handles server state:
- API calls
- Caching
- Background refetching
- Error handling

### Context API
Handles app state:
- Alert notifications
- Loading states
- Global configuration

## Component Library

### UI Components (shadcn/ui)
- `Button` - Interactive buttons
- `Input` - Text input fields
- `Select` - Dropdown selects
- `Label` - Form labels
- `Card` - Container components

### Custom Components
- `RespondentForm` - Form for creating/editing
- `RespondentList` - Table with pagination
- `AlertContainer` - Alert notifications

## Styling

### Tailwind CSS
Utility-first CSS framework for rapid UI development.

### Color Scheme
- Primary: Blue
- Secondary: Gray
- Accent: Blue
- Destructive: Red

Colors are customized in `tailwind.config.ts` with CSS variables.

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Optimizations
- Code splitting with React Router
- Image lazy loading ready
- API response caching with React Query
- Efficient re-renders with React hooks

### Build Size
- Gzipped: ~80KB
- Main chunk optimized

## Development Tips

### Adding a New Page

1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/layouts/Layout.tsx`

### Adding a New API Endpoint

1. Add function to `src/api/respondent.ts`
2. Define types in `src/types/`
3. Use in components with React Query

### Adding a New Component

1. Create in `src/components/`
2. Export from component directory
3. Use in pages

### Form Validation

1. Update schema in `src/lib/validations.ts`
2. Add validation rule to Zod schema
3. Component automatically validates

## Troubleshooting

### API Connection Error
- Check backend is running on correct port
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Form Validation Error
- Check field constraints in `src/lib/validations.ts`
- Verify data types match backend schema
- Check browser console for validation errors

### Build Error
```bash
npm run build
npm run type-check  # Check for type errors
```

### Module Not Found
```bash
rm -rf node_modules
npm install
npm run dev
```

## Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Environment Variables for Production
Update `.env` with production API URL:
```env
VITE_API_URL=https://api.your-domain.com/api/v1
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint` to check code quality
4. Submit pull request

## License

ISC

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Contact KEMRI team

---

**Happy Coding! 🚀**
