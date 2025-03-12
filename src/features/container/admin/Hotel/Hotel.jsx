import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '@material-ui/core';
import { Image, Popconfirm, Spin, Table } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { removehotel, updatehotel, hotelData } from './hotelSlice';
import { message } from 'antd';
import './hotel.css';

function Hotel() {
    const match = useRouteMatch()
    const dispatch = useDispatch()
    
    // Thêm kiểm tra optional chaining
    const hotels = useSelector(state => state.hotels?.hotel?.data || []);
    const loading = useSelector(state => state.hotels?.loading);
    const error = useSelector(state => state.hotels?.error);
    const history = useHistory();

    useEffect(() => {
        // Dispatch action khi component mount
        dispatch(hotelData());
    }, [dispatch]);

    // Log để debug
    console.log("State hotels:", hotels);
    console.log("State loading:", loading);
    console.log("State error:", error);

    var hotel = [];
    if (hotels) {
        var sort = []
        for (let i = 0; i < hotels.length; i++) {
            sort.unshift(hotels[i])
        }
        hotel = sort
    }
    console.log("hotels 1:",hotels);


    const actionResult = async () => await dispatch(hotelData());
    
    if (error) {
        message.error("Có lỗi xảy ra khi tải dữ liệu!");
    }

    const sortedHotels = hotels ? [...hotels].reverse() : [];

    const columns = [
        {
            title: 'Tên khách sạn',
            dataIndex: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action'
        }
    ];

    const hangdleDelete = e => {
        dispatch(removehotel(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    const hangdleEdit = (id) => {
        history.replace(`${match.url}/suakhachsan/${id}`)
    }

    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updatehotel({ status: 0, idsua: id }))
        } else {
            dispatch(updatehotel({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>Quản lý khách sạn</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themkhachsan`}>
                        <Button variant="outlined" color="secondary">
                            <i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới
                        </Button>
                    </Link>
                </div>
                {loading ? (
                    <div className="spin">
                        <Spin size="large" tip="Đang tải dữ liệu..." />
                    </div>
                ) : (
                    <Table 
                        columns={columns} 
                        dataSource={sortedHotels.map((ok, index) => ({
                            key: index + 1,
                            name: <div className="content___box">
                                    <div className="content___box---img">
                                        <Image 
                                            src={ok.avatar || '/images/default-hotel.jpg'} 
                                            alt={ok.name}
                                            fallback="/images/default-hotel.jpg"
                                            preview={false}
                                        />
                                    </div>
                                    <div className="content___box---title">
                                        <div className="content___box---title---name">
                                            {ok.name}
                                        </div>
                                      
                                    </div>
                                    <div className="content___box---btn">
                                        <button>
                                            <Link to={`${match.url}/chitietkhachsan/${ok.id}`}>
                                                Chi tiết
                                            </Link>
                                        </button>
                                    </div>
                                </div>,
                            status: <div className="action status">
                                {ok.status === 1 ? 
                                    <span onClick={() => { handleStatus(ok.status, ok.id) }}>
                                        <i className="far fa-thumbs-up text-primary" title="Đang hoạt động"></i>
                                    </span> : 
                                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                                        <i className="far fa-thumbs-down text-danger" title="Tạm ngưng"></i>
                                    </span>}
                            </div>,
                            action: <div className="action controls">
                                
                                <Popconfirm 
                                    title="Bạn có muốn sửa？" 
                                    onConfirm={() => { hangdleEdit(ok.id) }} 
                                    icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
                                >
                                    <i className="far fa-edit" style={{ cursor: "pointer" }}></i>
                                </Popconfirm>
                                <Popconfirm 
                                    title="Bạn có muốn xoá？" 
                                    onConfirm={() => { hangdleDelete(ok.id) }} 
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                >
                                    <i className="far fa-trash-alt text-danger" style={{ cursor: "pointer" }}></i>
                                </Popconfirm>
                            </div>
                        }))}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                    />
                )}
            </div>
        </div>
    );
}

export default Hotel
