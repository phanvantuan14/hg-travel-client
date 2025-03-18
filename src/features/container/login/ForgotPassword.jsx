import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import resetPasswordApi from '../../../api/user/resetPasswordApi';
import { useHistory } from 'react-router-dom';
import './login.css';

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await resetPasswordApi.forgotPassword(values.email);
            history.push('/login');
        } catch (error) {
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <Card title="Quên mật khẩu" className="forgot-password-card">
                <Form
                    name="forgot_password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Gửi yêu cầu
                        </Button>
                    </Form.Item>

                    <Button
                        type="link"
                        onClick={() => history.push('/dangnhap')}
                        block
                    >
                        Quay lại đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default ForgotPassword;