import React, { useEffect, useState } from 'react'
import { Image, Modal, Popconfirm, Spin, Table } from 'antd'
import { Link, useRouteMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { updateuser, userData } from './taikhoanSlice';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Radio } from 'antd';
import defaultImage from '../../../images/bg3.jpg'
import userroleApi from '../../../../api/user/userroleApi';

function Taikhoan(props) {
    const match = useRouteMatch()

    const columns = [
        {
            title: 'tên',
            dataIndex: 'name',
        },
        {
            title: 'email',
            dataIndex: 'email',
        },
        {
            title: 'ảnh',
            dataIndex: 'avatar',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
        },
        {
            title: 'Quyền',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            dataIndex: 'action'
        }
    ];
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const users = useSelector(state => state.taikhoan.user.data);
    const loading = useSelector(state => state.taikhoan.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(userData()) }
    useEffect(() => {
        actionResult();
    }, [])
    const [userId, setUseId] = useState()
    const hangdleUpdate = (e) => {
        setUseId(e)
        setIsModalVisible(true);
    }
    const roles = useSelector(state => state.roles.role.data);
    const handleOk = async () => {
        try {
            if (!userId || !value) {
                console.log("Vui lòng chọn quyền!");
                return;
            }

            const response = await userroleApi.edituserrole({
                idsua: userId,
                roleId: value
            });

            if (response) {
                await actionResult();
                setIsModalVisible(false);
            }
        } catch (error) {
            console.error("Chi tiết lỗi:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            console.log("Có lỗi xảy ra khi cập nhật quyền!");
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onChangeRadio = (e) => {
        setValue(e.target.value)
    }
    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updateuser({ status: 0, idsua: id }))
        } else {
            dispatch(updateuser({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const chuhoa = (e) => {
        return e.charAt(0).toUpperCase() + e.slice(1);
    }
    const [value, setValue] = useState(6)

    const renderRole = (roles) => {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            return <span className="text-warning">Chưa phân quyền</span>;
        }

        const roleName = roles[0]?.name;
        if (!roleName) {
            return <span className="text-warning">Chưa phân quyền</span>;
        }

        return roleName === "admin" ? (
            <span className="text-danger"><b>{chuhoa(roleName)}</b></span>
        ) : (
            <span className="text-success"><b>{chuhoa(roleName)}</b></span>
        );
    };

    return (
        <div id="admin">
            <div className="heading">
                <h4>Quản lý tài khoản</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={users.map((ok, index) => (
                        {
                            key: index + 1,
                            name: <Link to={`${match.url}/chitiettaikhoan/${ok.id}`}>{ok.name}</Link>,
                            email: <span>{ok.email}</span>,
                            avatar: <Image
                                width="100px"
                                height="120px"
                                className="convert"
                                src={ok.avatar || defaultImage}
                                alt={ok.name || "User avatar"}
                                fallback={defaultImage}
                                onError={(e) => {
                                    e.target.src = defaultImage;
                                }}
                            />,
                            status: <div className="action">{ok.status === 1 ? <span onClick={() => { handleStatus(ok.status, ok.id) }}><i className="far fa-thumbs-up text-primary"></i></span> : <span onClick={() => handleStatus(ok.status, ok.id)}><i className="far fa-thumbs-down "></i></span>}</div>,
                            role: renderRole(ok.Roles),
                            action:
                                <div className="action">
                                    <Popconfirm title="Bạn muốn cấp quyền truy cập cho tài khoản này？" onConfirm={() => { hangdleUpdate(ok.id) }} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                        <i className="fas fa-user-lock text-warning"></i>
                                    </Popconfirm>
                                </div>
                        }))}
                    />
                }
                <Modal title="Cấp quyền truy cập hệ thống" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Radio.Group onChange={onChangeRadio} value={value}>
                        {!roles ? '' :
                            roles.map(ok => (
                                <Radio style={radioStyle} key={ok.id} value={ok.id}>
                                    <span >{ok.name === "user" ? "Người dùng" : chuhoa(ok.name)}</span>
                                </Radio>
                            ))
                        }
                    </Radio.Group>
                </Modal>
            </div>
        </div>
    )
}

Taikhoan.propTypes = {

}

export default Taikhoan