import { useEffect, useState } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Award, 
  Users, 
  Heart,
  ExternalLink,
  Loader2 
} from 'lucide-react';
import { Movie, MovieDetails } from '@/types/movie';
import { movieService } from '@/services/movieService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const MovieModal = ({ 
  movie, 
  isOpen, 
  onClose, 
  isFavorite, 
  onToggleFavorite 
}: MovieModalProps) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (movie && isOpen) {
      fetchMovieDetails(movie.imdbID);
    }
  }, [movie, isOpen]);

  const fetchMovieDetails = async (imdbID: string) => {
    setIsLoading(true);
    try {
      const response = await movieService.getMovieDetails(imdbID);
      if (response.Response === 'True') {
        setMovieDetails(response);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.Error || "Failed to fetch movie details",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch movie details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!movie) return null;

  const details = movieDetails || movie;
  const rating = movieDetails?.imdbRating && movieDetails.imdbRating !== 'N/A' 
    ? parseFloat(movieDetails.imdbRating) 
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-card-foreground/20 animate-scale-in">
        <Button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 h-8 w-8 p-0 rounded-full bg-background/80 hover:bg-background"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-card">
                  {details.Poster && details.Poster !== 'N/A' ? (
                    <img
                      src={details.Poster}
                      alt={details.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Users className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {details.Title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {details.Year}
                    </Badge>
                    
                    {movieDetails?.Runtime && movieDetails.Runtime !== 'N/A' && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movieDetails.Runtime}
                      </Badge>
                    )}
                    
                    {movieDetails?.Rated && movieDetails.Rated !== 'N/A' && (
                      <Badge variant="outline">
                        {movieDetails.Rated}
                      </Badge>
                    )}

                    {rating && (
                      <Badge className="flex items-center gap-1 bg-cinema-gold text-cinema-dark">
                        <Star className="w-3 h-3 fill-current" />
                        {rating}/10
                      </Badge>
                    )}
                  </div>

                  {movieDetails?.Genre && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movieDetails.Genre.split(', ').map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => onToggleFavorite(movie)}
                    variant={isFavorite ? "default" : "outline"}
                    className={`${
                      isFavorite 
                        ? 'gradient-accent text-accent-foreground' 
                        : 'border-card-foreground/20 hover:bg-card-foreground/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
                    className="border-card-foreground/20 hover:bg-card-foreground/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on IMDb
                  </Button>
                </div>

                {/* Plot */}
                {movieDetails?.Plot && movieDetails.Plot !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Plot</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {movieDetails.Plot}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            {movieDetails && (
              <>
                <Separator className="bg-border/50" />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {movieDetails.Director && movieDetails.Director !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Director
                        </h4>
                        <p className="text-foreground">{movieDetails.Director}</p>
                      </div>
                    )}
                    
                    {movieDetails.Writer && movieDetails.Writer !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Writer
                        </h4>
                        <p className="text-foreground">{movieDetails.Writer}</p>
                      </div>
                    )}
                    
                    {movieDetails.Actors && movieDetails.Actors !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Cast
                        </h4>
                        <p className="text-foreground">{movieDetails.Actors}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {movieDetails.Language && movieDetails.Language !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Language
                        </h4>
                        <p className="text-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {movieDetails.Language}
                        </p>
                      </div>
                    )}
                    
                    {movieDetails.Country && movieDetails.Country !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Country
                        </h4>
                        <p className="text-foreground">{movieDetails.Country}</p>
                      </div>
                    )}
                    
                    {movieDetails.Awards && movieDetails.Awards !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Awards
                        </h4>
                        <p className="text-foreground flex items-start gap-2">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {movieDetails.Awards}
                        </p>
                      </div>
                    )}
                    
                    {movieDetails.BoxOffice && movieDetails.BoxOffice !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                          Box Office
                        </h4>
                        <p className="text-foreground">{movieDetails.BoxOffice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};