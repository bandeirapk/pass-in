import { ComponentProps } from 'react';

interface NavLinkProps extends ComponentProps<'a'> {
  children: React.ReactNode;
}

export function NavLink({ children, ...rest }: NavLinkProps) {
  return (
    <a
      className="font-medium text-sm"
      {...rest}
    >
      {children}
    </a>
  );
}
