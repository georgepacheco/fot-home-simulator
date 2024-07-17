import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { DrawerProvider, AppThemeProvider } from "./shared/contexts";
import { MenuLateral } from "./shared/components";
import { AuthProvider } from "./shared/contexts/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <DrawerProvider>
          <BrowserRouter>
            <MenuLateral>
              <AppRoutes />
            </MenuLateral>
          </BrowserRouter>
        </DrawerProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

