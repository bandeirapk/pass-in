import nlwUniteIcon from '../assets/nlw-unite-icon.svg';

import { NavLink } from './Nav-link';

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img
        src={nlwUniteIcon}
        alt="Icon nlwUnite"
      />

      <nav className="flex item-center gap-5">
        <NavLink href="/eventos">Eventos</NavLink>
        <NavLink href="/participantes">Participantes</NavLink>
      </nav>
    </div>
  );
}
