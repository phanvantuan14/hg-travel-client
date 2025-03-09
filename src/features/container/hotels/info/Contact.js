import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '../../trangchu/footer/Footer'
import img9 from "../img/9.jpg"
import "./contact.css"
import { hotelData } from '../../admin/Hotel/hotelSlice' // Import action
import { Spin } from 'antd'
import { message } from 'antd'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:666'
});

export default function Contact() {
    const dispatch = useDispatch();
    
    // Lấy data từ redux store
    const hotels = useSelector(state => state.hotels?.hotel?.data);
    const loading = useSelector(state => state.hotels?.loading);

    // Load data khi component mount
    useEffect(() => {
        dispatch(hotelData());
    }, [dispatch]);

    // Lấy hotel đầu tiên hoặc hotel đang active
    const activeHotel = hotels?.find(hotel => hotel.status === 1) || hotels?.[0];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.address || !formData.message) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const response = await api.post('/lienhekhachsan', {
                ...formData,
                hotelId: activeHotel?.id,
                status: 0
            });

            if (response.data.success) {
                message.success('Gửi thông tin liên hệ thành công!');
                setFormData({
                    name: '',
                    email: '',
                    address: '',
                    message: ''
                });
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    return (
        <div id="contact">
            <div className="content container">
                {loading ? (
                    <div className="text-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="content___box">
                        <div className="content___box___left">
                            <div className="content___box___left___title">
                                <div className="contact_name">
                                    {activeHotel?.name || 'Đang cập nhật...'}
                                </div>
                                <h3>Liên hệ đặt phòng</h3>
                                <div className="contact_mail">
                                    <i className="fas fa-envelope"></i>
                                    {activeHotel?.email || 'khachsan@dulichviet.com.vn'}
                                </div>
                                <div className="contact_number p-2">
                                    <div className="contact_number-icon">
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                    <div className="contact_number-a">
                                        <p>{activeHotel?.sdt || '0909.502.588'}</p>
                                    </div>
                                </div>
                                <div className="contact_img">
                                    <img src={activeHotel?.avatar || img9} alt={activeHotel?.name} />
                                </div>
                            </div>
                        </div>
                        <div className="content___box___right">
                            <form onSubmit={handleSubmit}>
                                <p>Dấu <span className="color-red">*</span> là thông tin bắt buộc</p>
                                <div className="form-group">
                                    <label htmlFor="name">Họ tên <span className="color-red">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email <span className="color-red">*</span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Địa chỉ <span className="color-red">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Yêu cầu <span className="color-red">*</span></label>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div className="btn-dt">
                                    <Button 
                                        type="submit"
                                        className="pl-5 pr-5" 
                                        variant="contained" 
                                        color="secondary"
                                    >
                                        Liên hệ ngay
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
