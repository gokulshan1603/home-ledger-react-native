import {
    AMBER,
    COMMON,
    DARK_DANGER,
    DARK_DANGER_LIGHT,
    DARK_SUCCESS,
    DARK_SUCCESS_LIGHT,
    DARK_WARNING,
    DARK_WARNING_LIGHT,
    GRAY,
    GREEN,
    LIGHT_DANGER,
    LIGHT_SUCCESS,
    LIGHT_WARNING,
    PRIMARY,
    PRIMARY_DARK,
    PRIMARY_LIGHT,
    PRIMARY_MUTED,
    RED,
} from './colors.ts';

const lightTheme = {
    background: GRAY[100],
    secondaryBackground: GRAY[50],
    tertiaryBackground: GRAY[200],
    text: GRAY[900],
    secondaryText: GRAY[700],
    primary: PRIMARY,
    success: LIGHT_SUCCESS,
    danger: LIGHT_DANGER,
    warning: LIGHT_WARNING,
    border: GRAY[300],
    card: COMMON.white,
} as const;

const darkTheme = {
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    tertiaryBackground: '#2C2C2E',
    text: '#FFFFFF',
    secondaryText: 'rgba(235, 235, 245, 0.75)',
    primary: PRIMARY,
    success: DARK_SUCCESS,
    danger: DARK_DANGER,
    warning: DARK_WARNING,
    border: 'rgba(84, 84, 88, 0.32)',
    card: '#141416',
} as const;

export type PaletteColor = {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
};

export type AppPalette = {
    primary: PaletteColor;
    red: PaletteColor;
    green: PaletteColor;
    orange: PaletteColor;
    background: {
        default: string;
        paper: string;
        subtle: string;
        muted: string;
    };
    surface: {
        paper: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        disabled: string;
    };
    border: { subtle: string; default: string; strong: string };
    action: {
        selected: string;
    };
    themeToggle: {
        activeBg: string;
        iconDefault: string;
        iconActive: string;
    };
};

const createPalette = (
    theme: typeof lightTheme | typeof darkTheme,
): AppPalette => {
    const isDark = theme === darkTheme;

    return {
        primary: isDark
            ? {
                  light: theme.primary,
                  main: theme.primary,
                  dark: theme.primary,
                  contrastText: COMMON.white,
              }
            : {
                  light: PRIMARY_LIGHT,
                  main: theme.primary,
                  dark: PRIMARY_DARK,
                  contrastText: COMMON.white,
              },
        red: {
            light: isDark ? DARK_DANGER_LIGHT : RED[50],
            main: theme.danger,
            dark: RED[700],
            contrastText: COMMON.white,
        },
        green: {
            light: isDark ? DARK_SUCCESS_LIGHT : GREEN[50],
            main: theme.success,
            dark: GREEN[700],
            contrastText: COMMON.white,
        },
        orange: {
            light: isDark ? DARK_WARNING_LIGHT : AMBER[50],
            main: theme.warning,
            dark: AMBER[700],
            contrastText: COMMON.white,
        },
        background: {
            default: theme.background,
            paper: theme.card,
            subtle: theme.secondaryBackground,
            muted: theme.tertiaryBackground,
        },
        surface: {
            paper: theme.card,
        },
        text: {
            primary: theme.text,
            secondary: theme.secondaryText,
            tertiary: isDark ? theme.secondaryText : GRAY[600],
            disabled: isDark ? theme.secondaryText : GRAY[500],
        },
        border: isDark
            ? {
                  subtle: theme.border,
                  default: theme.border,
                  strong: theme.border,
              }
            : { subtle: GRAY[200], default: GRAY[300], strong: GRAY[400] },
        action: {
            selected: isDark ? theme.tertiaryBackground : PRIMARY_MUTED,
        },
        themeToggle: {
            activeBg: theme.primary,
            iconDefault: theme.secondaryText,
            iconActive: COMMON.white,
        },
    };
};

export const lightPalette = createPalette(lightTheme);
export const darkPalette = createPalette(darkTheme);
