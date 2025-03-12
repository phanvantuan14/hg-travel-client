import React, { useEffect } from 'react';
import { Table, Spin, Tag, Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { lienhekhachsanData, updateStatus, deleteLienhe } from './lienhekhachsanSlice';

function Lienhekhachsan() {
    const dispatch = useDispatch();
    
    // Thêm console.log để debug state
    const lienheState = useSelector(state => state.lienhekhachsans);
    // console.log("Lienhe state:", lienheState);

    // Sửa lại selector để match với cấu trúc state mới
    const lienhe = useSelector(state => state.lienhekhachsans?.lienhe?.data);
    const loading = useSelector(state => state.lienhekhachsans?.loading);

    useEffect(() => {
        dispatch(lienhekhachsanData());
    }, [dispatch]);

    const handleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await dispatch(updateStatus({ id, status: newStatus }))
            message.success('Cập nhật trạng thái thành công!');
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteLienhe(id))
            message.success('Xóa thành công!');
        } catch (error) {
            message.error('Xóa thất bại!');
        }
    };

    const columns = [
        {
            title: 'Khách sạn',
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => record.Hotel?.name || 'N/A'
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'message',
            key: 'message',
            render: text => (
                <div style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {text}
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <div className="action status" onClick={() => handleStatus(record.id, record.status)}>
                    {record.status === 1 ? 
                        <span>
                            <i className="far fa-thumbs-up text-primary" title="Đã xử lý"></i>
                        </span> : 
                        <span>
                            <i className="far fa-thumbs-down text-danger" title="Chưa xử lý"></i>
                        </span>
                    }
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div className="action">
                    <Popconfirm
                        title="Bạn có muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <i className="far fa-trash-alt" style={{ cursor: 'pointer', color: 'red' }}></i>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div id="admin">
            <div className="heading">
                <h4>Quản lý liên hệ khách sạn</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                {loading ? (
                    <div className="spin">
                        <Spin className="mt-5" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={lienhe}
                        rowKey={record => record.id}
                        pagination={{
                            pageSize: 10,
                            position: ['bottomCenter']
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Lienhekhachsan;