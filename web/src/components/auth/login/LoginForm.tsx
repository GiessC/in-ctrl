import type { LoginFormValues } from '@/app/auth/login/page';
import Button from '@/components/common/button/button';
import TextInput from '@/components/common/textInput/textInput';
import { Form, type FormikErrors } from 'formik';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';

interface LoginFormProps {
    values: LoginFormValues;
    isDirty: boolean;
    errors: FormikErrors<LoginFormValues>;
    isValid: boolean;
    isSubmitting: boolean;
    handleChange: (e?: ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e?: FocusEvent<HTMLInputElement>) => void;
    handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({
    values,
    isDirty,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
}: LoginFormProps) => (
    <Form onSubmit={handleSubmit}>
        <TextInput
            id='username'
            label='Username'
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            isError={!!errors.username}
            errorText={errors.username}
            required
        />
        <TextInput
            id='password'
            label='Password'
            type='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            isError={!!errors.password}
            errorText={errors.password}
            required
        />
        <Button
            className='mt-2'
            type='submit'
            disabled={!isDirty || !isValid || isSubmitting}
        >
            Login
        </Button>
    </Form>
);

export default LoginForm;
