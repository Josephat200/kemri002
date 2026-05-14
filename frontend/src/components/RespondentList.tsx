import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { respondentAPI } from '@/api/respondent';
import { IRespondent } from '@/types/respondent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface RespondentListProps {
  onEdit?: (respondent: IRespondent) => void;
  onDelete?: (id: number) => Promise<void>;
  refreshTrigger?: number;
}

export function RespondentList({
  onEdit,
  onDelete,
  refreshTrigger = 0,
}: RespondentListProps) {
  const { addAlert } = useApp();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deleting, setDeleting] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['respondents', page, limit, refreshTrigger],
    queryFn: () => respondentAPI.getAll(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this respondent?')) {
      return;
    }

    setDeleting(id);
    try {
      if (onDelete) {
        await onDelete(id);
      }
      addAlert('Respondent deleted successfully', 'success');
    } catch (error) {
      addAlert('Failed to delete respondent', 'error');
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">Loading respondents...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6 text-center">
          <p className="text-red-600">Error loading respondents</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.respondents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">No respondents found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Respondents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Serial No</th>
                  <th className="text-left py-3 px-4 font-medium">School</th>
                  <th className="text-left py-3 px-4 font-medium">Supervisor</th>
                  <th className="text-left py-3 px-4 font-medium">Age</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.respondents.map((respondent) => (
                  <tr key={respondent.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{respondent.serial_no}</td>
                    <td className="py-3 px-4">{respondent.school_name}</td>
                    <td className="py-3 px-4">{respondent.supervisor_name}</td>
                    <td className="py-3 px-4">{respondent.age}</td>
                    <td className="py-3 px-4">
                      {new Date(respondent.collection_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(respondent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deleting === respondent.id}
                            onClick={() => handleDelete(respondent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, data.pagination.total)} of{' '}
              {data.pagination.total} respondents
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page === data.pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
