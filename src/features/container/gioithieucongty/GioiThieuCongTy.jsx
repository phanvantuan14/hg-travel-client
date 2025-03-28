import React, { useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import Footer from '../trangchu/footer/Footer';
import './gioithieu.css';
import anhCongty from '../../images/tphagiang1.jpg'

export default function GioiThieuCongTy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div id="gioithieu">
            <div className="banner-gioithieu">
                <div className="banner-overlay">
                    <h1>Ha Giang Travel</h1>
                    <p className="banner-subtitle">Đồng hành cùng bạn khám phá Việt Nam</p>
                    <div className="banner-divider"></div>
                </div>
            </div>

            <div className="container py-5">
                <div className="about-section">
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={12}>
                            <div className="about-content animate-left">
                                <h2 className="section-title">Về chúng tôi</h2>
                                <div className="divider"></div>
                                <div className="about-text">
                                    <p>CÔNG TY CỔ PHẦN DU LỊCH THƯƠNG MẠI HÀ GIANG ra đời với mong muốn giới thiệu, quảng bá, đem sự hiểu biết và kinh nghiệm của tập thể đội ngũ làm công tác du lịch đến với du khách trong và ngoài nước...</p>
                                    <p>Với một đội ngũ lãnh đạo giàu kinh nghiệm đã từng công tác lâu năm trong ngành du lịch, cùng với đội ngũ hướng dẫn viên nhiệt tình, chu đáo...</p>
                                    <p>Đến với công ty chúng tôi, hành trình du lịch của quý khách sẽ trở nên hấp dẫn, và thật sự có ý nghĩa...</p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="about-image-container animate-right">
                                <img src={anhCongty} alt="Về công ty" className="about-image" />
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="values-section">
                    <Row className="mt-5">
                        <Col span={24} className="text-center">
                            <h2 className="section-title">Giá trị cốt lõi</h2>
                            <div className="divider center"></div>
                        </Col>
                    </Row>

                    <Row gutter={[24, 24]} className="mt-4">
                        <Col xs={24} sm={12} md={8}>
                            <Card className="value-card animate-up">
                                <div className="value-icon-wrapper">
                                    <i className="fas fa-heart icon-value"></i>
                                </div>
                                <h3>Tận tâm</h3>
                                <p>Luôn đặt sự hài lòng của khách hàng lên hàng đầu</p>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card className="value-card animate-up" style={{ animationDelay: '0.2s' }}>
                                <div className="value-icon-wrapper">
                                    <i className="fas fa-shield-alt icon-value"></i>
                                </div>
                                <h3>Uy tín</h3>
                                <p>Cam kết chất lượng dịch vụ tốt nhất</p>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card className="value-card animate-up" style={{ animationDelay: '0.4s' }}>
                                <div className="value-icon-wrapper">
                                    <i className="fas fa-handshake icon-value"></i>
                                </div>
                                <h3>Chuyên nghiệp</h3>
                                <p>Đội ngũ nhân viên giàu kinh nghiệm</p>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div className="contact-section">
                    <Row>
                        <Col span={24} className="text-center">
                            <h2 className="section-title">Liên hệ với chúng tôi</h2>
                            <div className="divider center"></div>
                        </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="contact-cards">
                        <Col xs={24} md={8}>
                            <Card className="contact-card animate-up">
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-map-marker-alt contact-icon"></i>
                                </div>
                                <h3>Địa chỉ</h3>
                                <p>Số 213 - Đường Minh Khai - Tổ 02 Phường Minh Khai - TP. Hà Giang</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="contact-card animate-up" style={{ animationDelay: '0.2s' }}>
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-phone-alt contact-icon"></i>
                                </div>
                                <h3>Điện thoại</h3>
                                <p>Hotline: +0219 247 9999<br />Office: 0987 654 321</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="contact-card animate-up" style={{ animationDelay: '0.4s' }}>
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-envelope contact-icon"></i>
                                </div>
                                <h3>Email</h3>
                                <p>hagiangtravel@gmail.com<br />support@hgtravel.com</p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <Footer />
        </div>
    );
}