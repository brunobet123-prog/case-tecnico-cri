import { useState, type FormEvent } from 'react';
import { suggestFirstMessage } from '../../services/messageAgent';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type FirstMessageAgentProps = {
  nome: string;
  imovelInteresse: string;
  onNomeChange: (value: string) => void;
  onImovelChange: (value: string) => void;
};

export function FirstMessageAgent({
  nome,
  imovelInteresse,
  onNomeChange,
  onImovelChange,
}: FirstMessageAgentProps) {
  const [message, setMessage] = useState('');
  const [source, setSource] = useState<'ai' | 'local' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setSource(null);

    try {
      const result = await suggestFirstMessage(nome, imovelInteresse);
      setMessage(result.message);
      setSource(result.source);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível gerar a mensagem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Primeira mensagem</h2>
      <p className="mt-2 text-sm text-muted">
        O agente monta uma abordagem inicial com o nome do lead e o imóvel de interesse. Se houver chave
        de IA no ambiente local, usa o modelo; senão, usa um texto personalizado.
      </p>
      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium">
          Nome do lead
          <input
            required
            className="field-control"
            value={nome}
            onChange={(event) => onNomeChange(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Imóvel de interesse
          <input
            required
            className="field-control"
            value={imovelInteresse}
            onChange={(event) => onImovelChange(event.target.value)}
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar sugestão'}
        </Button>
      </form>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {message ? (
        <div className="mt-5 rounded-2xl bg-canvas p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            {source === 'ai' ? 'Gerado com IA' : 'Gerado localmente'}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{message}</p>
        </div>
      ) : null}
    </Card>
  );
}
