import { createSystem, defaultConfig } from "@chakra-ui/react";
import "@fontsource-variable/geologica";

// 🎨 Paleta principal
// 222831 (fondo oscuro)
// 393E46 (texto secundario)
// 00ADB5 (color principal / brand)
// EEEEEE (fondos claros / texto claro)

export const system = createSystem(defaultConfig, {
  theme: {
    keyframes: {
      parpadeoLateral: {
        "0%": {
          transform: "translateX(0)",
          boxShadow: "0 0 0px #FFC107",
        },
        "50%": {
          transform: "translateX(2px)",
          boxShadow: "2px 0 10px #FFC107",
        },
        "100%": {
          transform: "translateX(0)",
          boxShadow: "0 0 0px #FFC107",
        },
      },
      alertaNotaRevision: {
        "0%": {
          transform: "translateY(0px)",
          backgroundColor: "#FFC107", // amarillo suave
          boxShadow: "0 0 0px #FFC107",
        },
        "50%": {
          transform: "translateY(-3px)",
          backgroundColor: "#FFC107", // más brillante
          boxShadow: "0 0 12px #FFC107",
        },
        "100%": {
          transform: "translateY(0px)",
          backgroundColor: "#FFC107",
          boxShadow: "0 0 0px #FFC107",
        },
      },
      fadeInUp: {
        "0%": {
          transform: "translateY(30px)",
          opacity: "0",
        },
        "100%": {
          transform: "translateY(0)",
          opacity: "1",
        },
      },

      floatGlow: {
        "0%": {
          transform: "translateY(0px)",
          boxShadow: "0 0 0px #00ADB5",
        },
        "25%": {
          transform: "translateY(-5px)",
          boxShadow: "0 0 12px #00ADB5",
        },
        "100%": {
          transform: "translateY(0px)",
          boxShadow: "0 0 0px #00ADB5",
        },
      },
      pulseCloud: {
        "0%": {
          transform: "scale(1)",
          opacity: "1",
        },
        "50%": {
          transform: "scale(1.03)",
          opacity: "1",
        },
        "100%": {
          transform: "scale(1)",
          opacity: "1",
        },
      },
    },
    tokens: {
      animations: {
        parpadeoLateral: {
          value: "parpadeoLateral 1.4s ease-in-out infinite",
        },
        alertaNotaRevision: {
          value: "alertaNotaRevision 1.6s ease-in-out infinite",
        },
        fadeInUp: {
          value: "fadeInUp .8s ease-out forwards",
        },
        floatGlow: {
          value: "floatGlow 3s ease-in-out infinite",
        },
        pulseCloud: {
          value: "pulseCloud 2s ease-in-out infinite",
        },
      },
      colors: {
        brand: {
          50: { value: "#e0f7f9" },
          100: { value: "#b2ebf2" },
          200: { value: "#80deea" },
          300: { value: "#4dd0e1" },
          400: { value: "#26c6da" },
          500: { value: "#00ADB5" }, // ✅ principal
          600: { value: "#0097a7" },
          700: { value: "#00838f" },
          800: { value: "#006064" },
          900: { value: "#004d40" },
        },
        tema: {
          intenso: { value: "#222831" },
          suave: { value: "#393E46" },
          llamativo: { value: "#00ADB5" },
          claro: { value: "#EEEEEE" },
          rojo: { value: "#E63946" },
          naranja: { value: "#FF9300 " },
          amarillo: { value: "#FFC107" },
          verde: { value: "#00B894" },
          morado: { value: "#8E44AD" },
        },
        fondo: {
          base: { value: "#f7f8fa" },
          caja: { value: "#ffffff" },
          oscuro: { value: "#222831" },
          claro: { value: "#EEEEEE" },
        },
        texto: {
          primario: { value: "#222831" },
          secundario: { value: "#393E46" },
          claro: { value: "#EEEEEE" },
        },

        estado: {
          success: { value: "#38A169" }, // verde
          error: { value: "#E53E3E" }, // rojo
          warning: { value: "#ED8936" }, // naranja
        },
      },
      fonts: {
        heading: { value: `'Geologica Variable', sans-serif` },
        body: { value: `'Geologica Variable', sans-serif` },
      },
      radii: {
        xl: { value: "1rem" },
        "2xl": { value: "1.5rem" },
      },
      shadows: {
        base: { value: "0 2px 4px rgba(0, 0, 0, 0.06)" },
        md: { value: "0 4px 12px rgba(0, 0, 0, 0.1)" },
      },
    },
  },
});
