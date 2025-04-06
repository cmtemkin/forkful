
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEditMeal } from '@/hooks/useEditMeal';
import EditMealHeader from '@/components/meal/EditMealHeader';
import EditMealForm from '@/components/meal/EditMealForm';
import EditMealLoader from '@/components/meal/EditMealLoader';

const EditMeal = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isLoading,
    originalMeal,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    date,
    handleDateChange,
    handleImageUrlChange,
    handleImageError,
    onSubmit
  } = useEditMeal(id);
  
  if (!originalMeal) {
    return <EditMealLoader />;
  }
  
  return (
    <div className="pb-20">
      <EditMealHeader 
        id={id || ''} 
        isLoading={isLoading} 
        onSave={handleSubmit(onSubmit)} 
      />
      
      <div className="pt-16 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <EditMealForm
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            date={date}
            onDateChange={handleDateChange}
            onImageUrlChange={handleImageUrlChange}
            onImageError={handleImageError}
          />
        </form>
      </div>
    </div>
  );
};

export default EditMeal;
