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
    } catch (error: any) {
      if (!error || !error.errorFields) {
        console.error('Validation failed:', error);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    form.resetFields();
    modalProps.onCancel?.(e);
  };

  return (
    <Modal
      {...modalProps}
      destroyOnHidden={false}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      maskClosable={false}
      centered
      styles={{
        body: {
          maxHeight: '68vh',
          overflowY: 'auto',
          paddingRight: 4,
        },
      }}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          preserve
          {...formProps}
          style={{ marginTop: 16, ...formProps?.style }}
        >
          {children}
        </Form>
      </Spin>
    </Modal>
  );
}
