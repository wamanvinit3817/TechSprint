import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, MapPin, Search as SearchIcon, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/StatsCard';
import { ItemCard, Item } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';
import { ImageUpload } from '@/components/ImageUpload';
import { useItems, useUserItems, useCreateItem, useClaimItem } from '@/hooks/useItems';

export default function StudentSpace() {
  const { collegeId } = useParams();
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState<string | undefined>();

  // API hooks
  const { data: userItems = [], isLoading: userItemsLoading } = useUserItems(user?.id || '');
  const { data: collegeItems = [], isLoading: itemsLoading } = useItems(collegeId || '', { status: 'found' });
  const createItem = useCreateItem();
  const claimItem = useClaimItem();

  const activeUserItems = userItems.filter((item: Item) => item.status !== 'resolved');
  const nearbyItems = collegeItems.slice(0, 6);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Electronics');
    setLocation('');
    setDate('');
    setImage(undefined);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return;
    
    createItem.mutate({
      title,
      description,
      category,
      status: reportType,
      location,
      date,
      image,
      collegeId,
    }, {
      onSuccess: () => {
        setShowReportModal(false);
        resetForm();
      }
    });
  };

  const handleClaimItem = (item: Item) => {
    claimItem.mutate(item.id);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 bg-gradient-to-r from-student/10 to-student-glow/5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Report lost items or help others find theirs
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="student"
              onClick={() => {
                setReportType('lost');
                setShowReportModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Report Lost
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setReportType('found');
                setShowReportModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Report Found
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="My Lost Items"
          value={userItems.filter((i: Item) => i.status === 'lost').length}
          icon={Package}
          variant="lost"
        />
        <StatsCard
          title="Items I Found"
          value={userItems.filter((i: Item) => i.status === 'found').length}
          icon={SearchIcon}
          variant="found"
        />
        <StatsCard
          title="Resolved"
          value={userItems.filter((i: Item) => i.status === 'resolved').length}
          icon={Clock}
          variant="resolved"
        />
      </div>

      {/* My Items Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            My Active Reports
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/college/${collegeId}/student/my-items`}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {userItemsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeUserItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeUserItems.slice(0, 3).map((item: Item, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active reports</p>
          </div>
        )}
      </section>

      {/* Nearby Found Items */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">
            Recently Found Near You
          </h2>
        </div>

        {itemsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : nearbyItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyItems.map((item: Item, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <ItemCard
                  item={item}
                  onClaim={() => handleClaimItem(item)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No found items nearby</p>
          </div>
        )}
      </section>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`Report ${reportType === 'lost' ? 'Lost' : 'Found'} Item`}
        size="lg"
      >
        <form className="p-6 space-y-6" onSubmit={handleReportSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Blue Backpack"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Electronics</option>
                <option>Documents</option>
                <option>Personal Items</option>
                <option>Keys</option>
                <option>Bags</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Library, 2nd Floor"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Photo (Optional)</label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={reportType === 'lost' ? 'destructive' : 'default'} 
              className="flex-1"
              disabled={createItem.isPending}
            >
              {createItem.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
