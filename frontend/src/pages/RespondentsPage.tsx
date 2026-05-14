import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { respondentAPI } from '@/api/respondent';
import { IRespondent } from '@/types/respondent';
import { RespondentList } from '@/components/RespondentList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export function RespondentsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => respondentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respondents'] });
      setRefreshTrigger((prev) => prev + 1);
    },
  });

  const handleEdit = (respondent: IRespondent) => {
    navigate(`/respondents/${respondent.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Respondents</h1>
          <p className="text-gray-600 mt-2">
            Manage survey respondents and their information
          </p>
        </div>

        <Link to="/respondents/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Respondent
          </Button>
        </Link>
      </div>

      <RespondentList
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
