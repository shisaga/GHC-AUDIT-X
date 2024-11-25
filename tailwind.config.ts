import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import withMT from "@material-tailwind/react/utils/withMT";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        themeSecondary: "var(--midnight-blue)",
        themePrimary: "var(--color-primary)",
        hoverPrimary: "var(--color-primary-hover)",
        colorWhite: "var(--color-white)",
        colorBlack: "var(--color-black)",
        colorDark: "var(--color-neutral-850)",
        colorLight: "var(--color-neutral-700)",
        colorLighter: "var(--color-neutral-100)",
        colorLightest: "var(--color-neutral-50)",
        colorGray: "var(--color-gray)",
        colorDanger: "var(--danger-red)",
        colorGreen: "var(--color-green)",
        colorDangerDark: "var(--danger-red-dark)",
        colorWarning: "var(--color-warning)",
      },
      fontFamily: {
        Rubik: ["Rubik", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
      borderRadius: {
        normal: "10px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require("@tailwindcss/forms"),
    plugin(({ addVariant, e }: { addVariant: any; e: any }) => {
      addVariant(
        "sidebar-expanded",
        ({
          modifySelectors,
          separator,
        }: {
          modifySelectors: any;
          separator: any;
        }) => {
          modifySelectors(
            ({ className }: any) =>
              `.sidebar-expanded .${e(
                `sidebar-expanded${separator}${className}`
              )}`
          );
        }
      );
    }),
  ],
};
export default withMT(config);
