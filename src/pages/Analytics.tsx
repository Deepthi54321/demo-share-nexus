import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Clock,
  Target,
  DollarSign,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Generate different data based on time range
  const getPerformanceData = (range: string) => {
    const baseData = {
      '7d': [
        { name: 'Mon', sessions: 45, conversion: 32, revenue: 2400 },
        { name: 'Tue', sessions: 52, conversion: 28, revenue: 2800 },
        { name: 'Wed', sessions: 48, conversion: 35, revenue: 3200 },
        { name: 'Thu', sessions: 61, conversion: 42, revenue: 3800 },
        { name: 'Fri', sessions: 55, conversion: 38, revenue: 3400 },
        { name: 'Sat', sessions: 67, conversion: 45, revenue: 4200 },
        { name: 'Sun', sessions: 58, conversion: 40, revenue: 3600 },
      ],
      '30d': [
        { name: 'Week 1', sessions: 312, conversion: 35, revenue: 18500 },
        { name: 'Week 2', sessions: 298, conversion: 42, revenue: 21200 },
        { name: 'Week 3', sessions: 356, conversion: 38, revenue: 19800 },
        { name: 'Week 4', sessions: 387, conversion: 45, revenue: 23400 },
      ],
      '90d': [
        { name: 'Month 1', sessions: 1250, conversion: 38, revenue: 75000 },
        { name: 'Month 2', sessions: 1380, conversion: 42, revenue: 82800 },
        { name: 'Month 3', sessions: 1456, conversion: 45, revenue: 87360 },
      ],
      '1y': [
        { name: 'Q1', sessions: 4200, conversion: 38, revenue: 252000 },
        { name: 'Q2', sessions: 4650, conversion: 42, revenue: 279000 },
        { name: 'Q3', sessions: 5100, conversion: 45, revenue: 306000 },
        { name: 'Q4', sessions: 5400, conversion: 48, revenue: 324000 },
      ]
    };
    return baseData[range as keyof typeof baseData] || baseData['7d'];
  };

  const getMetrics = (range: string) => {
    const metricsData = {
      '7d': { sessions: '386', users: '1,429', avgTime: '24m 32s', conversion: '34.8%' },
      '30d': { sessions: '1,653', users: '5,247', avgTime: '26m 45s', conversion: '40.2%' },
      '90d': { sessions: '4,986', users: '14,832', avgTime: '28m 12s', conversion: '41.7%' },
      '1y': { sessions: '19,350', users: '52,680', avgTime: '29m 38s', conversion: '43.3%' }
    };
    return metricsData[range as keyof typeof metricsData] || metricsData['7d'];
  };

  const performanceData = getPerformanceData(timeRange);
  const currentMetrics = getMetrics(timeRange);

  // Mock data for charts
  const demoTypeData = [
    { name: 'Product Demo', value: 45, color: '#3b82f6' },
    { name: 'Sales Demo', value: 30, color: '#10b981' },
    { name: 'Training', value: 15, color: '#f59e0b' },
    { name: 'Onboarding', value: 10, color: '#ef4444' },
  ];

  const userEngagementData = [
    { name: 'Jan', active: 65, new: 28, returning: 37 },
    { name: 'Feb', active: 72, new: 32, returning: 40 },
    { name: 'Mar', active: 68, new: 25, returning: 43 },
    { name: 'Apr', active: 78, new: 35, returning: 43 },
    { name: 'May', active: 82, new: 38, returning: 44 },
    { name: 'Jun', active: 85, new: 42, returning: 43 },
  ];

  const metrics = [
    {
      title: 'Total Sessions',
      value: currentMetrics.sessions,
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: currentMetrics.users,
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Session Time',
      value: currentMetrics.avgTime,
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Conversion Rate',
      value: currentMetrics.conversion,
      change: '+5.4%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    toast({
      title: "Refreshing Data",
      description: "Updating analytics data...",
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: `Exporting ${timeRange} analytics data to CSV...`,
    });
    
    // Create CSV content based on current data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Period,Sessions,Conversion Rate,Revenue\n" +
      performanceData.map(row => 
        `"${row.name}","${row.sessions}","${row.conversion}%","$${row.revenue}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `Analytics data for ${timeRange} exported successfully.`,
    });
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast({
      title: "Time Range Updated",
      description: `Showing data for ${range}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Track performance and gain insights from your demo sessions
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Trends */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance Trends ({timeRange})
              </CardTitle>
              <CardDescription>
                Session volume and conversion rates over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversion" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Demo Types Distribution */}
          {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Demo Types Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of demo sessions by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demoTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {demoTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {demoTypeData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* User Engagement Chart */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              User Engagement
            </CardTitle>
            <CardDescription>
              Track active, new, and returning users over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="returning" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest demo sessions and user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: 'John Doe', action: 'Completed Product Demo', time: '2 minutes ago', status: 'success' },
                { user: 'Sarah Johnson', action: 'Started Sales Demo', time: '15 minutes ago', status: 'active' },
                { user: 'Mike Chen', action: 'Cancelled Training Session', time: '1 hour ago', status: 'cancelled' },
                { user: 'Emma Wilson', action: 'Finished Onboarding', time: '2 hours ago', status: 'success' },
                { user: 'David Brown', action: 'Scheduled Product Demo', time: '3 hours ago', status: 'scheduled' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{activity.user}</p>
                      <p className="text-sm text-slate-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'active' ? 'secondary' :
                      activity.status === 'cancelled' ? 'destructive' :
                      'outline'
                    }>
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-slate-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
