import { useForm } from 'react-hook-form';
import { RespondentFormData } from '@/lib/validations';
import { IRespondent } from '@/types/respondent';
import { RESPONDENT_CONSTANTS, AGE_OPTIONS, FAMILY_SIZE_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface RespondentFormProps {
  onSubmit: (data: RespondentFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<IRespondent>;
  isEditing?: boolean;
}

export function RespondentForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  isEditing = false,
}: RespondentFormProps) {
  const { addAlert } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RespondentFormData>({
    defaultValues: (defaultValues as Partial<RespondentFormData>) || {
      older_siblings: 0,
      parents_give_pocket_money: 0,
      guardian_visits: 0,
      has_rh_info: 0,
      info_adequate: 0,
    },
  });

  const has_rh_info = watch('has_rh_info');

  const handleFormSubmit = async (data: RespondentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      addAlert('Failed to save respondent', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_no">Serial Number *</Label>
              <Input
                id="serial_no"
                placeholder="RH001"
                disabled={isEditing}
                {...register('serial_no')}
              />
              {errors.serial_no && (
                <p className="text-sm text-red-600">{errors.serial_no.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_name">School Name *</Label>
              <Input
                id="school_name"
                placeholder="Kennedy High School"
                {...register('school_name')}
              />
              {errors.school_name && (
                <p className="text-sm text-red-600">{errors.school_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor_name">Supervisor Name *</Label>
              <Input
                id="supervisor_name"
                placeholder="John Doe"
                {...register('supervisor_name')}
              />
              {errors.supervisor_name && (
                <p className="text-sm text-red-600">{errors.supervisor_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_date">Collection Date *</Label>
              <Input
                id="collection_date"
                type="date"
                {...register('collection_date')}
              />
              {errors.collection_date && (
                <p className="text-sm text-red-600">{errors.collection_date.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Respondent Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Respondent Demographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (15-19) *</Label>
              <Select {...register('age', { valueAsNumber: true })}>
                <option value="">Select Age</option>
                {AGE_OPTIONS.map((age) => (
                  <option key={age} value={age}>
                    {age} years
                  </option>
                ))}
              </Select>
              {errors.age && (
                <p className="text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_size">Family Size *</Label>
              <Select {...register('family_size', { valueAsNumber: true })}>
                <option value="">Select Family Size</option>
                {FAMILY_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} members
                  </option>
                ))}
              </Select>
              {errors.family_size && (
                <p className="text-sm text-red-600">{errors.family_size.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stay_with">Stays With *</Label>
              <Select {...register('stay_with', { valueAsNumber: true })}>
                <option value="">Select Option</option>
                {Object.entries(RESPONDENT_CONSTANTS.STAY_WITH).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.stay_with && (
                <p className="text-sm text-red-600">{errors.stay_with.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Religion *</Label>
              <Select {...register('religion', { valueAsNumber: true })}>
                <option value="">Select Religion</option>
                {Object.entries(RESPONDENT_CONSTANTS.RELIGION).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.religion && (
                <p className="text-sm text-red-600">{errors.religion.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle>Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian_occupation">Guardian Occupation *</Label>
              <Select {...register('guardian_occupation', { valueAsNumber: true })}>
                <option value="">Select Occupation</option>
                {Object.entries(RESPONDENT_CONSTANTS.GUARDIAN_OCCUPATION).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.guardian_occupation && (
                <p className="text-sm text-red-600">{errors.guardian_occupation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_occupation_other">
                Guardian Occupation - Other
              </Label>
              <Input
                id="guardian_occupation_other"
                placeholder="Specify if other"
                {...register('guardian_occupation_other')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_education">Guardian Education *</Label>
              <Select {...register('guardian_education', { valueAsNumber: true })}>
                <option value="">Select Education Level</option>
                {Object.entries(RESPONDENT_CONSTANTS.GUARDIAN_EDUCATION).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.guardian_education && (
                <p className="text-sm text-red-600">{errors.guardian_education.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="financial_support_source">Financial Support Source *</Label>
              <Select {...register('financial_support_source', { valueAsNumber: true })}>
                <option value="">Select Support Source</option>
                {Object.entries(RESPONDENT_CONSTANTS.FINANCIAL_SUPPORT).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.financial_support_source && (
                <p className="text-sm text-red-600">{errors.financial_support_source.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Guardian Support</h4>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('older_siblings', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Has older siblings</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('siblings_have_partners', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Siblings have partners</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('parents_give_pocket_money', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Parents give pocket money</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('pocket_money_adequate', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Pocket money is adequate</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('guardian_visits', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Guardian visits school</span>
            </label>

            <div className="space-y-2">
              <Label htmlFor="school_visitor">School Visitor Frequency</Label>
              <Select
                {...register('school_visitor', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
              >
                <option value="">Select Frequency</option>
                {Object.entries(RESPONDENT_CONSTANTS.SCHOOL_VISITOR).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reproductive Health Information */}
      <Card>
        <CardHeader>
          <CardTitle>Reproductive Health Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 border-b pb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('has_rh_info', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Has received RH information</span>
            </label>
          </div>

          {has_rh_info === 1 && (
            <>
              <div className="space-y-3 border-b pb-4">
                <h4 className="font-medium">Sources of RH Information</h4>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rh_teacher', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Teacher</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rh_parents', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Parents</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rh_health_worker', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Health Worker</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rh_friends', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Friends</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rh_media', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Media</span>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Topics Covered</h4>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('topic_sexuality', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Sexuality</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('topic_abstinence', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Abstinence</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('topic_condoms', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Condoms</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('topic_sti_hiv', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">STI/HIV</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('topic_relationships', {
                      setValueAs: (value) => (value ? 1 : 0),
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Relationships</span>
                </label>
              </div>
            </>
          )}

          <div className="border-t pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('info_adequate', {
                  setValueAs: (value) => (value ? 1 : 0),
                })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Information received is adequate</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'} Respondent
        </Button>
      </div>
    </form>
  );
}
