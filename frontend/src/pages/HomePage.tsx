import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Users,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          KEMRI RH Survey System
        </h1>
        <p className="text-lg text-gray-600">
          Reproductive Health Data Collection & Analysis
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/respondents/new">
          <Button className="w-full h-20 text-lg" size="lg">
            <PlusCircle className="h-6 w-6 mr-2" />
            Add New Respondent
          </Button>
        </Link>

        <Link to="/respondents">
          <Button variant="outline" className="w-full h-20 text-lg" size="lg">
            <Users className="h-6 w-6 mr-2" />
            View All Respondents
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Respondents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Load from server</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RH Info Adequate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Information adequacy rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">New entries recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium">Respondent Management</h4>
                <p className="text-sm text-gray-600">
                  Create, view, edit, and delete respondent records
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium">Comprehensive Data Collection</h4>
                <p className="text-sm text-gray-600">
                  Collect detailed information on demographics, RH knowledge, and sources
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium">Data Validation</h4>
                <p className="text-sm text-gray-600">
                  Real-time validation ensures data integrity
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-medium">Easy Search & Filter</h4>
                <p className="text-sm text-gray-600">
                  Find respondents by school, date range, or other criteria
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p>
            This system helps collect and manage reproductive health survey data from respondents
            aged 15-19. Use the form to enter respondent information or view existing records in
            the respondents list.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
