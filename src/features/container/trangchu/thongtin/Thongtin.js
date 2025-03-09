import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "../footer/Footer";
import Lichsu from "./lichsu/Lichsu";
import { addhoadon } from "../../admin/Hoadon/hoadonSlice";

export default function Thongtin() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const [state, setState] = useState({ tabPosition: "left" });

    const { TabPane } = Tabs;
    const { tabPosition } = state;

    // Xử lý kết quả thanh toán ngay khi component Thongtin được mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const pendingOrder = localStorage.getItem("pendingTourOrder");

        if (vnp_ResponseCode && pendingOrder) {
            try {
                if (vnp_ResponseCode === "00") {
                    const orderData = JSON.parse(pendingOrder);
                    // Cập nhật hóa đơn với trạng thái thanh toán thành công
                    dispatch(
                        addhoadon({
                            ...orderData,
                            status: 1, // Đã thanh toán
                        })
                    );
                } else {
                    message.error("Thanh toán thất bại!");
                }
            } catch (error) {
                console.error("Error processing payment:", error);
                message.error("Có lỗi xảy ra khi xử lý thanh toán!");
            } finally {
                // Xóa dữ liệu pendingOrder sau khi xử lý
                localStorage.removeItem("pendingTourOrder");
            }
        }
    }, [location.search, dispatch]);

    return (
        <div>
            <div className="breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">
                                <i className="fas fa-home mr-2"></i>Trang chủ
                            </Link>
                        </li>
                        <li className="breadcrumb-item">Thông tin</li>
                    </ol>
                </nav>
            </div>
            <div className="container mb-5">
                {id && (
                    <Tabs
                        defaultActiveKey={id == 0 ? "1" : "2"}
                        tabPosition={tabPosition}
                    >
                        <TabPane tab="Tour đã đặt" key="1">
                            <Lichsu />
                        </TabPane>
                    </Tabs>
                )}
            </div>
            <Footer />
        </div>
    );
}
