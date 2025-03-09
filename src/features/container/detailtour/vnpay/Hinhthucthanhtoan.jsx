import React from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';

const Hinhthucthanhtoan = ({ callback }) => {
    return (
        <div className="payment-methods">
            <Radio.Group onChange={(e) => callback(e.target.value)} defaultValue={1}>
                <div className="payment-method-item">
                    <Radio value={1}>
                        <span className="payment-method-label">
                            <i className="fas fa-money-bill-wave"></i> Thanh toán tiền mặt
                        </span>
                    </Radio>
                </div>
                <div className="payment-method-item">
                    <Radio value={2}>
                        <span className="payment-method-label">
                            <i className="fas fa-university"></i> Thanh toán VNPay
                        </span>
                    </Radio>
                </div>
            </Radio.Group>
        </div>
    );
};

Hinhthucthanhtoan.propTypes = {
    callback: PropTypes.func.isRequired
};

export default Hinhthucthanhtoan;