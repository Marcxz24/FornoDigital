import type { ReactNode } from "react";

export type AppPage =
  | "dashboard"
  | "registrar-venda"
  | "visualizar-vendas"
  | "cadastrar-cliente"
  | "listar-clientes";

interface SidebarProps {
  paginaAtiva: AppPage;
  onNavigate: (pagina: AppPage) => void;
}

interface NavigationChild {
  label: string;
  href: string;
  page: AppPage;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  active: boolean;
  page?: AppPage;
  children?: NavigationChild[];
}

/**
 * Configuração estática das opções da barra lateral.
 * Cada opção filha aponta para o identificador de página que o App utilizará.
 */
const navigationItems: NavigationItem[] = [
  {
    label: "Visão geral",
    href: "#",
    page: "dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Vendas",
    href: "#sales",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h8M8 16h4" />
      </svg>
    ),
    active: false,
    children: [
      {
        label: "Registrar Venda",
        href: "#sales-register",
        page: "registrar-venda",
      },
      {
        label: "Visualizar Vendas",
        href: "#sales-list",
        page: "visualizar-vendas",
      },
    ],
  },
  {
    label: "Clientes",
    href: "#clients",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M17 11a4 4 0 0 0 0-8" />
        <path d="M21 20v-1.5a4 4 0 0 0-3-3.87" />
      </svg>
    ),
    active: false,
    children: [
      {
        label: "Cadastrar Cliente",
        href: "#clients-register",
        page: "cadastrar-cliente",
      },
      {
        label: "Listar Clientes",
        href: "#clients-list",
        page: "listar-clientes",
      },
    ],
  },
  {
    label: "Produtos",
    href: "#products-title",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
        <path d="m3.8 7.7 8.2 4.5 8.2-4.5" />
        <path d="M12 12.2V21" />
      </svg>
    ),
    active: false,
  },
];

/**
 * Renderiza a navegação lateral e marca como ativa a seção ou página selecionada.
 * Ao clicar em uma opção com página, impede a navegação padrão do link e
 * comunica o identificador ao App por meio de onNavigate.
 */
export function Sidebar({ paginaAtiva, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <a className="sidebar-brand" href="#" aria-label="Forno Digital, início">
        <span className="sidebar-brand-mark" aria-hidden="true">
          F
        </span>
        <span className="sidebar-brand-name">Forno Digital</span>
      </a>

      <nav className="sidebar-nav" aria-label="Seções do sistema">
        {navigationItems.map((item) => {
          const paginaFilhaAtiva =
            item.children?.some((child) => child.page === paginaAtiva) ?? false;

          const ativo =
            (item.page !== undefined && item.page === paginaAtiva) ||
            paginaFilhaAtiva;

          return (
            <div className="sidebar-nav-group" key={item.label}>
              <a
                className={`sidebar-link${ativo ? " sidebar-link-active" : ""}`}
                href={item.href}
                aria-current={
                  item.page === paginaAtiva ? "page" : undefined
                }
                onClick={
                  item.page
                    ? (event) => {
                        event.preventDefault();
                        onNavigate(item.page!);
                      }
                    : item.children
                      ? (event) => event.preventDefault()
                      : undefined
                }
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </a>

              {item.children && (
                <div
                  className="sidebar-subnav"
                  aria-label={`Seções de ${item.label.toLocaleLowerCase("pt-BR")}`}
                >
                  {item.children.map((child) => {
                    const filhoAtivo = child.page === paginaAtiva;

                    return (
                      <a
                        className={`sidebar-subnav-link${filhoAtivo ? " sidebar-subnav-link-active" : ""}`}
                        href={child.href}
                        key={child.page}
                        aria-current={filhoAtivo ? "page" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigate(child.page);
                        }}
                      >
                        <span className="sidebar-subnav-label">
                          {child.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-mark" aria-hidden="true">
          FD
        </span>
        <span className="sidebar-footer-label">Painel da padaria</span>
      </div>
    </aside>
  );
}