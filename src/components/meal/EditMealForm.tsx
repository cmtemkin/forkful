
import React from 'react';
import FormHookMealForm from './FormHookMealForm';
import StateMealForm from './StateMealForm';
import { FormHookProps, StateProps } from './types/MealFormTypes';

// Union type to allow either prop style
export type EditMealFormProps = FormHookProps | StateProps;

const EditMealForm = (props: EditMealFormProps) => {
  // Check which type of props we're dealing with
  const isFormHook = 'register' in props;
  
  if (isFormHook) {
    // Handle form-hook based props
    return <FormHookMealForm {...props as FormHookProps} />;
  } else {
    // Handle direct state management props
    return <StateMealForm {...props as StateProps} />;
  }
};

export default EditMealForm;
