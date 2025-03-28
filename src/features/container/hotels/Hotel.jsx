import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Pagination } from 'antd'
import Footer from '../trangchu/footer/Footer'
import "./hotel.css"
import { hotelData } from '../admin/Hotel/hotelSlice'

export default function Hotel() {
    const dispatch = useDispatch();
    const hotels = useSelector(state => state.hotels.hotel.data);
    const loading = useSelector(state => state.hotels.Loading);

    // Thêm state pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6, // Hiển thị 6 khách sạn mỗi trang
    });

    useEffect(() => {
        dispatch(hotelData());
        window.scrollTo(0, 0);
    }, [dispatch])

    // Thêm hàm xử lý thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize
        });
        window.scrollTo(0, 0);
    };

    // Hàm render danh sách khách sạn có phân trang
    const renderHotels = () => {
        if (!hotels) return null;

        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Lấy khách sạn cho trang hiện tại
        return hotels.slice(startIndex, endIndex).map(hotel => (
            <div className="col-md-4" key={hotel.id}>
                <Link to={`/detailhotel/${hotel.id}`}>
                    <div className="content___box border">
                        <div className="content___box---img">
                            <img
                                className="img-fluid"
                                src={hotel.avatar}
                                alt={hotel.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-hotel.jpg'
                                }}
                            />
                        </div>
                        <div className="content___box---title">
                            <div className="content___box---title---name">
                                <span>{hotel.name}</span>
                            </div>
                            <div className="content___box---title---price">
                                <span className="price-text">{hotel.giaphong} VNĐ/đêm</span>
                            </div>
                            <div className="content___box---title---status">
                                {hotel.status === 1 ? (
                                    <span className="text-success">Đang hoạt động</span>
                                ) : (
                                    <span className="text-danger">Tạm đóng cửa</span>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        ));
    };

    return (
        <div id="hotel">
            <div className="container">
                <div className="heading text-center mt-3">
                    <span>Khách sạn</span>
                    <div className="hr"></div>
                    <p className="mb-4">
                        Các khách sạn hàng đầu trong nghành du lịch được nhiều du khách ghé qua.
                    </p>
                </div>
                {loading ? (
                    <div className="text-center"><Spin className="mt-5" /></div>
                ) : (
                    <>
                        <div className="content row">
                            {renderHotels()}
                        </div>
                        {/* Thêm phân trang */}
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center mt-4 mb-4">
                                <Pagination
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={hotels?.length || 0}
                                    onChange={handlePageChange}
                                    showSizeChanger={true}
                                    showQuickJumper={true}
                                    pageSizeOptions={['6', '12', '24']}
                                    showTotal={(total) => `Tổng ${total} khách sạn`}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    )
}