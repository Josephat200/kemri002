import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { respondentAPI } from '@/api/respondent';
import { RespondentForm } from '@/components/RespondentForm';
import { RespondentFormData } from '@/lib/validations';
import { useApp } from '@/contexts/AppContext';

export function CreateRespondentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addAlert } = useApp();

  const createMutation = useMutation({
    mutationFn: (data: RespondentFormData) => respondentAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respondents'] });
      addAlert('Respondent created successfully!', 'success');
      navigate('/respondents');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to create respondent';
      addAlert(errorMessage, 'error');
    },
  });

  const handleSubmit = async (data: RespondentFormData) => {
    await createMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Respondent</h1>
        <p className="text-gray-600 mt-2">
          Enter the respondent's information to create a new survey record
        </p>
      </div>

      <RespondentForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
