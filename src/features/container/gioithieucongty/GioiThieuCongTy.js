import React, { useEffect } from 'react';
import { Row, Col, Card, Tooltip } from 'antd';
import Footer from '../trangchu/footer/Footer';
import './gioithieu.css';
import anhCongty from  '../../images/nha.jpg'

export default function GioiThieuCongTy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div id="gioithieu">
            <div className="banner-gioithieu">
                <h1>HG Travel - Đồng hành cùng bạn</h1>
                <p>Khám phá Việt Nam cùng chúng tôi</p>
            </div>

            <div className="container py-5">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <div className="about-content">
                            <h2 className="section-title">Về chúng tôi</h2>
                            <div className="divider"></div>
                            <p>HG Travel là công ty du lịch hàng đầu tại Việt Nam, chuyên cung cấp các dịch vụ du lịch chất lượng cao. Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến cho khách hàng những trải nghiệm du lịch tuyệt vời nhất.</p>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <img 
                            src={anhCongty}
                            alt="Về công ty" 
                            className="about-image"
                        />
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col span={24}>
                        <h2 className="section-title text-center">Giá trị cốt lõi</h2>
                        <div className="divider center"></div>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} className="mt-4">
                    <Col xs={24} sm={12} md={8}>
                        <Card className="value-card">
                            <i className="fas fa-heart icon-value"></i>
                            <h3>Tận tâm</h3>
                            <p>Luôn đặt sự hài lòng của khách hàng lên hàng đầu</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card className="value-card">
                            <i className="fas fa-shield-alt icon-value"></i>
                            <h3>Uy tín</h3>
                            <p>Cam kết chất lượng dịch vụ tốt nhất</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card className="value-card">
                            <i className="fas fa-handshake icon-value"></i>
                            <h3>Chuyên nghiệp</h3>
                            <p>Đội ngũ nhân viên giàu kinh nghiệm</p>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5 contact-section">
                    <Col span={24}>
                        <h2 className="section-title text-center">Liên hệ với chúng tôi</h2>
                        <div className="divider center"></div>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="contact-card">
                            <i className="fas fa-map-marker-alt contact-icon"></i>
                            <h3>Địa chỉ</h3>
                            <p>123 Đường ABC, Quận XYZ<br/>TP. Hồ Chí Minh</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="contact-card">
                            <i className="fas fa-phone-alt contact-icon"></i>
                            <h3>Điện thoại</h3>
                            <p>Hotline: 0123 456 789<br/>Office: 0987 654 321</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="contact-card">
                            <i className="fas fa-envelope contact-icon"></i>
                            <h3>Email</h3>
                            <p>contact@hgtravel.com<br/>support@hgtravel.com</p>
                        </Card>
                    </Col>
                </Row>

                {/* <Row className="mt-5 partner-section">
                    <Col span={24}>
                        <h2 className="section-title text-center">Đối tác của chúng tôi</h2>
                        <div className="divider center"></div>
                    </Col>
                </Row> */}
                {/* <Row gutter={[32, 32]} className="partner-logos">
                    <Col xs={12} sm={8} md={4}>
                        <Tooltip title="Vietnam Airlines">
                            <div className="partner-logo">
                                <img 
                                    src={`${process.env.PUBLIC_URL}/images/partners/vietnam-airlines.png`}
                                    alt="Vietnam Airlines"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.PUBLIC_URL}/images/default-partner.png`
                                    }}
                                />
                            </div>
                        </Tooltip>
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                        <Tooltip title="Vinpearl">
                            <div className="partner-logo">
                                <img 
                                    src={`${process.env.PUBLIC_URL}/images/partners/vinpearl.png`}
                                    alt="Vinpearl"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.PUBLIC_URL}/images/default-partner.png`
                                    }}
                                />
                            </div>
                        </Tooltip>
                    </Col>
                </Row> */}
            </div>
            <Footer />
        </div>
    );
}