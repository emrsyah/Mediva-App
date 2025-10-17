import { Card, CardContent } from "@/components/ui/card";

interface Alt {
  name: string;
  description: string;
}

interface AlternativeCardListProps {
  alternatives: Alt[];
  onSelect: (alt: Alt) => void;
}

export function AlternativeCardList({
  alternatives,
  onSelect,
}: AlternativeCardListProps) {
  if (alternatives.length === 0) return null;
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {alternatives.map((alt) => (
        <Card
          key={alt.name}
          className="min-w-[140px] px-3 py-2 flex-shrink-0 cursor-pointer hover:bg-muted/70"
          onClick={() => onSelect(alt)}
        >
          <CardContent className="p-0 space-y-1">
            <p className="font-medium text-sm">{alt.name}</p>
            <p className="text-xs text-muted-foreground">{alt.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
