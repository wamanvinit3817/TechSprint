import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search as SearchIcon, Filter, Trash2, Edit2 } from 'lucide-react';
import { ItemCard, Item } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showToast } from '@/components/Toast';

const mockMyItems: Item[] = [
  {
    id: '1',
    title: 'Lost Wallet',
    description: 'Brown leather wallet with multiple cards.',
    category: 'Personal Items',
    status: 'lost',
    location: 'Engineering Building',
    date: 'Dec 18, 2024',
    reportedBy: { name: 'You' },
  },
  {
    id: '2',
    title: 'Found Calculator',
    description: 'Scientific calculator found in exam hall.',
    category: 'Electronics',
    status: 'found',
    location: 'Exam Hall B',
    date: 'Dec 15, 2024',
    reportedBy: { name: 'You' },
  },
  {
    id: '3',
    title: 'Lost Keys',
    description: 'Set of keys with a blue keychain.',
    category: 'Keys',
    status: 'resolved',
    location: 'Library',
    date: 'Dec 10, 2024',
    reportedBy: { name: 'You' },
  },
];

export default function MyItemsPage() {
  const { collegeId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = mockMyItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleEdit = (item: Item) => {
    showToast('Edit functionality coming soon!', 'info');
  };

  const handleDelete = (item: Item) => {
    showToast('Item deleted', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          My Items
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage all items you've reported
        </p>
      </motion.div>

      {/* Tabs and Search */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              All
            </TabsTrigger>
            <TabsTrigger value="lost" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lost data-[state=active]:to-lost-glow data-[state=active]:text-primary-foreground">
              Lost
            </TabsTrigger>
            <TabsTrigger value="found" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-found data-[state=active]:to-found-glow data-[state=active]:text-primary-foreground">
              Found
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-resolved data-[state=active]:to-resolved-glow data-[state=active]:text-primary-foreground">
              Resolved
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search your items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-xl border border-border/50 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <ItemCard item={item} />
                  
                  {/* Action Overlay */}
                  {item.status !== 'resolved' && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="glass"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'You haven\'t reported any items yet'}
              </p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
