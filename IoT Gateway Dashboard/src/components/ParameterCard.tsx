import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Thermometer, Droplets, Gauge, Zap, Activity } from 'lucide-react';
import { SensorData } from './MockIoTService';

interface ParameterCardProps {
  sensor: SensorData;
}

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'temperature':
      return Thermometer;
    case 'humidity':
      return Droplets;
    case 'pressure':
      return Gauge;
    case 'voltage':
    case 'current':
      return Zap;
    default:
      return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'online':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'offline':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getSensorColor = (type: string) => {
  switch (type) {
    case 'temperature':
      return 'from-red-500 to-orange-500';
    case 'humidity':
      return 'from-blue-500 to-cyan-500';
    case 'pressure':
      return 'from-purple-500 to-indigo-500';
    case 'flow':
      return 'from-green-500 to-teal-500';
    case 'voltage':
    case 'current':
      return 'from-yellow-500 to-amber-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

const getSensorBgColor = (type: string) => {
  switch (type) {
    case 'temperature':
      return 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20';
    case 'humidity':
      return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20';
    case 'pressure':
      return 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20';
    case 'flow':
      return 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20';
    case 'voltage':
    case 'current':
      return 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20';
    default:
      return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20';
  }
};

export function ParameterCard({ sensor }: ParameterCardProps) {
  const Icon = getSensorIcon(sensor.type);
  const isOutOfRange = sensor.value < sensor.min || sensor.value > sensor.max;
  const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
  const colorGradient = getSensorColor(sensor.type);
  const bgColorClass = getSensorBgColor(sensor.type);

  return (
    <Card className={`relative overflow-hidden border-0 ${bgColorClass}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-5`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">
          {sensor.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)}`} />
          <div className={`p-1 rounded-full bg-gradient-to-br ${colorGradient}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <div className={`text-2xl font-bold ${isOutOfRange ? 'text-red-600 dark:text-red-400' : ''}`}>
              {sensor.value.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              {sensor.unit}
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(sensor.status)} className="text-xs">
            {sensor.status}
          </Badge>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{sensor.min}{sensor.unit}</span>
            <span>{sensor.max}{sensor.unit}</span>
          </div>
          <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOutOfRange 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                  : `bg-gradient-to-r ${colorGradient}`
              }`}
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            />
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Updated: {sensor.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}