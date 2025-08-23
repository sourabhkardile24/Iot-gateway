import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { HistoricalDataPoint, SensorData } from './MockIoTService';

interface AnalyticsChartsProps {
  historicalData: HistoricalDataPoint[];
  sensors: SensorData[];
}

export function AnalyticsCharts({ historicalData, sensors }: AnalyticsChartsProps) {
  const [selectedSensor, setSelectedSensor] = useState<string>(sensors[0]?.id || '');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  const getTimeRangeHours = (range: string) => {
    switch (range) {
      case '1h': return 1;
      case '6h': return 6;
      case '24h': return 24;
      default: return 1;
    }
  };

  const filteredData = historicalData
    .filter(point => {
      const hoursAgo = getTimeRangeHours(timeRange);
      const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      return point.sensorId === selectedSensor && point.timestamp >= cutoff;
    })
    .map(point => ({
      time: point.timestamp.toLocaleTimeString(),
      value: Number(point.value.toFixed(2)),
      timestamp: point.timestamp.getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const selectedSensorInfo = sensors.find(s => s.id === selectedSensor);

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const colors = {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    };

    const getChartColor = () => {
      switch (selectedSensorInfo?.type) {
        case 'temperature':
          return { stroke: '#ef4444', fill: '#fee2e2' };
        case 'humidity':
          return { stroke: '#3b82f6', fill: '#dbeafe' };
        case 'pressure':
          return { stroke: '#8b5cf6', fill: '#ede9fe' };
        case 'flow':
          return { stroke: '#10b981', fill: '#dcfce7' };
        case 'voltage':
        case 'current':
          return { stroke: '#f59e0b', fill: '#fef3c7' };
        default:
          return { stroke: '#6b7280', fill: '#f3f4f6' };
      }
    };

    const chartColors = getChartColor();

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.stroke} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number) => [
                `${value} ${selectedSensorInfo?.unit || ''}`, 
                selectedSensorInfo?.name || 'Value'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${chartColors.stroke}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColors.stroke}
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.stroke} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number) => [
                `${value} ${selectedSensorInfo?.unit || ''}`, 
                selectedSensorInfo?.name || 'Value'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${chartColors.stroke}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="url(#barGradient)" radius={[2, 2, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number) => [
                `${value} ${selectedSensorInfo?.unit || ''}`, 
                selectedSensorInfo?.name || 'Value'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${chartColors.stroke}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColors.stroke}
              strokeWidth={3}
              dot={{ fill: chartColors.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: chartColors.stroke, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-5" />
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-blue-800 dark:text-blue-200">Sensor Trends</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white/50 dark:bg-black/20 border-blue-200">
                  <SelectValue placeholder="Select sensor" />
                </SelectTrigger>
                <SelectContent>
                  {sensors.map(sensor => (
                    <SelectItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={(value: 'line' | 'area' | 'bar') => setChartType(value)}>
                <SelectTrigger className="w-full sm:w-[120px] bg-white/50 dark:bg-black/20 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={(value: '1h' | '6h' | '24h') => setTimeRange(value)}>
                <SelectTrigger className="w-full sm:w-[100px] bg-white/50 dark:bg-black/20 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="h-[400px] bg-white/50 dark:bg-black/10 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {selectedSensorInfo && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-green-100">Current</div>
              <div className="text-2xl font-bold">
                {filteredData[filteredData.length - 1]?.value || 0} {selectedSensorInfo.unit}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-blue-100">Average</div>
              <div className="text-2xl font-bold">
                {(filteredData.reduce((acc, point) => acc + point.value, 0) / filteredData.length).toFixed(2)} {selectedSensorInfo.unit}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-purple-100">Maximum</div>
              <div className="text-2xl font-bold">
                {Math.max(...filteredData.map(p => p.value)).toFixed(2)} {selectedSensorInfo.unit}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm text-orange-100">Minimum</div>
              <div className="text-2xl font-bold">
                {Math.min(...filteredData.map(p => p.value)).toFixed(2)} {selectedSensorInfo.unit}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}