import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Key,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data
const mockPendingItems = [
  {
    id: '1',
    title: 'Laptop Charger',
    description: 'Dell laptop charger found in lecture hall.',
    category: 'Electronics',
    status: 'pending',
    location: 'Lecture Hall A',
    date: 'Dec 20, 2024',
    reportedBy: { name: 'John Student', email: 'john@college.edu' },
  },
  {
    id: '2',
    title: 'Wallet',
    description: 'Black leather wallet with ID cards.',
    category: 'Personal Items',
    status: 'pending',
    location: 'Cafeteria',
    date: 'Dec 19, 2024',
    reportedBy: { name: 'Jane Doe', email: 'jane@college.edu' },
  },
];

const mockInviteCodes = [
  { code: 'SOC-TECH-2024', type: 'society', uses: 15, maxUses: 50, expiresAt: '2025-01-15' },
  { code: 'COL-ADMIN-001', type: 'college', uses: 3, maxUses: 10, expiresAt: '2025-02-01' },
];

const chartData = [
  { name: 'Mon', lost: 4, found: 3 },
  { name: 'Tue', lost: 3, found: 5 },
  { name: 'Wed', lost: 6, found: 4 },
  { name: 'Thu', lost: 2, found: 6 },
  { name: 'Fri', lost: 5, found: 7 },
  { name: 'Sat', lost: 1, found: 2 },
  { name: 'Sun', lost: 2, found: 1 },
];

const resolutionData = [
  { name: 'Resolved', value: 65, color: 'hsl(142, 71%, 45%)' },
  { name: 'Pending', value: 20, color: 'hsl(220, 70%, 50%)' },
  { name: 'Unresolved', value: 15, color: 'hsl(0, 72%, 51%)' },
];

export default function CollegeAdminPanel() {
  const { collegeId } = useParams();
  const [activeTab, setActiveTab] = useState('pending');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteType, setInviteType] = useState<'society' | 'college'>('society');

  const handleApprove = (itemId: string) => {
    showToast('Item approved successfully!', 'success');
  };

  const handleReject = (itemId: string) => {
    showToast('Item rejected', 'info');
  };

  const handleResolve = (itemId: string) => {
    showToast('Item marked as resolved!', 'success');
  };

  const generateInviteCode = () => {
    showToast('New invite code generated!', 'success');
    setShowInviteModal(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-college/10 to-college-glow/5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="badge-college">Admin</Badge>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Admin Control Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage items, generate codes, and view analytics
            </p>
          </div>
          <Button variant="college" onClick={() => setShowInviteModal(true)}>
            <Key className="w-4 h-4" />
            Generate Invite Code
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Approval"
          value={mockPendingItems.length}
          icon={Clock}
          variant="primary"
        />
        <StatsCard
          title="Approved Today"
          value={12}
          icon={CheckCircle}
          variant="found"
          trend={{ value: 20, isPositive: true }}
        />
        <StatsCard
          title="Resolution Rate"
          value="85%"
          icon={TrendingUp}
          variant="resolved"
        />
        <StatsCard
          title="Avg Resolution Time"
          value="2.3 days"
          icon={BarChart3}
          variant="secondary"
        />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-card p-1 h-auto">
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-college data-[state=active]:text-primary-foreground">
            Pending ({mockPendingItems.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-college data-[state=active]:text-primary-foreground">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="invites" className="data-[state=active]:bg-gradient-college data-[state=active]:text-primary-foreground">
            Invite Codes
          </TabsTrigger>
        </TabsList>

        {/* Pending Items Tab */}
        <TabsContent value="pending" className="mt-6 space-y-4">
          {mockPendingItems.length > 0 ? (
            mockPendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {item.title}
                      </h3>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>📍 {item.location}</span>
                      <span>📅 {item.date}</span>
                      <span>👤 {item.reportedBy.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(item.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-found mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                All caught up!
              </h3>
              <p className="text-muted-foreground">No pending items to review</p>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Weekly Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="lost"
                      stroke="hsl(0, 72%, 51%)"
                      fillOpacity={1}
                      fill="url(#colorLost)"
                    />
                    <Area
                      type="monotone"
                      dataKey="found"
                      stroke="hsl(142, 71%, 45%)"
                      fillOpacity={1}
                      fill="url(#colorFound)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Resolution Status
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resolutionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {resolutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Invite Codes Tab */}
        <TabsContent value="invites" className="mt-6 space-y-4">
          {mockInviteCodes.map((invite, index) => (
            <motion.div
              key={invite.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <code className="text-lg font-mono font-bold text-foreground bg-muted px-3 py-1 rounded-lg">
                      {invite.code}
                    </code>
                    <Badge className={invite.type === 'society' ? 'badge-society' : 'badge-college'}>
                      {invite.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Uses: {invite.uses}/{invite.maxUses}</span>
                    <span>Expires: {invite.expiresAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyCode(invite.code)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Generate Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Generate Invite Code"
        size="md"
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Code Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setInviteType('society')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  inviteType === 'society'
                    ? 'border-society bg-society/10'
                    : 'border-border hover:border-society/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-society mx-auto mb-2 flex items-center justify-center">
                    <Key className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium">Society</span>
                </div>
              </button>
              <button
                onClick={() => setInviteType('college')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  inviteType === 'college'
                    ? 'border-college bg-college/10'
                    : 'border-border hover:border-college/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-college mx-auto mb-2 flex items-center justify-center">
                    <Key className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium">College</span>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Uses</label>
            <input
              type="number"
              defaultValue={50}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-college/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="college" className="flex-1" onClick={generateInviteCode}>
              Generate Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
