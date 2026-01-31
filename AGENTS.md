# AGENTS.MD - Development Guidelines for Habits RPG

> **For AI Coding Agents**: Build commands, code style, and conventions for Habits-RPG.

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `make install` (or `npm install && cd frontend && pnpm install`) |
| Start dev | `make sandbox` (terminal 1) + `make dev` (terminal 2) |
| Build | `make build` (frontend only) |
| Type check | `make typecheck` |
| Deploy | `make deploy` |
| Run tests | `npx ts-node tests/integration/api-test.ts` |
| Seed data | Open browser console → `window.seedService.reseedAll()` |

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, AWS Amplify Gen2, DynamoDB

---

## Code Style & Conventions

### File Naming
- **Components**: PascalCase (`HabitCard.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useSound.ts`, `useUser.ts`)
- **Services**: camelCase (`habit.ts`, `user.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in camelCase files

### Import Order
```typescript
// 1. React & external libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal components/contexts/hooks
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

// 3. Services
import { habitService } from '@/services';

// 4. Utils/constants/types
import { LEVEL_THRESHOLDS } from '@/constants/game';
import type { Habit, User } from '@/types';
```

### TypeScript
```typescript
// ✅ Always use explicit types
interface HabitCardProps {
  habit: HabitDisplayData;
  onToggle: () => void;
  onDelete?: () => Promise<void>;
}

// ✅ Use path aliases
import { Button } from '@/components/ui/button';

// ✅ Import types from shared or @/types
import type { User, Habit, StatType } from '@/types';
// OR: import type { User } from '../../../shared/types';

// ❌ No implicit any
function updateUser(data) { ... }  // Bad
```

### Error Handling
```typescript
// Pattern: Log to console, return null on error
export const userService = {
  async getUser(userId: string): Promise<User | null> {
    const { data, errors } = await client.models.User.get({ userId });
    
    if (errors) {
      console.error('Failed to fetch user:', errors);
      return null;
    }
    
    return data as unknown as User;
  }
};

// In components: Handle nulls gracefully
const user = await userService.getUser(userId);
if (!user) return; // or show error UI
```

### GraphQL Operations
```typescript
import { client } from './graphql';

// Create
const { data, errors } = await client.models.Habit.create({
  habitId: ulid(),
  userId,
  name: 'Morning Exercise',
});

// Read
const { data, errors } = await client.models.User.get({ userId });

// Update
const { data, errors } = await client.models.User.update({ userId, level: newLevel });

// Delete
const { data, errors } = await client.models.Habit.delete({ habitId });

// List with filter
const { data: habits } = await client.models.Habit.list({
  filter: { userId: { eq: userId } }
});
```

### Components
```tsx
// ✅ Functional components with explicit props
export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="game-panel">{/* JSX */}</div>;
}
```

### Styling (Tailwind CSS)
```tsx
// Game UI: amber/slate palette
<div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 
                border-2 border-amber-600/50 rounded-lg shadow-2xl 
                p-6 backdrop-blur-sm">

// Use cn utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  completed && "bg-green-900/40",
  isLoading && "opacity-50"
)} />
```

### Sounds
```typescript
import { useSound } from '@/hooks';

const { playSound } = useSound();
playSound('complete');    // Habit completion
playSound('levelUp');     // Level up
playSound('achievement'); // Achievement unlocked

// Outside components:
import { playSoundGlobal } from '@/hooks';
playSoundGlobal('levelUp');
```

---

## Project Structure

```
habits-rpg/
├── amplify/              # AWS Amplify backend
│   ├── data/            # DynamoDB schema (resource.ts)
│   ├── auth/            # Cognito config
│   └── storage/         # S3 config
├── frontend/src/
│   ├── components/      # UI components
│   │   ├── ui/         # shadcn/ui base
│   │   └── common/     # Shared components
│   ├── contexts/        # React Context (UserContext)
│   ├── hooks/          # Custom hooks (useSound, useUser)
│   ├── pages/          # Page components
│   ├── services/       # API services (habit.ts, user.ts, achievement.ts)
│   ├── lib/            # Utilities
│   ├── constants/      # Constants
│   └── types/          # TypeScript types
├── shared/types/        # Shared types (backend + frontend)
├── tests/integration/   # API integration tests
└── docs/               # Documentation
```

---

## Key Data Models

**Core Types** (in `shared/types/index.ts` and `frontend/src/types/`):
- `User`: Profile, stats (VIT/INT/MND/DEX/CHA/STR), level, XP
- `Habit`: Habit definition (name, category, frequency, streak)
- `HabitRecord`: Completion record (date, XP earned)
- `Achievement`: Achievement definition (master data)
- `UserAchievement`: User's achievement progress
- `JobDefinition`: Job master data
- `UserJob`: User's unlocked/equipped jobs

**Enums:**
- `HabitCategory`: 'exercise' | 'sleep' | 'health' | 'reading' | ...
- `StatType`: 'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR'
- `JobTier`: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster'

---

## Important Notes

1. **Type Safety**: Always use explicit types. Import from `@/types` or `shared/types`.
2. **Error Handling**: Services return `null` on error, log to console.
3. **GraphQL**: Use `client.models.<Model>.<operation>()`. Always check for `errors`.
4. **Schema Changes**: Modify `amplify/data/resource.ts`, then restart sandbox.
5. **No Linters**: No ESLint/Prettier config. Follow existing code style.
6. **No Unit Tests**: Only integration tests. Use `npx ts-node tests/integration/api-test.ts`.
7. **Path Alias**: Use `@/` for frontend imports.
8. **Monorepo**: Backend (root), frontend (frontend/), shared (shared/).

---

## GitHub Integration

**When working with GitHub operations (issues, PRs, repository info), use the `github` MCP tools.**

### Available GitHub Operations
```typescript
// Use github to interact with the repository
use github to list open issues
use github to create a new issue titled "Feature request"
use github to show pull requests
use github to get repository information
use github to view recent commits
```

### Examples
```
Show me all open issues in this repository. use github
Create a new issue for the bug I just found. use github
List all pull requests that need review. use github
```

The GitHub MCP server is automatically enabled in OpenCode and provides seamless integration with this repository.

---

## Documentation

- `README.md` - Project overview, setup
- `docs/frontend/GUIDELINES.md` - React patterns
- `docs/testing/README.md` - Test execution
- `docs/JOB_CREATION_GUIDE.md` - Add jobs/achievements
- `Makefile` - All available commands
