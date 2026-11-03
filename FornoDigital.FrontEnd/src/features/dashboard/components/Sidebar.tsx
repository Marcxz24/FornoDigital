/**
 * Relação estática contendo os itens de navegação principais do sistema (Visão geral, Clientes e Produtos).
 */
const navigationItems = [
  {
    label: "Visão geral",
    href: "#",
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
    label: "Clientes",
    href: "#clients-title",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M17 11a4 4 0 0 0 0-8" />
        <path d="M21 20v-1.5a4 4 0 0 0-3-3.87" />
      </svg>
    ),
    active: false,
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
 * Componente da barra lateral (<see cref="Sidebar"/>) responsável pela navegação estrutural 
 * entre as seções da aplicação e renderização dos ícones vetoriais.
 */
export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      {/* Marca / Logotipo da barra lateral direcionando para o início */}
      <a className="sidebar-brand" href="#" aria-label="Forno Digital, início">
        <span className="sidebar-brand-mark" aria-hidden="true">
          F
        </span>
        <span className="sidebar-brand-name">Forno Digital</span>
      </a>

      {/* Lista de navegação principal mapeada a partir dos itens definidos */}
      <nav className="sidebar-nav" aria-label="Seções do dashboard">
        {navigationItems.map((item) => (
          <a
            className={`sidebar-link${item.active ? " sidebar-link-active" : ""}`}
            href={item.href}
            key={item.label}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Rodapé da barra lateral indicando o contexto do painel da padaria */}
      <div className="sidebar-footer">
        <span className="sidebar-footer-mark" aria-hidden="true">
          FD
        </span>
        <span className="sidebar-footer-label">Painel da padaria</span>
      </div>
    </aside>
  );
}