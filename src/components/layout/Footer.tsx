import { site } from '../../constants/site';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-wide text-brand">CRI</p>
          <p className="mt-2 max-w-sm text-sm text-white/75">{site.tagline}</p>
          <p className="mt-2 text-sm text-white/75">{site.hours}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a className="text-white no-underline hover:text-brand" href={`tel:+5547997930130`}>
            {site.phone}
          </a>
          <a className="text-white no-underline hover:text-brand" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className="text-white/60">Itajaí · Balneário Camboriú · Itapema</p>
        </div>
      </Container>
    </footer>
  );
}
