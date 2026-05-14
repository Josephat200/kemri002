import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { respondentAPI } from '@/api/respondent';
import { RespondentForm } from '@/components/RespondentForm';
import { RespondentFormData } from '@/lib/validations';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export function EditRespondentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addAlert } = useApp();

  const respondentId = parseInt(id || '0');

  const { data: respondent, isLoading, error } = useQuery({
    queryKey: ['respondent', respondentId],
    queryFn: () => respondentAPI.getById(respondentId),
    enabled: !!respondentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<RespondentFormData>) =>
      respondentAPI.update(respondentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respondents'] });
      queryClient.invalidateQueries({ queryKey: ['respondent', respondentId] });
      addAlert('Respondent updated successfully!', 'success');
      navigate('/respondents');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to update respondent';
      addAlert(errorMessage, 'error');
    },
  });

  const handleSubmit = async (data: RespondentFormData) => {
    // Only send changed fields
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Respondent</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Loading respondent information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !respondent) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Respondent</h1>
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">
              Failed to load respondent. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Respondent</h1>
        <p className="text-gray-600 mt-2">
          Update respondent information for {respondent.serial_no}
        </p>
      </div>

      <RespondentForm
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        defaultValues={respondent}
        isEditing={true}
      />
    </div>
  );
}
