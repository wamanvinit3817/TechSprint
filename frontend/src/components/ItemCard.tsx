import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type ItemStatus = 'lost' | 'found' | 'resolved';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ItemStatus;
  location: string;
  date: string;
  time?: string;
  image?: string;
  reportedBy: {
    name: string;
    avatar?: string;
  };
  isPriority?: boolean;
  societyName?: string;
}

interface ItemCardProps {
  item: Item;
  onView?: (item: Item) => void;
  onClaim?: (item: Item) => void;
}

const statusConfig = {
  lost: {
    label: 'Lost',
    className: 'badge-lost',
    dotClass: 'status-dot-lost',
  },
  found: {
    label: 'Found',
    className: 'badge-found',
    dotClass: 'status-dot-found',
  },
  resolved: {
    label: 'Resolved',
    className: 'badge-resolved',
    dotClass: 'status-dot-resolved',
  },
};

export function ItemCard({ item, onView, onClaim }: ItemCardProps) {
  const statusInfo = statusConfig[item.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      transition={{ duration: 0.3 }}
      className="glass-card card-3d overflow-hidden group cursor-pointer"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      onClick={() => onView?.(item)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-6xl opacity-30">📦</div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={`${statusInfo.className} px-3 py-1 font-semibold`}>
            <span className={`${statusInfo.dotClass} mr-2`} />
            {statusInfo.label}
          </Badge>
          {item.isPriority && (
            <Badge className="bg-gradient-secondary text-secondary-foreground px-3 py-1">
              Priority
            </Badge>
          )}
        </div>

        {/* Society Badge */}
        {item.societyName && (
          <Badge className="absolute top-3 right-3 badge-society px-3 py-1">
            {item.societyName}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title & Category */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
            {item.category}
          </p>
          <h3 className="font-display text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{item.date}</span>
          </div>
          {item.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{item.time}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              {item.reportedBy.avatar ? (
                <img
                  src={item.reportedBy.avatar}
                  alt={item.reportedBy.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
            <span className="text-sm font-medium">{item.reportedBy.name}</span>
          </div>

          {item.status === 'found' && onClaim && (
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onClaim(item);
              }}
              className="group/btn"
            >
              Claim
              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
