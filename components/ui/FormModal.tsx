'use client';

import React from 'react';
import { Modal, Form, Spin } from 'antd';
import type { FormInstance, ModalProps, FormProps } from 'antd';

interface FormModalProps<T = Record<string, unknown>> extends Omit<ModalProps, 'onOk'> {
  form: FormInstance<T>;
  onSubmit: (values: T) => void | Promise<void>;
  loading?: boolean;
  formProps?: Omit<FormProps, 'form'>;
  children: React.ReactNode;
}

export default function FormModal<T = Record<string, unknown>>({
  form,
  onSubmit,
  loading = false,
  formProps,
  children,
  ...modalProps
}: FormModalProps<T>) {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Form validation failed, errors will be shown on fields
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    form.resetFields();
    modalProps.onCancel?.(e);
  };

  return (
    <Modal
      {...modalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnHidden
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          {...formProps}
          style={{ marginTop: 16, ...formProps?.style }}
        >
          {children}
        </Form>
      </Spin>
    </Modal>
  );
}
