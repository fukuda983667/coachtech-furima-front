// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["nuxt-auth-sanctum", "@pinia/nuxt", "@nuxtjs/google-fonts"],
  ssr: false,

  googleFonts: {
    families: {
      Inter: true, // google fontsから取得
      "Noto+Sans+JP": true,
    },
    display: "swap",
  },

  // nuxt-auth-sanctum options
  sanctum: {
    baseUrl: "http://localhost:8080", // Laravel API
    mode: "cookie",
    userStateKey: "sanctum.user.identity",
    redirectIfAuthenticated: false,
    redirectIfUnauthenticated: false,
    endpoints: {
      csrf: "/sanctum/csrf-cookie",
      login: "/api/login",
      logout: "/api/logout",
      user: "/api/user",
    },
    csrf: {
      cookie: "XSRF-TOKEN",
      header: "X-XSRF-TOKEN",
    },
    client: {
      retry: false,
    },
    redirect: {
      keepRequestedRoute: false,
      onLogin: "/",
      onLogout: "/login",
      onAuthOnly: "/login",
      onGuestOnly: "/",
    },
    globalMiddleware: {
      enabled: false,
      allow404WithoutAuth: true,
    },
    logLevel: 3,
  },
});