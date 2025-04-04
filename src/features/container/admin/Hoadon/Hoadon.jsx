import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '@material-ui/core';
import { Popconfirm, Popover, Spin, Table, Tooltip, message } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hoadonData, removehoadon, updatehoadonStatus } from './hoadonSlice';

function Hoadon() {

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'name',
        },
        {
            title: 'Tour',
            dataIndex: 'tour',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soluong',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tien',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action'
        }
    ];

    const hoadons = useSelector(state => state.hoadons.hoadon.data);
    const soluong = (nguoilon, treem, embe) => {
        return nguoilon + treem + embe
    }
    const loading = useSelector(state => state.hoadons.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(hoadonData()) }

    const hangdleDelete = e => {
        dispatch(removehoadon(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    const handleStatus = async (e, id) => {
        try {
            const newStatus = e === 1 ? 0 : 1;
            await dispatch(updatehoadonStatus({ 
                id: id,
                status: newStatus
            }));
            
            message.success('Cập nhật trạng thái thành công!');
            // Reload data
            await actionResult();
        } catch (error) {
            console.error("Error updating status:", error);
            message.error('Cập nhật trạng thái thất bại!');
        }
    };

    const tongtien = (nguoilon, treem, embe, gnl, gte, geb) => {
        return (nguoilon * gnl + treem * gte + embe * geb).toLocaleString();
    }
    const title = (nguoilon, treem, embe) => {
        return (
            <div>
                <span>Người lớn: {nguoilon}</span><br />
                <span>Trẻ em: {treem}</span><br />
                <span>Em bé: {embe}</span>
            </div>
        )
    }
    return (
        <div id="admin">
            <div className="heading">
                <h4>Hoá đơn</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={hoadons.map((ok, index) => (
                        {
                            key: index + 1,
                            name: <span>{ok.User.name}</span>,
                            tour: <span>{ok.Tour.name}</span>,
                            soluong: <Tooltip title={title(ok.nguoilon, ok.treem, ok.embe)}>
                                <span>{soluong(ok.nguoilon, ok.treem, ok.embe)}</span>
                            </Tooltip>,
                            tien: <span>{tongtien(ok.nguoilon, ok.treem, ok.embe, ok.Tour.gianguoilon, ok.Tour.giatreem, ok.Tour.giaembe)} vnđ</span>,
                            status: <div className="action status">
                                {ok.status === 1 ? 
                                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                                        <i className="far fa-thumbs-up text-primary" title="Đã thanh toán"></i>
                                    </span> : 
                                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                                        <i className="far fa-thumbs-down text-danger" title="Chưa thanh toán"></i>
                                    </span>
                                }
                            </div>,
                            action: <div className="action">
                                <Popconfirm title="Bạn có muốn xoá？" onConfirm={() => { hangdleDelete(ok.id) }} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                    <i className="far fa-trash-alt" ></i>
                                </Popconfirm>
                            </div>
                        }))}
                    />
                }
            </div>
        </div>
    )
}


export default Hoadon