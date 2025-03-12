import { Button } from '@material-ui/core'
import { Carousel, Rate, Spin } from 'antd'
import React, { useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '../../trangchu/footer/Footer'
import "./detailHotel.css"
import Tabss from '../info/Tabs'
import { hotelData } from '../../admin/Hotel/hotelSlice'

export default function DetailHotel() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const history = useHistory();
    const hotels = useSelector(state => state.hotels.hotel.data);
    const loading = useSelector(state => state.hotels.Loading);
    
    const hotel = hotels?.find(item => item.id === parseInt(id));

    useEffect(() => {
        dispatch(hotelData());
        window.scrollTo(0, 0);
    }, [dispatch])

    const onClickLienHe = () => {
        history.push("/lienhe_khachsan");
    }

    if (loading) return <div className="text-center"><Spin className="mt-5" /></div>;
    if (!hotel) return <div>Không tìm thấy khách sạn</div>;

    return (
        <div id="detailHotel">
            <div className="container">
                
                
                <div className="content">
                    <div className="content___title">
                        <div className="content___title---name">
                            <h3>{hotel.name}</h3>
                        </div>
                        <div className="content___title---star">
                            <i className="fas fa-star mr-2" style={{color: "#ffc107"}}></i>
                            <span>Đánh giá: </span>
                            <Rate className="pl-2 mr-3" disabled defaultValue={4} />
                            <span>4/5 trong Đánh giá</span>
                        </div>
                    </div>

                    <div className="content___box row">
                        <div className="col-md-8">
                            <div className="content___box---slide">
                                <Carousel autoplay effect="fade">
                                    {hotel.Anhs?.length > 0 ? (
                                        hotel.Anhs.map((image, index) => (
                                            <div key={index}>
                                                <img src={image.link} alt={hotel.name} />
                                            </div>
                                        ))
                                    ) : (
                                        <div>
                                            <img src={hotel.avatar} alt={hotel.name} />
                                        </div>
                                    )}
                                </Carousel>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="pdBox">
                                <div className="content___box---map">
                                    <iframe 
                                        src={hotel.bando} 
                                        frameBorder="0" 
                                        allowFullScreen
                                        title="location"
                                    ></iframe>
                                </div>
                                <div className="content___box---infor">
                                    <div className="info-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <div className="info-content">
                                            <label>Địa điểm: </label>
                                            <span className='ml-2'>{hotel.vitri}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <i className="far fa-clock"></i>
                                        <div className="info-content">
                                            <label>Thời gian: </label>
                                            <span className='ml-2'>{hotel.thoigian}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <i className="fas fa-tag"></i>
                                        <div className="info-content">
                                            <label>Giá phòng: </label>
                                            <span className=" font-weight-bold ml-2">{hotel.giaphong?.toLocaleString()} vnđ</span>
                                        </div>
                                    </div>
                                    <div className="content___box---infor---btn">
                                        <Button 
                                            onClick={onClickLienHe} 
                                            className="btn-dt" 
                                            variant="contained" 
                                            color="secondary"
                                        >
                                            <i className="fas fa-phone-alt mr-2"></i>
                                            Liên hệ đặt phòng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mt-4">
                <Tabss hotel={hotel} />
            </div>
            <Footer />
        </div>
    )
}