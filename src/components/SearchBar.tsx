import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search for movies, TV shows, episodes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-20 h-14 text-lg bg-card/80 backdrop-blur-sm border-card-foreground/20 search-glow transition-all duration-300"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-2 h-10 px-6 gradient-primary text-primary-foreground font-medium shadow-primary hover:shadow-primary"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  );
};