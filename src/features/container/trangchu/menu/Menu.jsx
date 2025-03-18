import React, { useEffect, useState } from "react";
import { Link as Linkrt, useHistory, useLocation } from "react-router-dom";
import "./menu.css";
import Avatar from "antd/lib/avatar/avatar";
import logo from "./../../../images/logoTravel.png"
import { Menu, Dropdown, Drawer, message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { Button, IconButton } from "@material-ui/core";
import { storage } from "../../../../firebase"
import { inforData } from "../../login/inforSlice";
import taikhoanApi from "../../../../api/user/taikhoanApi";
import tk from "../../../images/tk.png";

function ListMenu({ isHome = true }) {

  const [avatar, setAvatar] = useState('');
  const [user, setUser] = useState();
  const [state, setState] = useState({
    collapsed: false,
    visible: false,
    collapsed2: false,
    visible2: false,
    name: '',
    gioitinh: 1,
    diachi: '',
    ngaysinh: '',
    sdt: '',
    anh: "",
    linkImg: '',
    tenanh: '',
    img: ''
  });

  // Redux hooks
  const users = useSelector(state => state.infor.infor.data);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // Event handlers
  const hangdelimage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setState({
        ...state,
        linkImg: URL.createObjectURL(e.target.files[0]),
        tenanh: e.target.files[0].name,
        img: e.target.files[0],
      });
    }
  }

  const showDrawer = () => {
    if (users) {
      setState({
        ...state,
        visible: true
      })
    } else {
      message.error("Bạn cần phải đăng nhập trước!")
    }
  };

  const showDrawer2 = () => {
    if (users) {
      setState({
        ...state,
        visible2: true
      })
    } else {
      message.error("Bạn cần phải đăng nhập trước!")
    }
  };

  const onClose = () => {
    setState({
      ...state,
      visible: false
    })
  };

  const onClose2 = () => {
    setState({
      ...state,
      visible2: false
    })
  };

  // API calls
  const getprofile = async () => {
    if (users) {
      try {
        const userProfile = await taikhoanApi.getOne(users.id);
        setUser(userProfile);
        setAvatar(userProfile.avatar);
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error("Không thể tải thông tin người dùng");
      }
    }
  }

  useEffect(() => {
    getprofile();
    setAvatar('');
  }, [users]);

  const actioninfor = async () => {
    await dispatch(inforData());
  }

  const logout = () => {
    localStorage.removeItem("token");
    actioninfor();
    setAvatar('');
    setUser("");
    message.success("Đăng xuất thành công");
    history.push('/dangnhap');
  }

  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const phanquyen = () => {
    if (users && users.role) {
      return users.role !== "user";
    }
    return false;
  }

  // Form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, diachi, ngaysinh, gioitinh, sdt, img } = state;

    if (!user || !user.id) {
      message.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    if (!name.trim() || !diachi.trim() || !ngaysinh.trim() || !sdt.trim()) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (img) {
        await storage.ref(`imagesUser/${img.name}`).put(img);
        const anh = await storage.ref("imagesUser").child(img.name).getDownloadURL();
        const update = await taikhoanApi.edituser({
          idsua: user.id,
          name,
          avatar: anh,
          diachi,
          gioitinh,
          ngaysinh,
          sdt,
          status: 1
        });

        if (update) {
          getprofile();
          message.success("Cập nhật thông tin thành công!");
          setState({
            ...state,
            visible2: false,
            name: '',
            gioitinh: 1,
            diachi: '',
            ngaysinh: '',
            sdt: '',
            anh: "",
            linkImg: '',
            tenanh: '',
            img: ''
          });
        } else {
          message.error("Cập nhật thất bại!");
        }
      } else {
        const update = await taikhoanApi.edituser({
          idsua: user.id,
          name,
          diachi,
          sdt,
          gioitinh,
          ngaysinh
        });

        if (update) {
          getprofile();
          message.success("Cập nhật thông tin thành công!");
          setState({
            ...state,
            visible2: false,
            name: '',
            gioitinh: 1,
            diachi: '',
            ngaysinh: '',
            sdt: '',
            anh: "",
            linkImg: '',
            tenanh: '',
            img: ''
          });
        } else {
          message.error("Cập nhật thất bại!");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Đã xảy ra lỗi khi cập nhật thông tin");
    }
  }

  const hangdleGioitinh = (e) => {
    setState({
      ...state,
      gioitinh: e.target.value
    })
  }

  const formatdate = e => {
    if (e) {
      var ngay = e.substr(8, 2)
      var thang = e.substr(5, 2)
      var nam = e.substr(0, 4)
      return ngay + '/' + thang + '/' + nam;
    }
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/') {
      return location.pathname.startsWith(path);
    }
    return false;
  };
  // Dropdown menus
  const avatarDropdown = (
    <Menu>
      {!users && (
        <Menu.Item key="0">
          <Linkrt to="/dangnhap">Đăng nhập</Linkrt>
        </Menu.Item>
      )}
      <Menu.Item key="2">
        <span onClick={showDrawer} className="nav-link_admin">Xem thông tin</span>
      </Menu.Item>
      <Menu.Item key="4">
        <Linkrt to="/thongtin/0" className="nav-link_admin">Xem lịch sử</Linkrt>
      </Menu.Item>
      {users && phanquyen() && (
        <Menu.Item key="3">
          <Linkrt to="/admin" className="nav-link_admin">QUẢN TRỊ VIÊN</Linkrt>
        </Menu.Item>
      )}
      {users && (
        <>
          <Menu.Divider />
          <Menu.Item key="1">
            <span onClick={logout} className="nav-link_admin">Đăng xuất</span>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const { name, diachi, ngaysinh, gioitinh, sdt, linkImg, img } = state;

  return (
    <div id="menu">
      <div className="background">
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <Linkrt className="navbar-brand d-flex align-items-center" to="/">
            <div className="d-flex align-items-center">
              <img src={logo} alt="Logo" className="img-fluid mr-2" style={{ height: "40px" }} />
              <h1 className="mb-0 h4 text-white">HG Travel</h1>
            </div>
          </Linkrt>
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-toggle="collapse"
            data-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavId">
            <ul className="navbar-nav m-auto">
              <li className="nav-item">
                <Linkrt
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  to="/"
                >
                  Trang chủ
                </Linkrt>
              </li>
              <li className="nav-item">
                <Linkrt
                  className={`nav-link ${isActive("/list-tour") ? "active" : ""}`}
                  to="/list-tour"
                >
                  Tour du lịch
                </Linkrt>
              </li>
              <li className="nav-item">
                <Linkrt
                  className={`nav-link ${isActive("/hotels") ? "active" : ""}`}
                  to="/hotels"
                >
                  Khách sạn
                </Linkrt>
              </li>

              <li className="nav-item">
                <Linkrt
                  className={`nav-link ${isActive("/listtintuc") ? "active" : ""}`}
                  to="/listtintuc"
                >
                  Tin tức
                </Linkrt>
              </li>
              <li className="nav-item">
                <Linkrt
                  className={`nav-link ${isActive("/gioithieucongty") ? "active" : ""}`}
                  to="/gioithieucongty"
                >
                  Giới thiệu công ty
                </Linkrt>
              </li>
            </ul>
            <div className="d-flex align-items-center justify-content-center">
              {users ? (
                <Dropdown overlay={avatarDropdown} trigger={['click']}>
                  <span className="nav-link">
                    <Avatar
                      size="large"
                      style={{ border: "2px solid #0abf54" }}
                      src={user ? avatar ? avatar : tk : tk}
                    >
                      VK
                    </Avatar>
                  </span>
                </Dropdown>
              ) : (
                <div className="auth-buttons">
                  <Linkrt to="/dangnhap" className="btn-auth btn-login">
                    Đăng nhập
                  </Linkrt>
                  <Linkrt to="/dangky" className="btn-auth btn-register">
                    Đăng ký
                  </Linkrt>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Drawer for user profile */}
        <Drawer
          style={{ zIndex: '100000' }}
          className="drawer-menu"
          title="Thông tin cá nhân"
          placement="right"
          onClose={onClose}
          visible={state.visible}
        >
          {!user ? "" : (
            <div>
              <div>
                <div className="center">
                  <img
                    src={user ? avatar ? avatar : tk : tk}
                    className="avatar-admin"
                    alt="Avatar"
                  />
                </div>
                <h4 className="text-center mt-3 mb-4">Cá nhân</h4>
                <div className="row">
                  <div className="col-md-12">
                    <p className="mb-3"><span className="info-label">Họ tên:</span><span className="tt-user">{user.name}</span></p>
                    <p className="mb-3"><span className="info-label">Giới tính:</span><span className="tt-user">{user.gioitinh === +1 ? "Nam" : "Nữ"}</span></p>
                    <p className="mb-3"><span className="info-label">Ngày sinh:</span><span className="tt-user">{formatdate(user.ngaysinh)}</span></p>
                  </div>
                </div>
              </div>
              <hr />

              <h4 className="text-center mt-4 mb-3">Liên hệ</h4>
              <div className="row">
                <div className="col-md-12">
                  <p className="mb-3"><span className="info-label">Email:</span><span className="tt-user">{user.email}</span></p>
                  <p className="mb-3"><span className="info-label">Số điện thoại:</span><span className="tt-user">{user.sdt}</span></p>
                  <p className="mb-3"><span className="info-label">Địa chỉ:</span><span className="tt-user">{user.diachi}</span></p>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={showDrawer2}
                  className="mt-2 edit-profile-btn"
                >
                  Thay đổi thông tin
                </Button>
              </div>
            </div>
          )}
        </Drawer>

        {/* Drawer for editing profile */}
        <Drawer
          style={{ zIndex: '100001' }}
          className="drawer-menu"
          title="Sửa thông tin cá nhân"
          placement="right"
          onClose={onClose2}
          visible={state.visible2}
        >
          <form action="" method="post" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên người dùng</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                className="form-control"
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar">Thêm ảnh đại diện</label>
              <div className="avatar-upload">
                <input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={hangdelimage}
                  style={{ display: 'none' }}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    className="mr-5 ml-4"
                    aria-label="upload picture"
                    component="span"
                  >
                    <i className="fas fa-camera-retro"></i>
                  </IconButton>
                </label>
                {linkImg && (
                  <img
                    src={linkImg}
                    className="ml-5 preview-avatar"
                    style={{ borderRadius: "100%" }}
                    height="100px"
                    width="100px"
                    alt="Preview"
                  />
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="gioitinh">Giới tính</label>
              <select
                className="form-control"
                id="gioitinh"
                onChange={hangdleGioitinh}
                value={gioitinh}
              >
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sdt">Số điện thoại</label>
              <input
                type="text"
                name="sdt"
                id="sdt"
                value={sdt}
                onChange={onChange}
                className="form-control"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group">
              <label htmlFor="diachi">Địa chỉ</label>
              <input
                type="text"
                name="diachi"
                id="diachi"
                value={diachi}
                onChange={onChange}
                className="form-control"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ngaysinh">Ngày sinh</label>
              <input
                type="date"
                name="ngaysinh"
                id="ngaysinh"
                value={ngaysinh}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="mt-2 submit-btn"
              >
                Cập nhật
              </Button>
            </div>
          </form>
        </Drawer>
      </div>
    </div>
  );
}

export default ListMenu;