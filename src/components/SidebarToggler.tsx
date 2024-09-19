export function SidebarToggler({ onClick }: { onClick: () => void }) {
  return (
    <i
      className="bi-layout-sidebar mt-1 px-2 rounded pointer-style active-style sidebar-toggler position-absolute z-1 fs-4"
      onClick={onClick}
    ></i>
  );
}
