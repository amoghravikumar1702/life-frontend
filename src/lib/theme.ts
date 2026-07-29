export const theme = {
  colors: {
    background: "var(--background)",
    surface: "var(--surface)",
    surfaceElevated: "var(--surface-elevated)",

    primary: "var(--primary)",
    primaryHover: "var(--primary-hover)",

    text: {
      primary: "var(--foreground)",
      secondary: "var(--text-secondary)",
    },

    border: {
      default: "var(--border)",
      light: "var(--border-light)",
    },

    status: {
      success: {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },

      warning: {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
      },

      danger: {
        text: "text-red-400",
        bg: "bg-red-500/10",
      },
    },
  },
} as const;