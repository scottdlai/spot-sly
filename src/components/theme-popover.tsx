import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ReactNode } from 'react';
import type { Theme } from '@/hooks/useTheme';

interface ThemePopoverProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  trigger: ReactNode;
}

// Map theme values to display names
const THEME_NAMES: Record<Theme, string> = {
  'default': 'Default',
  'forest': 'Forest',
  'mcdonalds': 'McDonalds',
  'oat-milk': 'Oat Milk',
  'matcha': 'Matcha',
  'lemon-black-tea': 'Lemon Black Tea',
  'kare-raisu': 'Kare Raisu',
};

const THEMES: Theme[] = [
  'default',
  'forest',
  'mcdonalds',
  'oat-milk',
  'matcha',
  'lemon-black-tea',
  'kare-raisu',
];

export function ThemePopover({ theme, onThemeChange, trigger }: ThemePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        sideOffset={8}
        className="bg-surface-med border-none rounded-lg w-fit shadow-2xl"
      >
        <div className="space-y-4">
          <p className="text-on-subtle text-sm font-medium px-1">Select theme</p>

          <div className="flex flex-col gap-1.5 min-w-[180px]">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption}
                type="button"
                onClick={() => onThemeChange(themeOption)}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  theme === themeOption
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-surface-hi/50 hover:bg-surface-hi text-on hover:text-white'
                }`}
              >
                {THEME_NAMES[themeOption]}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
