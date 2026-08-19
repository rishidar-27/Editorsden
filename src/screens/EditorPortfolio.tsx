import { useState, useRef } from 'react';
import { Button, Card, Badge, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Plus, Star, GripVertical, X, Link2, Upload, Film } from 'lucide-react';
import type { PortfolioItem } from '@/types';

export function EditorPortfolio() {
  const { getCurrentEditor, updateEditor, addToast } = useApp();
  const editor = getCurrentEditor();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');

  if (!editor) return null;

  const portfolio = editor.portfolio;
  const featuredCount = portfolio.filter((p) => p.featured).length;

  const updatePortfolio = (items: PortfolioItem[]) => {
    updateEditor(editor.id, { portfolio: items, lastPortfolioUpdate: new Date().toISOString() });
  };

  const toggleFeatured = (id: string) => {
    const item = portfolio.find((p) => p.id === id);
    if (item && !item.featured && featuredCount >= 3) {
      addToast('You can only feature 3 items. Unfeature one first.', 'error');
      return;
    }
    updatePortfolio(portfolio.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const removeItem = (id: string) => {
    updatePortfolio(portfolio.filter((p) => p.id !== id));
    addToast('Portfolio item removed', 'info');
  };

  const addItem = () => {
    if (!newTitle || !newLink) return;
    const item: PortfolioItem = {
      id: `p${Date.now()}`,
      title: newTitle,
      type: 'link',
      thumbnailUrl: newThumbnail || `https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=800`,
      link: newLink,
      featured: false,
    };
    updatePortfolio([...portfolio, item]);
    setNewTitle('');
    setNewLink('');
    setNewThumbnail('');
    setShowAdd(false);
    addToast('Portfolio item added', 'success');
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    const draggedIndex = portfolio.findIndex((p) => p.id === draggedId);
    const targetIndex = portfolio.findIndex((p) => p.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPortfolio = [...portfolio];
    const [moved] = newPortfolio.splice(draggedIndex, 1);
    newPortfolio.splice(targetIndex, 0, moved);
    updatePortfolio(newPortfolio);

    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 mb-1">Portfolio</h1>
          <p className="text-sm text-gray-600">Drag to reorder. Star up to 3 items to feature on your public page.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} size="sm">
          <Plus className="w-4 h-4" />
          Add work
        </Button>
      </div>

      {/* Featured counter */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-surface-0">
          <Star className={`w-4 h-4 ${featuredCount >= 3 ? 'text-amber-500' : 'text-gray-400'}`} fill={featuredCount >= 3 ? 'currentColor' : 'none'} />
          <span className={`text-sm font-medium ${featuredCount >= 3 ? 'text-amber-600' : 'text-gray-700'}`}>
            {featuredCount}/3 featured
          </span>
        </div>
      </div>

      {/* Portfolio grid */}
      {portfolio.length === 0 ? (
        <EmptyState
          icon={<Film className="w-10 h-10" />}
          title="No portfolio items yet"
          description="Add your best work to showcase to potential clients and get verified."
          action={<Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add work</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
              className={`group relative bg-surface-0 border rounded-card overflow-hidden transition-all duration-150 ${
                draggedId === item.id ? 'opacity-50' : ''
              } ${dragOverId === item.id ? 'border-violet-300 ring-2 ring-violet-100' : 'border-gray-200'}`}
            >
              {/* Drag handle */}
              <div className="absolute top-2 left-2 z-10 p-1 rounded-md bg-ink-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-white" />
              </div>

              {/* Featured star */}
              <button
                onClick={() => toggleFeatured(item.id)}
                className={`absolute top-2 right-2 z-10 p-1.5 rounded-md backdrop-blur-sm transition-all ${
                  item.featured ? 'bg-amber-500/90 opacity-100' : 'bg-ink-950/40 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${item.featured ? 'text-white' : 'text-white'}`}
                  fill={item.featured ? 'currentColor' : 'none'}
                />
              </button>

              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                {item.featured && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="featured">Featured</Badge>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink-900 truncate flex-1">{item.title}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-050 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-ink-950/30" />
          <div className="relative bg-surface-0 rounded-card border border-gray-200 shadow-xl w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-ink-900">Add portfolio item</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="flex-1 flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-050 transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Upload video file</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-2 p-4 border border-violet-200 bg-violet-050 rounded-lg">
                  <Link2 className="w-5 h-5 text-violet-600" />
                  <span className="text-sm text-violet-700 font-medium">Paste a link</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  placeholder="e.g. Brand Commercial — Aurora Skincare"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Video link (YouTube, Vimeo, Drive)</label>
                <input
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  placeholder="https://youtube.com/watch?v=..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL (optional)</label>
                <input
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  placeholder="https://..."
                  value={newThumbnail}
                  onChange={(e) => setNewThumbnail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button onClick={addItem} disabled={!newTitle || !newLink}>Add to portfolio</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
