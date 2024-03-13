'use client';

import login from '@/app/api/auth/login/login';
import LoginForm from '@/components/auth/login/LoginForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

export interface LoginFormValues {
    username: string;
    password: string;
}

const INITIAL_VALUES: LoginFormValues = {
    username: '',
    password: '',
};

const VALIDATION_SCHEMA: Yup.Schema<LoginFormValues> = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    return (
        <Formik
            validationSchema={VALIDATION_SCHEMA}
            initialValues={INITIAL_VALUES}
            onSubmit={(values, { setSubmitting }) => {
                login(values);
                setSubmitting(false);
            }}
        >
            {({
                values,
                dirty,
                errors,
                isValid,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
            }) => (
                <LoginForm
                    values={values}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isDirty={dirty}
                    isValid={isValid}
                />
            )}
        </Formik>
    );
};

export default LoginPage;
