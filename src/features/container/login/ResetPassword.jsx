import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import resetPasswordApi from '../../../api/user/resetPasswordApi';
import { useHistory, useParams } from 'react-router-dom';
import './login.css';

function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { token } = useParams();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await resetPasswordApi.resetPassword(token, values.password);
            history.push('/login');
        } catch (error) {
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <Card title="Đặt lại mật khẩu" className="reset-password-card">
                <Form
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default ResetPassword;