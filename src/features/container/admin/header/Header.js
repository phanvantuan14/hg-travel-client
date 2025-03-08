import { Avatar, Button, IconButton } from '@material-ui/core'
import { Drawer, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { storage } from "../../../../firebase"
import taikhoanApi from '../../../../api/user/taikhoanApi'
import userroleApi from '../../../../api/user/userroleApi'
import tk from '../../../images/tk.png'
import './header.css'
function Header(props) {
    const formatdate = e => {
        if (e) {
            var ngay = e.substr(8, 2)
            var thang = e.substr(5, 2)
            var nam = e.substr(0, 4)
            return ngay + '/' + thang + '/' + nam;
        }
    }
    const [state, setState] = useState({
        collapsed: false,
        visible: false,
        collapsed2: false,
        visible2: false,
        kynang: "",
        facebook: "",
        github: "",
        name: "",
        sdt: "",
        diachi: "",
        gioitinh: 1,
        ngaysinh: "",
        chamngon: "",
        email: "",
        website: "",
        linkImg: '',
        tenanh: '',
        img: ''
    });
    const hangdelimage = (e) => {
        setState({
            ...state,
            linkImg: URL.createObjectURL(e.target.files[0]),
            tenanh: e.target.files[0].name,
            img: e.target.files[0],
        });
    }
    const { kynang, facebook, github, img, linkImg, name, sdt, diachi, gioitinh, ngaysinh, chamngon, website } = state
    const showDrawer = () => {
        setState({
            ...state,
            visible: true
        })
    };
    const hangdleGioitinh = (e) => {
        setState({
            ...state,
            gioitinh: e.target.value
        })
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        var idsua = users.id
        if (name.trim() === "" || diachi.trim() === "" || gioitinh === "" || ngaysinh.trim() === "" || sdt.trim() === "" || kynang.trim() === "" || website.trim() === "" || chamngon.trim() === "" || github.trim() === "" || facebook.trim() === "") {
            message.warning("Bạn chưa nhập đủ thông tin!")
        } else {
            if (img) {
                await storage.ref(`imagesUser/${img.name}`).put(img)
                const anh = await storage.ref("imagesUser").child(img.name).getDownloadURL();
                var updateUser = await taikhoanApi.edituser({ idsua: idsua, name: name, avatar: anh, diachi: diachi, sdt: sdt, gioitinh: gioitinh, ngaysinh: ngaysinh })
                    .then(data => {
                        return data;
                    })
                var updateUserRole = await userroleApi.edituserroleHeader({ idsua: user.idUserRole, kynang: kynang, chamngon: chamngon, website: website, github: github, facebook: facebook })
                    .then(data => {
                        return data
                    })
                console.log(updateUser,
                    updateUserRole);
                if (updateUser && updateUserRole) {
                    getprofile()
                    message.success("Sửa thông tin thành công!");
                    setState({
                        visible2: false,
                    })
                } else {
                    message.error("Sửa thất bại!");
                }
            }
            else {
                var updateUser = await taikhoanApi.edituser({ idsua: idsua, name: name, diachi: diachi, sdt: sdt, gioitinh: gioitinh, ngaysinh: ngaysinh })
                    .then(data => {
                        return data;
                    })
                var updateUserRole = await userroleApi.edituserroleHeader({ idsua: user.idUserRole, kynang: kynang, chamngon: chamngon, website: website, github: github, facebook: facebook })
                    .then(data => {
                        return data
                    })
                if (updateUser && updateUserRole) {
                    getprofile();
                    message.success("Sửa thông tin thành công!");
                    setState({
                        visible2: false,
                    })
                } else {
                    message.error("Sửa thất bại!");
                }
            }
        }
    }
    const onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const onClose = () => {
        setState({
            ...state,
            visible: false
        })
    };
    const showDrawer2 = () => {
        setState({
            ...state,
            visible2: true
        })
    };
    const onClose2 = () => {
        setState({
            ...state,
            visible2: false
        })
    };
    const users = useSelector(state => state.infor.infor.data);

    const [user, setUser] = useState();
    const getprofile = async () => {
        if (users) {
            var infor = await taikhoanApi.getOne(users.id).then(ok => {
                return ok
            });
            var inforadmin = await taikhoanApi.getOneAdmin(users.id).then(ok => {
                return ok
            });
            setUser({
                name: infor.name,
                diachi: infor.diachi,
                email: infor.email,
                gioitinh: infor.gioitinh,
                ngaysinh: infor.ngaysinh,
                sdt: infor.sdt,
                avatar: infor.avatar,
                idUserRole: inforadmin.id,
                chamngon: inforadmin.chamngon,
                facebook: inforadmin.facebook,
                github: inforadmin.github,
                kynang: inforadmin.kynang,
                website: inforadmin.website
            })
            setState({
                name: infor.name,
                diachi: infor.diachi,
                email: infor.email,
                gioitinh: infor.gioitinh,
                ngaysinh: infor.ngaysinh,
                sdt: infor.sdt,
                chamngon: inforadmin.chamngon,
                facebook: inforadmin.facebook,
                github: inforadmin.github,
                kynang: inforadmin.kynang,
                website: inforadmin.website
            })
        }
    }
    useEffect(() => {
        getprofile();

    }, [users])
    return (
        <div id="header" >
            {!user ? '' :
                <ul className="navbar-nav float-right" onClick={showDrawer}>
                    <li className="nav-item mr-3 mt-2" >{user.name}</li>
                    <li className="nav-item ">
                        <Avatar alt="Remy Sharp" 
                            src={user.avatar ? user.avatar : tk} 
                        name="as" 
                        className="pick" 
                        />
                    </li>
                </ul>
            }
            {!user ? '' :
                <Drawer
                    title="Thông tin admin"
                    placement="right"
                    onClose={onClose}
                    visible={state.visible}
                >
                    <div>
                        <div className="center">
                            <img src={user.avatar ? user.avatar : tk}  className="avatar-admin" alt="" />
                        </div>
                        <h4>Cá nhân</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <p className="mb-2"><span>Họ tên:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.name}</span></p>
                                <p className="mb-2"><span>Công ty:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">Du lịch Nghệ An</span></p>
                                <p className="mb-2"><span>Ngày sinh:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{formatdate(user.ngaysinh)}</span></p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-2"><span>Account:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.email}</span></p>
                                <p className="mb-2"><span>Địa chỉ:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.diachi}</span></p>
                                <p className="mb-2"><span>Website:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">Laisatthu.com.vn</span></p>
                            </div>
                            <p className="tab"><span>Châm ngôn:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.chamngon}</span></p>
                        </div>
                    </div>
                    <hr />
                    <h4>Công ty</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-2"><span>Chức vụ:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">Người quản lý</span></p>
                            <p className="mb-2"><span>Bộ phận:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{users ? users.role : ""}</span></p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-2"><span>Trách nhiệm:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{users ? users.mota : ""}</span></p>
                            <p className="mb-2"><span>Giám sát:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">Trần Sang</span></p>
                        </div>
                        <p className="tab"><span>Kỹ năng:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user text-justify">{user.kynang}</span></p>
                    </div>
                    <hr />
                    <h4>Liên hệ</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-2"><span>Email:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.email}</span></p>
                            <p className="mb-2"><span>Github:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.github}</span></p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-2"><span>Phone Number:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.sdt}</span></p>
                            <p className="mb-2"><span>Facebook:&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="tt-user">{user.facebook}</span></p>
                        </div>
                    </div>
                    <Button variant="contained" color="secondary" onClick={() => showDrawer2()} className="float-right mt-2">Thay đổi thông tin</Button>
                </Drawer>
            }
            <Drawer
                style={{ zIndex: '100001' }}
                title="Sửa thông tin cá nhân"
                placement="right"
                onClose={onClose2}
                visible={state.visible2}
            >
                <form action="" method="post" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="">Tên người dùng</label>
                        <input type="text" name="name" value={name} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Thêm poster</label>
                        <div >
                            <input accept="image/*" id="icon-button-file" type="file" onChange={hangdelimage} />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" className="mr-5 ml-4" aria-label="upload picture" component="span">
                                    <i className="fas fa-camera-retro"></i>
                                </IconButton>
                            </label>
                            {linkImg ? <img src={linkImg} className="ml-5" style={{ borderRadius: "100%" }} height="100px" width="100px" alt="" /> : ''}
                            <br />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Giới tính</label>
                        <select className="form-control" onChange={hangdleGioitinh} >
                            <option value="1">nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Số điện thoại</label>
                        <input type="text" name="sdt" value={sdt} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Địa chỉ</label>
                        <input type="text" name="diachi" value={diachi} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Ngày sinh</label>
                        <input type="date" name="ngaysinh" value={ngaysinh} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Kỹ năng</label>
                        <input type="text" name="kynang" value={kynang} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Github</label>
                        <input type="text" name="github" value={github} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Facebook</label>
                        <input type="text" name="facebook" value={facebook} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Website</label>
                        <input type="text" name="website" value={website} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Châm ngôn</label>
                        <input type="text" name="chamngon" value={chamngon} onChange={onChange} className="form-control " placeholder="" aria-describedby="helpId" />
                    </div>
                    <div className="text-center">
                        <Button type="submit" variant="contained" color="primary" className=" mt-2">Sửa đổi</Button>
                    </div>
                </form>
            </Drawer>
        </div >

    )
}

Header.propTypes = {

}

export default Header