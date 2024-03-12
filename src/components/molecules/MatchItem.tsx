import { Match } from "@/models/Match";
import { Button } from "../atoms/Button";

export default function MatchItem({
  match,
  onClickEnter,
}: {
  match: Match;
  onClickEnter: () => void;
}) {
  return (
    <div className="flex border p-2 justify-between items-center rounded">
      <span className="truncate text-xs">{match.name}</span>
      <Button onClick={onClickEnter}>Entrar</Button>
    </div>
  );
}
