/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
  routes: (defineRoutes) =>
    defineRoutes((route) => {
      if (process.env.INCLUDE_TEST_ROUTES) {
        if (process.env.NODE_ENV === "production") {
          console.warn(
            "WARNING: NODE_ENV is set to 'production', so we are going to skip creating test routes."
          );
          return;
        }
        route("__tests/login", "__test-routes__/login.tsx");
        route("__tests/delete-user", "__test-routes__/delete-user.tsx");
      }
    }),
};
