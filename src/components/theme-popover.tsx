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
        className="bg-surface-med border-none rounded-lg w-fit !pb-2"
      >
        <div className="space-y-3">
          <p className="text-on-subtle text-sm font-medium px-1">Select theme</p>

          <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
            {THEMES.map((themeOption) => (
              <div key={themeOption} data-theme={themeOption}>
                <button
                  type="button"
                  onClick={() => onThemeChange(themeOption)}
                  className={`px-2 w-full text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${theme === themeOption
                    ? 'bg-surface-low text-on font-medium outline outline-2 outline-primary border-box'
                    : 'bg-surface-low text-on'
                    }`}
                >
                  <div className="flex flex-col gap-1 w-full items-center py-2">
                    <span className='large-title'><span className='text-on'>A</span><span className='text-primary'>b</span>c</span>
                    <span className='text-sm text-on-subtle text-center'>{THEME_NAMES[themeOption]}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
