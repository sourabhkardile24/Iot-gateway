import { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { ParameterCard } from './components/ParameterCard';
import { ActuatorControl } from './components/ActuatorControl';
import { DigitalInputCard, AnalogInputCard } from './components/InputDisplays';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { HistoryTable } from './components/HistoryTable';
import { useMockIoTData } from './components/MockIoTService';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { sensors, digitalInputs, analogInputs, actuators, historicalData, toggleActuator } = useMockIoTData();

  const connectionStatus = 'connected'; // Mock connection status
  const totalAlarms = sensors.filter(s => s.value < s.min || s.value > s.max).length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
          <CardContent className="p-4 flex items-center gap-3">
            {connectionStatus === 'connected' ? (
              <Wifi className="h-8 w-8 text-white" />
            ) : (
              <WifiOff className="h-8 w-8 text-red-200" />
            )}
            <div>
              <p className="text-sm text-emerald-100">Gateway Status</p>
              <p className="font-medium capitalize text-white">{connectionStatus}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-8 w-8 text-white" />
            <div>
              <p className="text-sm text-blue-100">Active Sensors</p>
              <p className="font-medium text-white">{sensors.filter(s => s.status === 'online').length}/{sensors.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-0 text-white ${totalAlarms > 0 ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-white" />
            <div>
              <p className={`text-sm ${totalAlarms > 0 ? 'text-red-100' : 'text-green-100'}`}>Active Alarms</p>
              <p className="font-medium text-white">{totalAlarms}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 border-0 text-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-8 w-8 text-white" />
            <div>
              <p className="text-sm text-purple-100">Actuators Online</p>
              <p className="font-medium text-white">{actuators.filter(a => a.status === 'online').length}/{actuators.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Parameters */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-blue-800 dark:text-blue-200">Sensor Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sensors.map(sensor => (
            <ParameterCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-green-800 dark:text-green-200">Quick Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actuators.slice(0, 4).map(actuator => (
            <ActuatorControl key={actuator.id} actuator={actuator} onToggle={toggleActuator} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderParameters = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-blue-800 dark:text-blue-200">Sensor Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map(sensor => (
            <ParameterCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-green-800 dark:text-green-200">Digital Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {digitalInputs.map(input => (
            <DigitalInputCard key={input.id} input={input} />
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-purple-800 dark:text-purple-200">Analog Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analogInputs.map(input => (
            <AnalogInputCard key={input.id} input={input} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg">
        <h3 className="mb-4 text-green-800 dark:text-green-200">Actuator Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actuators.map(actuator => (
            <ActuatorControl key={actuator.id} actuator={actuator} onToggle={toggleActuator} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <AnalyticsCharts historicalData={historicalData} sensors={sensors} />
  );

  const renderHistory = () => (
    <HistoryTable historicalData={historicalData} sensors={sensors} actuators={actuators} />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gateway Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Gateway IP</label>
                <p className="text-sm text-muted-foreground">192.168.1.100</p>
              </div>
              <div>
                <label className="text-sm font-medium">Port</label>
                <p className="text-sm text-muted-foreground">8080</p>
              </div>
              <div>
                <label className="text-sm font-medium">Protocol</label>
                <p className="text-sm text-muted-foreground">MQTT</p>
              </div>
              <div>
                <label className="text-sm font-medium">Update Interval</label>
                <p className="text-sm text-muted-foreground">5 seconds</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'parameters':
        return renderParameters();
      case 'controls':
        return renderControls();
      case 'analytics':
        return renderAnalytics();
      case 'history':
        return renderHistory();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-screen">
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </DashboardLayout>
    </div>
  );
}