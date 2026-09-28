import { site } from '../../constants/site';
import { Container } from '../ui/Container';

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex items-center justify-between gap-4 py-4">
        <a href="/" className="flex items-center gap-3 no-underline" aria-label={site.name}>
          <img src="/logo.svg" alt="" className="h-8 w-auto" />
          <span className="hidden text-sm text-muted sm:block">{site.tagline}</span>
        </a>
        <a
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
          href={`https://wa.me/5547997930130`}
        >
          Fale com um especialista
        </a>
      </Container>
    </header>
  );
}
