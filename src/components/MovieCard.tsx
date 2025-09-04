import { useState } from 'react';
import { Heart, Calendar, Eye, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
}

export const MovieCard = ({ 
  movie, 
  isFavorite, 
  onToggleFavorite, 
  onViewDetails 
}: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card className="group movie-card-hover bg-card/80 backdrop-blur-sm border-card-foreground/20 overflow-hidden animate-fade-in">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {!imageError && movie.Poster !== 'N/A' ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={movie.Poster}
              alt={movie.Title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-card flex items-center justify-center text-muted-foreground">
            <Eye className="w-12 h-12" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            className={`h-8 w-8 p-0 rounded-full backdrop-blur-sm ${
              isFavorite 
                ? 'bg-accent/90 text-accent-foreground hover:bg-accent' 
                : 'bg-card/90 hover:bg-card'
            }`}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
            />
          </Button>
        </div>

        {/* Info button at bottom */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={() => onViewDetails(movie)}
            className="w-full h-9 gradient-primary text-primary-foreground font-medium shadow-primary"
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
            {movie.Title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {movie.Year}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {movie.Type}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};