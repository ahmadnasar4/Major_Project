import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, Brain, Target, Activity, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ThemeToggle } from "../components/theme-toggle";
import { API_ENDPOINTS } from '../../api-config';

export function MLStatsPage() {
  const navigate = useNavigate();
  
  // --- REAL DATA STATES ---
  const [sensitivityData, setSensitivityData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [threatData, setThreatData] = useState([]);
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    throughput: "0 MB/s",
    cpuLoad: 0,
    lastUpdate: "Loading..."
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL ANALYTICS FROM BACKEND ---
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Updated URL and added credentials
        const response = await fetch(`${API_ENDPOINTS}/api/ml-stats`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          setSensitivityData(data.sensitivity_dist);
          setPerformanceData(data.performance_history);
          setThreatData(data.threat_capabilities);
          setMetrics({
            accuracy: data.model_accuracy,
            throughput: data.current_throughput,
            cpuLoad: Number(data.cpuLoad) || 0,
            lastUpdate: data.last_model_update || "Just now"
          });
        }
      } catch (error) {
        console.error("Failed to fetch security analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-app)' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--brand-primary)' }} />
        <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>Analyzing Neural Patterns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: 'var(--sensitivity-medium-text)' }}></div>
      </div>

      <header className="relative z-10 backdrop-blur-xl" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>ML Analytics Dashboard</h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Real-time security intelligence & performance metrics
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-brand-primary-light border border-brand-primary">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
            <p className="text-sm text-secondary">Model Detection Accuracy</p>
            <p className="text-3xl font-semibold mt-1">{metrics.accuracy}%</p>
          </Card>

          <Card className="p-6 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-500/10 border border-yellow-500">
                <Brain className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-sm text-secondary">Encryption Throughput</p>
            <p className="text-3xl font-semibold mt-1">{metrics.throughput}</p>
          </Card>

          <Card className="p-6 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-500/10 border border-gray-500">
                <Activity className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <p className="text-sm text-secondary">Current CPU Load</p>
            <p className="text-3xl font-semibold mt-1">{metrics.cpuLoad}%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Threat Radar Chart */}
          <Card className="p-6 bg-surface">
            <h2 className="text-lg font-semibold mb-6">Threat Detection Vector</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={threatData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Radar dataKey="value" stroke="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribution Pie Chart */}
          <Card className="p-6 bg-surface">
            <h2 className="text-lg font-semibold mb-6">Sensitivity Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sensitivityData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {sensitivityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Performance Line Chart */}
        <Card className="p-6 bg-surface mb-6">
          <h2 className="text-lg font-semibold mb-6">Real-Time Performance Metrics</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="var(--brand-primary)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--sensitivity-medium-text)" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="encryption" stroke="var(--brand-primary)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="cpu" stroke="var(--sensitivity-medium-text)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* ML Model Info Footer */}
        <div className="rounded-lg p-6 border bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-brand-primary" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div>
                <p className="text-xs text-tertiary uppercase font-bold">Model Architecture</p>
                <p className="text-sm font-mono">Random Forest + Entropy Analysis</p>
              </div>
              <div>
                <p className="text-xs text-tertiary uppercase font-bold">Inference Speed</p>
                <p className="text-sm font-mono">~14ms / File</p>
              </div>
              <div>
                <p className="text-xs text-tertiary uppercase font-bold">Last Trained</p>
                <p className="text-sm font-mono">{metrics.lastUpdate}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}