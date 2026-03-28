import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import { Setup2FAPage } from "./pages/setup-2fa-page";
import { Verify2FAPage } from "./pages/verify-2fa-page";
import { ForgotPasswordPage } from "./pages/forgot-password-page";
import { ResetPasswordPage } from "./pages/reset-password-page";
import { ChangePasswordPage } from "./pages/change-password-page";
import { DashboardPage } from "./pages/dashboard-page";
import { MLStatsPage } from "./pages/ml-stats-page";
import { KeyVaultPage } from "./pages/key-vault-page";
import { ProfilePage } from "./pages/profile-page";
import { SuccessPage } from "./pages/success-page";
import { NotFoundPage } from "./pages/not-found-page";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "setup-2fa", Component: Setup2FAPage },
      { path: "verify-2fa", Component: Verify2FAPage },
      { path: "forgot-password", Component: ForgotPasswordPage },
      { path: "reset-password", Component: ResetPasswordPage },
      { path: "reset-success", Component: SuccessPage },
      { path: "change-password", Component: ChangePasswordPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "ml-stats", Component: MLStatsPage },
      { path: "key-vault", Component: KeyVaultPage },
      { path: "profile", Component: ProfilePage },
      { path: "success", Component: SuccessPage },
      { path: "*", Component: NotFoundPage },
      { path: "performance", Component: MLStatsPage }, // Performance Hub ko MLStatsPage se link karo
    ],
  },
]);