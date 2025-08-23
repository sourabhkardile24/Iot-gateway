import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Filter } from 'lucide-react';
import { useState } from 'react';
import { HistoricalDataPoint, SensorData, ActuatorControl } from './MockIoTService';

interface HistoryTableProps {
  historicalData: HistoricalDataPoint[];
  sensors: SensorData[];
  actuators: ActuatorControl[];
}

type EventType = 'sensor_reading' | 'actuator_change' | 'alarm' | 'system';

interface HistoryEvent {
  id: string;
  timestamp: Date;
  type: EventType;
  source: string;
  description: string;
  value?: string;
  severity: 'info' | 'warning' | 'error';
}

export function HistoryTable({ historicalData, sensors, actuators }: HistoryTableProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Generate mock events based on data
  const generateEvents = (): HistoryEvent[] => {
    const events: HistoryEvent[] = [];
    
    // Add recent sensor readings
    const recentData = historicalData.slice(-20);
    recentData.forEach((point, index) => {
      const sensor = sensors.find(s => s.id === point.sensorId);
      if (sensor) {
        events.push({
          id: `sensor_${index}`,
          timestamp: point.timestamp,
          type: 'sensor_reading',
          source: sensor.name,
          description: `Sensor reading updated`,
          value: `${point.value.toFixed(2)} ${sensor.unit}`,
          severity: point.value < sensor.min || point.value > sensor.max ? 'warning' : 'info'
        });
      }
    });

    // Add actuator changes
    actuators.forEach((actuator, index) => {
      events.push({
        id: `actuator_${index}`,
        timestamp: actuator.lastChanged,
        type: 'actuator_change',
        source: actuator.name,
        description: `Actuator ${actuator.state ? 'turned ON' : 'turned OFF'}`,
        value: actuator.state ? 'ON' : 'OFF',
        severity: 'info'
      });
    });

    // Add some mock system events
    const now = new Date();
    events.push(
      {
        id: 'system_1',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        type: 'system',
        source: 'IoT Gateway',
        description: 'System started successfully',
        severity: 'info'
      },
      {
        id: 'alarm_1',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
        type: 'alarm',
        source: 'Temperature Sensor',
        description: 'Temperature exceeded threshold',
        value: '35.2°C',
        severity: 'warning'
      }
    );

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const events = generateEvents();

  const filteredEvents = events.filter(event => {
    if (selectedType !== 'all' && event.type !== selectedType) return false;
    if (selectedSource !== 'all' && event.source !== selectedSource) return false;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      case 'info':
      default:
        return <Badge variant="default">Info</Badge>;
    }
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'sensor_reading':
        return 'text-blue-600 dark:text-blue-400';
      case 'actuator_change':
        return 'text-green-600 dark:text-green-400';
      case 'alarm':
        return 'text-red-600 dark:text-red-400';
      case 'system':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const uniqueSources = Array.from(new Set(events.map(e => e.source)));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Event History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sensor_reading">Sensor</SelectItem>
                <SelectItem value="actuator_change">Actuator</SelectItem>
                <SelectItem value="alarm">Alarm</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.slice(0, 50).map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm">
                    {event.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm capitalize ${getTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.source}
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.description}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    {event.value || '-'}
                  </TableCell>
                  <TableCell>
                    {getSeverityBadge(event.severity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No events found for the selected filters.
          </div>
        )}
        
        {filteredEvents.length > 50 && (
          <div className="text-center py-4 text-muted-foreground">
            Showing first 50 of {filteredEvents.length} events.
          </div>
        )}
      </CardContent>
    </Card>
  );
}