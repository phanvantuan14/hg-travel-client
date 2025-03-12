import { Image, Spin, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { anhData, updateanh } from './anhSlice';

function Anh() {
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
        },
        {
            title: 'Ảnh',
            dataIndex: 'link',
        },
        {
            title: 'Banner',
            dataIndex: 'banner',
        },
    ];

    const anhs = useSelector(state => state.anhs.anh.data);
    const loading = useSelector(state => state.anhs.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(anhData());
    }, [dispatch]);

    const actionResult = async () => { 
        await dispatch(anhData());
    }

    const handleStatus = (e, id) => {
        dispatch(updateanh({ status: e === 1 ? 0 : 1, idsua: id }));
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    const handleBanner = (e, id) => {
        dispatch(updateanh({ banner: e === 1 ? 0 : 1, idsua: id }));
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    // Xử lý data trước khi render
    const getTableData = () => {
        // Kiểm tra và chuyển đổi data
        const anhArray = Array.isArray(anhs) ? anhs : 
                        Array.isArray(anhs?.data) ? anhs.data : [];

        return anhArray.map((ok, index) => ({
            key: index + 1,
            name: <span>{ok.Tour?.name || ok.Hotel?.name}</span>,
            type: <span>{ok.Tour ? 'Tour' : 'Hotel'}</span>,
            link: <Image src={ok.link} width="200px" height="150px" alt="" />,
            banner: <div className="action">
                {ok.banner === 1 ? 
                    <span onClick={() => handleBanner(ok.banner, ok.id)}>
                        <i className="fas fa-check text-success"></i>
                    </span> : 
                    <span onClick={() => handleBanner(ok.banner, ok.id)}>
                        <i className="fas fa-times text-danger"></i>
                    </span>
                }
            </div>,
            status: <div className="action">
                {ok.status === 1 ? 
                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                        <i className="far fa-thumbs-up text-primary"></i>
                    </span> : 
                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                        <i className="far fa-thumbs-down"></i>
                    </span>
                }
            </div>,
        }));
    };

    return (
        <div id="admin">
            <div className="heading">
                <h4>Quản lý ảnh</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                {loading ? (
                    <div className="spin"><Spin className="mt-5" /></div>
                ) : (
                    <Table 
                        columns={columns} 
                        dataSource={getTableData()}
                        locale={{
                            emptyText: 'Không có dữ liệu'
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Anh;