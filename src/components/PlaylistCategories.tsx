import React from 'react';
import { newPlaylists } from '../data/playlists';
import { useStore } from '../store/useStore';
import { fetchPlaylistVideos } from '../utils/youtube';
import { Loader2 } from 'lucide-react';

interface PlaylistCategoriesProps {
  onSelect?: () => void;
}

export const PlaylistCategories: React.FC<PlaylistCategoriesProps> = ({ onSelect }) => {
  const { setPlaylist } = useStore();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handlePlaylistSelect = async (url: string, playlistId: string) => {
    setLoading(playlistId);
    setError(null);

    try {
      const videos = await fetchPlaylistVideos(url);
      setPlaylist({
        videos,
        currentIndex: 0,
        isPlaying: true,
        volume: 70,
        audioOnly: false,
        shuffle: true,
        repeat: false,
      });
      onSelect?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-2 gap-3">
        {newPlaylists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handlePlaylistSelect(playlist.url, playlist.id)}
            disabled={!!loading}
            className="bg-[#282828] rounded-lg p-4 text-left hover:bg-[#323232] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{playlist.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-1">{playlist.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{playlist.description}</p>
              </div>
              {loading === playlist.id && (
                <Loader2 size={18} className="text-[#1DB954] animate-spin flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-4 px-3 py-2 text-xs text-red-400 bg-red-400/10 rounded-lg">{error}</p>
      )}
    </div>
  );
};