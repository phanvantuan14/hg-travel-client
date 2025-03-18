import { Button, Popconfirm, Spin, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { userroleData } from '../header/userroleSlice';
import { roleData, updaterole, removerole } from './roleSlice';

function Role() {
    const match = useRouteMatch();
    const columns = [
        {
            title: 'Quyền',
            dataIndex: 'name',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
        },
        {
            title: 'Action',
            dataIndex: 'action'
        }
    ];

    const roles = useSelector(state => state.roles.role.data);
    const loading = useSelector(state => state.roles.loading);
    const dispatch = useDispatch();

    const actionResult = async () => { await dispatch(roleData()) }
    const actionUserrole = async () => { await dispatch(userroleData()) }

    useEffect(() => {
        actionUserrole();
        actionResult();
    }, []);

    const userrole = useSelector(state => state.userroles.userrole.data);

    const hangdleDelete = e => {
        dispatch(removerole(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updaterole({ status: 0, idsua: id }))
        } else {
            dispatch(updaterole({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    const countRole = (id) => {
        var admin = [];
        var quanlytintuc = [];
        var quanlybinhluan = [];
        var quanlytour = [];
        var bientapvien = [];
        var nguoidung = [];
        var khachsan = [];
        for (let i = 0; i < userrole.length; i++) {
            if (userrole[i].roleId === 1) {
                admin.push(userrole[i]);
            }
            if (userrole[i].roleId === 2) {
                quanlytintuc.push(userrole[i]);
            }
            if (userrole[i].roleId === 3) {
                quanlybinhluan.push(userrole[i]);
            }
            if (userrole[i].roleId === 4) {
                quanlytour.push(userrole[i]);
            }
            if (userrole[i].roleId === 5) {
                bientapvien.push(userrole[i]);
            }
            if (userrole[i].roleId === 6) {
                nguoidung.push(userrole[i]);
            }
            if (userrole[i].roleId === 7) {
                khachsan.push(userrole[i]);
            }
        }
        switch (id) {
            case 1:
                return admin.length;
                break;
            case 2:
                return quanlytintuc.length;
                break;
            case 3:
                return quanlybinhluan.length;
                break;
            case 4:
                return quanlytour.length;
                break;
            case 5:
                return bientapvien.length;
                break;
            case 6:
                return nguoidung.length;
                break;
            case 7:
                return khachsan.length;
                break;
            default:
                break;
        }

    }
    return (
        <div id="admin">
            <div className="heading">
                <h4>Phân quyền</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themrole`}>
                        <Button className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary" >
                            <i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới
                        </Button>
                    </Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={roles.map((ok, index) => (
                        {
                            key: index + 1,
                            name: <span>{ok.name}</span>,
                            status: <div className="action">
                                {ok.status === 1 ?
                                    <span onClick={() => { handleStatus(ok.status, ok.id) }}>
                                        <i className="far fa-thumbs-up text-primary"></i>
                                    </span> :
                                    <span onClick={() => handleStatus(ok.status, ok.id)}>
                                        <i className="far fa-thumbs-down "></i>
                                    </span>}
                            </div>,
                            amount: <span><b>{userrole ? countRole(ok.id) : ""}</b></span>,
                            action: <div className="action">
                                <Popconfirm
                                    title="Bạn có muốn xoá？"
                                    onConfirm={() => { hangdleDelete(ok.id) }}
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                >
                                    <i className="far fa-trash-alt" style={{ cursor: "pointer" }}></i>
                                </Popconfirm>
                            </div>
                        }))}
                    />
                }
            </div>
        </div>
    )
}

export default Role