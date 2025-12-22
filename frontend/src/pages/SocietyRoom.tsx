import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, Users, Star, Calendar, Search as SearchIcon } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { ItemCard, Item } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';

// Mock society data
const mockSociety = {
  name: 'Tech Society',
  description: 'A community of tech enthusiasts and innovators working together to build the future.',
  memberCount: 156,
  banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
};

const mockSocietyItems: Item[] = [
  {
    id: '1',
    title: 'Arduino Kit',
    description: 'Complete Arduino starter kit left after the robotics workshop.',
    category: 'Electronics',
    status: 'found',
    location: 'Tech Lab',
    date: 'Dec 20, 2024',
    reportedBy: { name: 'Alex Chen' },
    isPriority: true,
    societyName: 'Tech Society',
  },
  {
    id: '2',
    title: 'Event Badge',
    description: 'Hackathon participant badge lost during the event.',
    category: 'Documents',
    status: 'lost',
    location: 'Conference Hall',
    date: 'Dec 19, 2024',
    reportedBy: { name: 'Sarah Kim' },
    isPriority: true,
    societyName: 'Tech Society',
  },
  {
    id: '3',
    title: 'USB Hub',
    description: 'Multi-port USB hub found in the coding area.',
    category: 'Electronics',
    status: 'found',
    location: 'Society Room',
    date: 'Dec 18, 2024',
    reportedBy: { name: 'Mike Wilson' },
    societyName: 'Tech Society',
  },
];

export default function SocietyRoom() {
  const { collegeId, societyId } = useParams();
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = mockSocietyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReportSubmit = () => {
    showToast('Item reported to society!', 'success');
    setShowReportModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Society Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {/* Banner Image */}
        <div className="relative h-48 md:h-64">
          <img
            src={mockSociety.banner}
            alt={mockSociety.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>

        {/* Society Info */}
        <div className="p-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-society flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {mockSociety.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{mockSociety.memberCount} members</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {mockSociety.description}
              </p>
            </div>
            <Button variant="society" onClick={() => setShowReportModal(true)}>
              <Plus className="w-4 h-4" />
              Report Item
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Society Lost"
          value={4}
          icon={Package}
          variant="lost"
        />
        <StatsCard
          title="Society Found"
          value={8}
          icon={SearchIcon}
          variant="found"
        />
        <StatsCard
          title="Event Related"
          value={3}
          icon={Calendar}
          variant="accent"
        />
      </div>

      {/* Items Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold text-foreground">
              Society Items
            </h2>
            <Badge className="badge-society">Members Only</Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search society items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-xl border border-border/50 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
            />
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ItemCard
                  item={item}
                  onClaim={() => showToast('Claim request sent!', 'success')}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'No items reported in this society yet'}
            </p>
          </div>
        )}
      </section>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Society Item"
        size="lg"
      >
        <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); handleReportSubmit(); }}>
          <div className="glass-card p-4 bg-accent/10 border-accent/20">
            <div className="flex items-center gap-2 text-accent">
              <Star className="w-5 h-5" />
              <span className="font-medium">Posting as {mockSociety.name} member</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item Title</label>
            <input
              type="text"
              placeholder="e.g., Society Equipment"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="Describe the item..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50">
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <select className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50">
                <option value="normal">Normal</option>
                <option value="priority">Event Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              type="text"
              placeholder="e.g., Society Room, Event Venue"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="society" className="flex-1">
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
