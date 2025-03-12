import React, { useEffect, useState } from 'react'
import { Rate, Select, Spin, Pagination } from 'antd'
import { Option } from 'antd/lib/mentions';
import Search from 'antd/lib/input/Search';
import { Link } from 'react-router-dom';
import Footer from '../trangchu/footer/Footer'
import './listtour.css'
import { useSelector, useDispatch } from 'react-redux';
import "./checkactive.js";
import { Empty } from 'antd';

export default function Listtour() {
    const dispatch = useDispatch();
    const binhluans = useSelector(state => state.binhluans.binhluan.data);
    const tours = useSelector(state => state.tours.tour.data);
    const loading = useSelector(state => state.tours.loading);
    const [state, setState] = useState({
        check: "trong",
        statetrongnuoc: "",
        statenuocngoai: ""
    });
    const [star, setstar] = useState('')
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
    });

    const formatdate = e => {
        if (e) {
            var ngay = e.substr(0, 2)
            var thang = e.substr(3, 2)
            var nam = e.substr(6, 4)
            return nam + '-' + thang + '-' + ngay;
        }
    }
    const maxDate = e => {
        if (e) {
            var ngayMax = formatdate(e[0].ngay)
            for (let i = 0; i < e.length; i++) {
                if (ngayMax <= formatdate(e[i].ngay)) {
                    ngayMax = formatdate(e[i].ngay)
                }
            }
            return ngayMax
        }
    }
    const tinhdiem = (id) => {
        var binhluanload = [];
        if (binhluans) {
            for (let i = 0; i < binhluans.length; i++) {
                if (binhluans[i].status === +1 && binhluans[i].tourId === id) {
                    binhluanload.push(binhluans[i]);
                }
            }
        }
        var tong = new Number();
        if (binhluans) {
            for (let i = 0; i < binhluanload.length; i++) {
                tong += binhluanload[i].star;
            }
        }
        var diem = Math.round((tong / +binhluanload.length) * 10) / 10;
        if (isNaN(diem)) {
            diem = 0;
        }
        return diem;
    }

    // Lấy ngày hiện tại format YYYY-MM-DD
    const getToday = () => {
        const date = new Date();
        return date.getFullYear() + "-" +
            ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" +
            (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
    };

    // Lọc danh sách tour trong nước
    const getToursInCountry = () => {
        if (!tours) return [];
        const today = getToday();

        return tours.filter(tour =>
            tour.status === 1 &&
            tour.vitri === 1 &&
            tour.Ngaydis?.length > 0 &&
            maxDate(tour.Ngaydis) >= today
        ).sort((a, b) => b.id - a.id); // Sắp xếp mới nhất lên đầu
    };

    // Lọc danh sách tour nước ngoài
    const getToursOutCountry = () => {
        if (!tours) return [];
        const today = getToday();

        return tours.filter(tour =>
            tour.status === 1 &&
            tour.vitri === 2 &&
            tour.Ngaydis?.length > 0 &&
            maxDate(tour.Ngaydis) >= today
        ).sort((a, b) => b.id - a.id); // Sắp xếp mới nhất lên đầu
    };

    // Xử lý tìm kiếm
    const search = e => {
        const searchTerm = e.toLowerCase();
        const { check } = state;

        if (check === "trong") {
            const filteredTours = getToursInCountry()
                .filter(tour => tour.name.toLowerCase().includes(searchTerm));
            setState({ ...state, statetrongnuoc: filteredTours });
        } else {
            const filteredTours = getToursOutCountry()
                .filter(tour => tour.name.toLowerCase().includes(searchTerm));
            setState({ ...state, statenuocngoai: filteredTours });
        }
    };

    // Lấy danh sách tour hiện tại
    const getCurrentTours = () => {
        const { check, statetrongnuoc, statenuocngoai } = state;

        if (check === "trong") {
            return statetrongnuoc === "" ? getToursInCountry() : statetrongnuoc;
        } else {
            return statenuocngoai === "" ? getToursOutCountry() : statenuocngoai;
        }
    };

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize
        });
        window.scrollTo(0, 0);
    };

    // Sửa lại hàm renderTours để hỗ trợ phân trang
    const renderTours = () => {
        if (loading) {
            return <div className="text-center"><Spin size="large" /></div>;
        }

        const currentTours = getCurrentTours();

        if (!currentTours || currentTours.length === 0) {
            return (
                <div className="col-12 text-center">
                    <Empty description="Không có tour nào" />
                </div>
            );
        }

        // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Lấy tours cho trang hiện tại
        const toursInCurrentPage = currentTours.slice(startIndex, endIndex);

        return toursInCurrentPage.map((ok, index) => (
            <div className="col-md-6 mb-4" key={ok.id}>
                <Link to={`/tour/${ok.id}`}>
                    <div className="img rounded">
                        <img
                            src={ok.avatar}
                            className="img-fluid"
                            alt={ok.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-tour.jpg'
                            }}
                        />
                    </div>
                    <div className="content_tour">
                        <div className="title_tour text-capitalize">{ok.name}</div>
                        <div className="star float-left">
                            <Rate value={tinhdiem(ok.id)} disabled />
                        </div>
                        <div className="money float-left ml-3 text-warning">
                            {(ok.gianguoilon).toLocaleString()} VNĐ<br />
                            {/* <del> 4.000.000 VNĐ</del> */}
                        </div>
                    </div>
                </Link>
            </div>
        ));
    };

    // Xử lý đổi loại tour
    const handleChange = (value) => {
        setState({
            ...state,
            check: value,
            statetrongnuoc: "",
            statenuocngoai: ""
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const checkstar = value => {
    }
    return (
        <div id="list-tour">
            <div className="container">
                <div className="row mb-4 bg-white rounded">
                    <div className="col-md-3 border-right pb-3 bg ">
                        <h4 className="pt-4">Tìm kiếm tour</h4>
                        <Search placeholder="Tìm kiếm tour" onSearch={search} enterButton />

                        <h4 className="mt-3">Loại tour</h4>
                        <Select className="w-100" defaultValue="trong" style={{ width: 120 }} onChange={handleChange}>
                            <Option value="trong">Tour trong nước</Option>
                            <Option value="ngoai">Tour nước ngoài</Option>
                        </Select>
                        {state.check === "trong" ?
                            <div>
                                <h4 className="mt-3">Vùng</h4>
                                <Select className="w-100" defaultValue="trung" style={{ width: 120 }}>
                                    <Option value="bac">Miền Bắc</Option>
                                    <Option value="trung">Miền Trung</Option>
                                    <Option value="nam">Miền Nam</Option>
                                </Select>
                            </div> : ""
                        }
                        <h4 className="mt-3">Đánh giá</h4>
                        <div className="star-mid text-primary">
                            <ul>
                                <li className="active"><span onClick={() => checkstar(5)} style={{ cursor: "pointer" }}><Rate value="5" disabled /><span className="ml-2">từ 5 sao</span><br /></span></li>
                                <li><span onClick={() => checkstar(4)} style={{ cursor: "pointer" }}><Rate value="4" disabled /><span className="ml-2">từ 4 sao</span><br /></span></li>
                                <li><span onClick={() => checkstar(3)} style={{ cursor: "pointer" }}><Rate value="3" disabled /><span className="ml-2">từ 3 sao</span><br /></span></li>
                                <li><span onClick={() => checkstar(2)} style={{ cursor: "pointer" }}><Rate value="2" disabled /><span className="ml-2">từ 2 sao</span><br /></span></li>
                                <li><span onClick={() => checkstar(1)} style={{ cursor: "pointer" }}><Rate value="1" disabled /><span className="ml-2">từ 1 sao</span><br /></span></li>
                            </ul>
                        </div>

                    </div>
                    <div className="col-md-9">
                        <div className="title text-center mt-3">
                            <h3>TOUR DU LỊCH</h3>
                            <div className="hr w-25"></div>
                        </div>
                        <div className="box-tour">
                            <div className="container">
                                <div className="row mt-4">
                                    {renderTours()}
                                </div>
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center mt-4 mb-4">
                                        <Pagination
                                            current={pagination.current}
                                            pageSize={pagination.pageSize}
                                            total={getCurrentTours().length}
                                            onChange={handlePageChange}
                                            showSizeChanger={true}
                                            showQuickJumper={true}
                                            pageSizeOptions={['6', '12', '24']}
                                            showTotal={(total) => `Tổng ${total} tour`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
