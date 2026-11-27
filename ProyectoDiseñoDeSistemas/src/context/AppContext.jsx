import { catalogosBase } from '../pages/administracion/catalogos';
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const ADMIN_HOME = 'dashboard';

const CLIENT_PAGES = ['catalogo', 'ingresar', 'registrarse', 'carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil'];
const pageFromLocation = () => {
  const hash = window.location.hash.slice(1);
  if (hash) return hash;
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '/admin' ? 'admin_login' : path === '/cliente' ? 'catalogo' : null;
};
const pageUrl = (page) => {
  if (page === 'admin_login') return '/admin';
  if (page === 'catalogo') return '/cliente';
  return `${CLIENT_PAGES.includes(page) ? '/cliente' : '/admin'}#${page}`;
};

export const AppProvider = ({ children }) => {
  const [catalogosGuardados, setCatalogos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pastafab_catalogos')) ?? {};
    } catch {
      return {};
    }
  });
  const catalogos = { ...catalogosBase, ...catalogosGuardados };

  function guardarCatalogo(tipo, registro) {
    const porId = new Map(catalogos[tipo].map(item => [item.id, item]));
    for (const item of [registro].flat()) porId.set(item.id, item);
    const nuevaLista = [...porId.values()];
    const siguiente = { ...catalogosGuardados, [tipo]: nuevaLista };
    localStorage.setItem('pastafab_catalogos', JSON.stringify(siguiente));
    setCatalogos(siguiente);
  }

  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pastafab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const entryPage = pageFromLocation();
      if (entryPage) return entryPage;
      const saved = sessionStorage.getItem('pastafab_page');
      return saved || null;
    } catch {
      return null;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  // Sincronizar clase en body para comportamiento overlay del drawer
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('sidebar-open', sidebarOpen);
  }

  // Soporte para botones de atras/adelante del navegador sin cerrar sesion
  useEffect(() => {
    const handlePopState = (event) => {
      const targetPage = event.state?.page || pageFromLocation() || (user?.role === 'admin' ? ADMIN_HOME : 'catalogo');
      if (targetPage) {
        setCurrentPage(targetPage);
        try {
          sessionStorage.setItem('pastafab_page', targetPage);
        } catch {
          // ignore storage errors
        }
      } else if (user) {
        const fallback = user.role === 'cliente' ? 'catalogo' : ADMIN_HOME;
        setCurrentPage(fallback);
      }
      setSidebarOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const login = (role, profile, destination) => {
    const newUser =
      role === 'cliente'
        ? { name: 'María García', role: 'cliente', avatar: 'MG', email: 'maria.garcia@mail.com', ...profile }
        : { name: 'Carlos Rodríguez', role: 'admin', avatar: 'CR', email: 'c.rodriguez@pastafab.com' };
    const defaultPage = role === 'cliente' ? (destination || 'catalogo') : ADMIN_HOME;

    setUser(newUser);
    setCurrentPage(defaultPage);

    try {
      sessionStorage.setItem('pastafab_user', JSON.stringify(newUser));
      sessionStorage.setItem('pastafab_page', defaultPage);
      if (typeof window !== 'undefined') {
        window.history.replaceState({ page: defaultPage }, '', pageUrl(defaultPage));
      }
    } catch {
      // ignore
    }
  };

  const updateProfile = ({ name, avatar }) => {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, name, avatar };
      try { sessionStorage.setItem('pastafab_user', JSON.stringify(updated)); } catch { /* Storage may be unavailable. */ }
      return updated;
    });
  };

  const logout = () => {
    const loginPage = user?.role === 'admin' ? 'admin_login' : 'catalogo';
    setUser(null);
    setCurrentPage(loginPage);
    setSidebarOpen(false);
    try {
      sessionStorage.removeItem('pastafab_user');
      sessionStorage.removeItem('pastafab_page');
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState({ page: loginPage }, '', pageUrl(loginPage));
      window.location.reload();
    }
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    try {
      sessionStorage.setItem('pastafab_page', page);
      if (typeof window !== 'undefined') {
        window.history.pushState({ page }, '', pageUrl(page));
      }
    } catch {
      // ignore
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', nextMode);
      return nextMode;
    });
  };

  return (
    <AppContext.Provider value={{ catalogos, guardarCatalogo, user, currentPage, sidebarOpen, themeMode, login, logout, updateProfile, navigate, toggleSidebar, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useNombreEstado() {
  const ctx = useContext(AppContext);
  return (valor, grupo = ctx?.currentPage) =>
    ctx?.catalogos.estados.find(r => r.id === `${grupo}:${valor}`)?.nombre ?? valor;
}
