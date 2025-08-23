import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Power, Fan, Settings, Zap, AlertTriangle } from 'lucide-react';
import { ActuatorControl as ActuatorControlType } from './MockIoTService';

interface ActuatorControlProps {
  actuator: ActuatorControlType;
  onToggle: (id: string) => void;
}

const getActuatorIcon = (type: string) => {
  switch (type) {
    case 'pump':
      return Power;
    case 'motor':
      return Fan;
    case 'valve':
      return Settings;
    case 'switch':
      return Zap;
    default:
      return Power;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getActuatorColor = (type: string) => {
  switch (type) {
    case 'pump':
      return 'from-blue-500 to-cyan-500';
    case 'motor':
      return 'from-green-500 to-teal-500';
    case 'valve':
      return 'from-purple-500 to-indigo-500';
    case 'switch':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

const getActuatorBgColor = (type: string, state: boolean) => {
  const baseColors = {
    pump: state ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20' : '',
    motor: state ? 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20' : '',
    valve: state ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20' : '',
    switch: state ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20' : ''
  };
  return baseColors[type as keyof typeof baseColors] || '';
};

export function ActuatorControl({ actuator, onToggle }: ActuatorControlProps) {
  const Icon = getActuatorIcon(actuator.type);
  const isOffline = actuator.status === 'offline';
  const colorGradient = getActuatorColor(actuator.type);
  const bgColorClass = getActuatorBgColor(actuator.type, actuator.state);

  return (
    <Card className={`relative overflow-hidden border-0 ${bgColorClass} ${actuator.state ? 'ring-2 ring-primary/20' : ''}`}>
      {actuator.state && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-5`} />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">
          {actuator.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(actuator.status)}`} />
          <div className={`p-1 rounded-full ${actuator.state ? `bg-gradient-to-br ${colorGradient}` : 'bg-gray-200 dark:bg-gray-700'}`}>
            <Icon className={`h-4 w-4 ${actuator.state ? 'text-white' : 'text-gray-500'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={actuator.state}
              onCheckedChange={() => !isOffline && onToggle(actuator.id)}
              disabled={isOffline}
            />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${actuator.state ? `bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent` : ''}`}>
                {actuator.state ? 'ON' : 'OFF'}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {actuator.type}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant={actuator.status === 'online' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {actuator.status}
            </Badge>
            {isOffline && (
              <Button size="sm" variant="outline" className="text-xs h-6">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Last changed: {actuator.lastChanged.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}