import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search as SearchIcon, CheckCircle, Clock, Filter, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { ItemCard, Item } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useItems, useClaimItem } from '@/hooks/useItems';
import { useCollegeStats } from '@/hooks/useAdmin';

export default function CollegeDashboard() {
  const { collegeId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks
  const { data: items = [], isLoading: itemsLoading } = useItems(collegeId || '');
  const { data: stats = { lost: 0, found: 0, resolved: 0, pending: 0 }, isLoading: statsLoading } = useCollegeStats(collegeId || '');
  const claimItem = useClaimItem();

  const filteredItems = items.filter((item: Item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleClaimItem = (item: Item) => {
    claimItem.mutate(item.id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            College Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of all lost and found items on campus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-28 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-8 bg-muted rounded w-1/3" />
            </div>
          ))
        ) : (
          <>
            <StatsCard
              title="Lost Items"
              value={stats.lost}
              icon={Package}
              variant="lost"
            />
            <StatsCard
              title="Found Items"
              value={stats.found}
              icon={SearchIcon}
              variant="found"
            />
            <StatsCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle}
              variant="resolved"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              variant="primary"
            />
          </>
        )}
      </div>

      {/* Items Section */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="glass-card p-1 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                All Items
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

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-xl border border-border/50 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {itemsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item: Item, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ItemCard
                      item={item}
                      onClaim={() => handleClaimItem(item)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'No items in this category yet'}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
