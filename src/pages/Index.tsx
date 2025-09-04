import { useState, useCallback } from 'react';
import { Film, Heart, Search as SearchIcon, Sparkles } from 'lucide-react';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    setIsLoading(true);
    setShowFavorites(false);
    
    try {
      const response = await movieService.searchMovies(query, page);
      
      if (response.Response === 'True') {
        setMovies(response.Search);
        setSearchQuery(query);
        setCurrentPage(page);
        setTotalResults(parseInt(response.totalResults));
        setTotalPages(Math.ceil(parseInt(response.totalResults) / 10));
        
        if (page === 1) {
          toast({
            title: "Search completed",
            description: `Found ${response.totalResults} results for "${query}"`,
          });
        }
      } else {
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
        toast({
          variant: "destructive",
          title: "No results found",
          description: response.Error || `No movies found for "${query}"`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Search failed", 
        description: "The API key may be invalid. Get a free key from omdbapi.com and update the movieService.ts file.",
      });
      setMovies([]);
      setTotalPages(0);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handlePageChange = (page: number) => {
    if (searchQuery) {
      searchMovies(searchQuery, page);
    }
  };

  const handleViewDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setMovies([]);
    setTotalPages(0);
    setTotalResults(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const displayedMovies = showFavorites ? favorites : movies;
  const hasResults = displayedMovies.length > 0;

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-card-foreground/20 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MovieFinder</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={showFavorites ? "default" : "outline"}
                onClick={handleShowFavorites}
                className={showFavorites 
                  ? "gradient-accent text-accent-foreground" 
                  : "border-card-foreground/20 hover:bg-card-foreground/10"
                }
              >
                <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
                Favorites
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                Discover
                <span className="block text-primary">Amazing Movies</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Search through millions of movies, TV shows, and episodes. Find detailed information and manage your personal favorites.
              </p>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <SearchBar onSearch={(query) => searchMovies(query, 1)} isLoading={isLoading} />
            </div>

            {!hasResults && !isLoading && !showFavorites && (
              <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <span className="text-muted-foreground mr-2">Try searching for:</span>
                {['Avengers', 'The Matrix', 'Inception', 'Interstellar', 'The Dark Knight'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => searchMovies(suggestion, 1)}
                    className="border-card-foreground/20 hover:bg-card-foreground/10 text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(hasResults || showFavorites) && (
        <section className="pb-20 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {showFavorites ? 'Your Favorites' : 'Search Results'}
                </h3>
                {!showFavorites && totalResults > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {totalResults.toLocaleString()} results
                  </Badge>
                )}
              </div>
              
              {showFavorites && favorites.length === 0 && (
                <p className="text-muted-foreground">No favorites yet. Start adding movies to your collection!</p>
              )}
            </div>

            {hasResults && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                  {displayedMovies.map((movie, index) => (
                    <div
                      key={movie.imdbID}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <MovieCard
                        movie={movie}
                        isFavorite={isFavorite(movie.imdbID)}
                        onToggleFavorite={toggleFavorite}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ))}
                </div>

                {!showFavorites && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!hasResults && !isLoading && searchQuery && !showFavorites && (
        <section className="pb-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-md mx-auto space-y-4">
              <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No movies found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedMovie ? isFavorite(selectedMovie.imdbID) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;
