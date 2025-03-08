import { Spin } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import renderHTML from 'react-render-html';
import { useParams } from 'react-router-dom';
import { hotelData } from './hotelSlice';

function ChiTietKhachSan() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const hotel = useSelector(state => state.hotels.hotel.data?.find(x => x.id === +id));
    const loading = useSelector(state => state.hotels.loading);

    useEffect(() => {
        // Fetch hotel data when component mounts
        dispatch(hotelData());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="spin">
                <Spin className="mt-5" />
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="content">
                <div className="text-center">Không tìm thấy thông tin khách sạn</div>
            </div>
        );
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>Chi tiết khách sạn</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="ct">
                    <div className="hotel-info">
                        <h2 className="hotel-name">{hotel.name}</h2>
                        
                        <div className="hotel-main-info">
                            <div className="image-section">
                                <img 
                                    src={hotel.avatar || '/images/default-hotel.jpg'}
                                    alt={hotel.name}
                                    className="hotel-detail-image"
                                />
                            </div>
                            
                            <div className="info-section">
                                <div className="info-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Địa chỉ: </span>
                                    <b>{hotel.diachi}</b>
                                </div>
                                
                                <div className="info-item">
                                    <i className="fas fa-phone"></i>
                                    <span>Số điện thoại: </span>
                                    <b>{hotel.sdt}</b>
                                </div>
                                
                                <div className="info-item">
                                    <i className="fas fa-envelope"></i>
                                    <span>Email: </span>
                                    <b>{hotel.email}</b>
                                </div>
                                
                                <div className="info-item">
                                    <i className="fas fa-money-bill-wave"></i>
                                    <span>Giá phòng: </span>
                                    <b>{hotel.giaphong?.toLocaleString('vi-VN')} VNĐ</b>
                                </div>
                            </div>
                        </div>

                        {hotel.chitiethotel && (
                            <div className="description-section">
                                <h3>Chi tiết khách sạn</h3>
                                <div className="description-content">
                                    {renderHTML(hotel.chitiethotel)}
                                </div>
                            </div>
                        )}

                        {hotel.bando && (
                            <div className="map-section">
                                <h3>Vị trí trên bản đồ</h3>
                                <div className="map-container">
                                    {renderHTML(hotel.bando)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChiTietKhachSan
