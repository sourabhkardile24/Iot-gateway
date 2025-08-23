import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Circle, Square, Activity } from 'lucide-react';
import { DigitalInput, AnalogInput } from './MockIoTService';

interface DigitalInputCardProps {
  input: DigitalInput;
}

interface AnalogInputCardProps {
  input: AnalogInput;
}

export function DigitalInputCard({ input }: DigitalInputCardProps) {
  return (
    <Card className={`relative overflow-hidden border-0 ${
      input.value 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' 
        : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20'
    }`}>
      {input.value && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-5" />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">
          {input.name}
        </CardTitle>
        <div className={`p-1 rounded-full ${
          input.value 
            ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          <Circle className={`h-4 w-4 ${input.value ? 'text-white fill-white' : 'text-gray-500'}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              input.value 
                ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
                : 'border-gray-300 bg-background'
            }`}>
              <Square className="h-3 w-3" />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${
                input.value ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {input.value ? 'HIGH' : 'LOW'}
              </span>
              <span className="text-xs text-muted-foreground">
                Digital Input
              </span>
            </div>
          </div>
          
          <Badge 
            variant={input.status === 'active' ? 'default' : 'secondary'}
            className={`text-xs ${
              input.status === 'active' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                : ''
            }`}
          >
            {input.status}
          </Badge>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Last changed: {input.lastChanged.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalogInputCard({ input }: AnalogInputCardProps) {
  const percentage = ((input.value - input.range.min) / (input.range.max - input.range.min)) * 100;
  
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-5" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">
          {input.name}
        </CardTitle>
        <div className="p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
          <Activity className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold">
              {input.value.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {input.unit}
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
            Analog
          </Badge>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{input.range.min.toFixed(1)}{input.unit}</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">{percentage.toFixed(0)}%</span>
            <span>{input.range.max.toFixed(1)}{input.unit}</span>
          </div>
          <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/25"
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Updated: {input.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}