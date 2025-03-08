import { Carousel, message, Popover, Radio, Rate, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './tour.css'
import { Button } from '@material-ui/core';
import { Link, useHistory, useParams } from 'react-router-dom';
import Detail from '../detail/Detail';
import Footer from '../../trangchu/footer/Footer'
import Modal from 'antd/lib/modal/Modal';
import Hinhthucthanhtoan from './Hinhthucthanhtoan'
import Dieukhoan from './Dieukhoan'
import { binhluanData } from '../../admin/Binhluan/binhluanSlice';
import { addhoadon, hoadonData } from '../../admin/Hoadon/hoadonSlice';
import taikhoanApi from '../../../../api/user/taikhoanApi';
import { ngaydiData } from '../../admin/Ngaydi/ngaydiSlice';
import { addthanhtoan } from './thanhtoanSlice';
function Tour(props) {
  const { id } = useParams()
  // console.log("ID:", id);
  const [state, setState] = useState({
    listdate: '',
    visible: false,
    visible2: false,
    visible3: false,
    name: "",
    email: "",
    sdt: "",
    diachi: "",
    nguoilon: 1,
    treem: 0,
    embe: 0,
    dieukhoan: false,
    valueDate: "",
    date: "",
    loadlaihoadon: 1,
  })

  const binhluans = useSelector(state => state.binhluans.binhluan.data);
  var binhluanload = [];
  if (binhluans) {
    for (let i = 0; i < binhluans.length; i++) {
      if (binhluans[i].tourId === +id && binhluans[i].status === +1) {
        binhluanload.push(binhluans[i]);
      }
    }
  }

  const tinhdiem = () => {
    var tong = new Number()
    if (binhluans) {
      for (let i = 0; i < binhluanload.length; i++) {
        tong += binhluanload[i].star
      }
    }
    var diem = Math.round((tong / +binhluanload.length) * 10) / 10
    if (isNaN(diem)) {
      diem = 0
    }
    return diem
  }

  const dispatch = useDispatch();
  const actionbinhluan = async () => { await dispatch(binhluanData()) }
  const actionhoadon = async () => { await dispatch(hoadonData()) }
  const actionngaydi = async () => { await dispatch(ngaydiData()) }

  const tours = useSelector(state => state.tours.tour.data);
  const ngaydis = useSelector(state => state.ngaydis.ngaydi.data);

  const tour = [];
  if (tours) {
    for (let i = 0; i < tours.length; i++) {
      if (tours[i].id === +id) {
        tour.push(tours[i].Ngaydis)
      }
    }
  }
  var giakhuyenmai
  if (tours) {
    giakhuyenmai = tours.find(x => x.id === +id);
  }
  const formatdate = e => {
    if (e) {
      var ngay = e.substr(0, 2)
      var thang = e.substr(3, 2)
      var nam = e.substr(6, 4)
      return nam + '-' + thang + '-' + ngay;
      }
      return null;
    }
    const checkngaydi = () => {
      // Kiểm tra tour có dữ liệu không
      if (!tour || tour.length === 0 || !tour[0]) {
        return null;
    }

    try {
        const ngaydi = tour[0];
        // console.log("Ngày đi data:", ngaydi);

        // Lấy ngày hiện tại
        var date = new Date();
        var dateToday = date.getFullYear() + "-" + 
            ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + 
            (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));

        // Tìm ngày gần nhất
        var listDate = [];
        for (let i = 0; i < ngaydi.length; i++) {
            const formattedDate = formatdate(ngaydi[i].ngay);
            if (formattedDate && formattedDate >= dateToday) {
                listDate.push(formattedDate);
            }
        }

        // Sắp xếp ngày tăng dần
        listDate.sort((a, b) => new Date(a) - new Date(b));
        // console.log("Danh sách ngày hợp lệ:", listDate);

        // Trả về ngày gần nhất
        return listDate.length > 0 ? listDate[0] : null;

    } catch (error) {
        console.error("Lỗi xử lý ngày:", error);
        return null;
    }
  }
  const fillDate = () => {
    if (tour.length !== 0) {
      var ngaydi = tour[0];
      var date = new Date();
      var dates = []
      var dateToday = date.getFullYear() + "-" + ((date.getMonth() + 1) > 1 ? date.getMonth() + 1 : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() > 1 ? date.getDate() : ("0" + date.getDate()));
      for (let i = 0; i < ngaydi.length; i++) {
        // console.log(dateToday <= formatdate(ngaydi[i].ngay));
        if (date <= new Date(formatdate(ngaydi[i].ngay))) {
          dates.push({ id: i + 1, ngay: ngaydi[i].ngay })
        }
      }

      return dates
    }
  }

  const formatlaidate = (e) => {
    if (e) {
      var ngay = e.substr(8, 2)
      var thang = e.substr(5, 2)
      var nam = e.substr(0, 4)
      return ngay + "/" + thang + "/" + nam
    }
  }
  var tour_ngay = [];
  if (ngaydis && formatlaidate(checkngaydi())) {
    tour_ngay.push(ngaydis.find(x => x.ngay === formatlaidate(checkngaydi())).Tours.find(x => x.id === +id))
  }
  const hide = () => {
    setState({
      ...state,
      visible3: false,
    });
  };
  const handleVisibleChange = () => {
    setState({ ...state, visible3: true, listdate: fillDate() });
  };
  const users = useSelector(state => state.infor.infor.data);
  useEffect(() => {
    actionngaydi();
    actionbinhluan();
    actionhoadon();
    window.scrollTo(0, 0);

  }, [state.loadlaihoadon])
  const showModal = async () => {
    if (users) {
      var user = await taikhoanApi.getOne(+users.id).then(data => {
        return data;
      })
      setState({
        ...state,
        visible3: false,
        visible: true,
        name: user.name,
        diachi: user.diachi,
        sdt: user.sdt,
        email: user.email
      });
    } else {
      message.warning("Bạn cần đăng nhập trước!")
    }
  };
  const handleOk = e => {
    if (name === "" || sdt === "" || diachi === "" || email === "" || !name || !sdt || !diachi || !email) {
      message.warning('Bạn cần cập nhật thông tin cho tài khoản!');
    } else {
      var songuoi = tours.find(x => x.id === +id).songuoi;
      if (songuoiconlai(songuoi) === 0) {
        message.warning("Đã hết chỗ quý khách vui lòng chọn thời gian khác!")
      } else {
        if (tong > songuoiconlai(songuoi)) {
          message.warning("Vượt quá số người cho phép!")
        } else {
          setState({
            ...state,
            visible2: true,
          });
        }
      }
    }
  };
  const handleCancel = e => {
    setState({
      ...state,
      visible: false,
    });
  };
  const thanhtien = (gia_te, gia_eb) => {
    var gianguoilon = checkKhuyenmai();
    return ((gianguoilon * nguoilon) + (gia_te * treem) + (gia_eb * embe));
  }
  const [stylepayment, setstylepayment] = useState(1);
  const callbackfunction = (data) => {
    setstylepayment(data);
  }
  const history = useHistory();
  const handleOk2 = async () => {
    if (state.dieukhoan === false) {
      message.warning("Bạn chưa đồng ý điều khoản của chúng tôi!")
    } else {
      var userId = await taikhoanApi.getOne(+users.id).then(data => {
        return data.id;
      })
      var tourId = id
      let tongtien = thanhtien(tour_ngay[0].giatreem, tour_ngay[0].giaembe)
      if (stylepayment === 1) {
        await dispatch(addhoadon({ thanhtien: tongtien, tourId, userId, nguoilon, treem, embe, ngaydi: state.date === "" ? formatlaidate(checkngaydi()) : state.date }));
        setState({
          ...state,
          visible2: false,
          visible: false,
          loadlaihoadon: state.loadlaihoadon + 1
        });
      } else if (stylepayment === 3) {

        dispatch(addthanhtoan({ hoadon: { tourId, userId, nguoilon, treem, embe, ngaydi: state.date === "" ? formatlaidate(checkngaydi()) : state.date }, nguoilon, treem, embe, tongtien, "name": tour_ngay[0].name, "giatreem": tour_ngay[0].giatreem, "giaembe": tour_ngay[0].giaembe, "gianguoilon": tour_ngay[0].gianguoilon }))
        history.push("/stripe");
      }
    }
  };
  const handleCancel2 = e => {
    setState({
      ...state,
      visible2: false,
    });
  };
  const onchange = (e) => {

    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }
  const onChangedate = e => {
    setState({ ...state, valueDate: e.target.value });
  };
  const hoadons = useSelector(state => state.hoadons.hoadon.data);
  const songuoiconlai = (e) => {
    var tonghd = new Number();
    if (hoadons) {
      for (let i = 0; i < hoadons.length; i++) {
        if (hoadons[i].tourId === +id) {
          tonghd += (hoadons[i].nguoilon + hoadons[i].treem + hoadons[i].embe)
        }
      }
    }
    return (e - tonghd);
  }
  const tinhkhuyenmai = (money, km) => {
    return ((money) - ((money) * (km / 100)))
  }
  const { name, sdt, diachi, email, nguoilon, treem, embe } = state
  const checkKhuyenmai = () => {
    if (giakhuyenmai.Khuyenmais.length === 0) {
      return giakhuyenmai.gianguoilon;
    } else {
      if (giakhuyenmai.Khuyenmais[0].status === 0) {
        return giakhuyenmai.gianguoilon;
      } else {
        return tinhkhuyenmai(giakhuyenmai.gianguoilon, giakhuyenmai.Khuyenmais[0].khuyenmai);
      }
    }
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  const adddate = (e) => {
    setState({
      ...state,
      date: state.listdate.find(x => x.id === +e).ngay
    })
  }
  var tong
  if (giakhuyenmai) {
    tong = Number(nguoilon) + Number(treem) + Number(embe);
  }
  return (
    <div id="detail-tour">
   
      { tour_ngay.length === 0 ?
        <div className="spin"><Spin className="mt-1" /></div>
        :
        tour_ngay.map(ok => (
          <div className="box-tour" key={ok.id}>
            <div className="container bg-white">
              <div className="row justify-content-center" >
                <div className="d-flex justify-content-center align-items-center flex-column col-lg-8">
                    <div className="tour-header">
                        {console.log("tours:", tours)}
                        <Carousel autoplay>
                            {(
                                <div>
                                    <img 
                                        src={tours.find(x => x.id === +id)?.avatar} 
                                        alt="Tour avatar" 
                                    />
                                </div>
                            )}
                        </Carousel>
                        <h3 className="tour-name">{ok.name}</h3>
                    </div>
                </div>
                <div className="col-lg-4 position-relative ">
                  <div className=" pl-3">
                    <div className="star-rating-section">
                      <div className="star">
                        <Rate value={tinhdiem()} disabled />
                      </div>
                      <div className="icon-comment">
                        <span>
                          <strong>{tinhdiem()}/5</strong> điểm
                        </span>
                        <span>
                          <strong>{binhluanload.length}</strong> đánh giá
                        </span>
                      </div>
                    </div>
                    <div className="view">
                      <span>
                        <i className="far fa-thumbs-up"></i>
                        200
                      </span>
                      <span>
                        <i className="far fa-comment-dots"></i>
                        {binhluanload.length}
                      </span>
                    </div>

                    <hr className="hr-tour" />
                    <div className="tt-tour">
                      <table className="w-100">
                        <tr>
                          <td><span>Khởi hành:</span></td>
                          <td><span>{state.date === "" ? formatlaidate(checkngaydi()) : state.date}</span></td>
                          <td>
                            <Popover
                              content={
                                <div>
                                  <Radio.Group onChange={onChangedate} value={state.valueDate}>
                                    {state.listdate === "" ? "" :
                                      state.listdate.map(ok => (
                                        <Radio style={radioStyle} key={ok.id} value={ok.id}>
                                          <span onClick={() => { adddate(ok.id) }}>{ok.ngay}</span><br />
                                        </Radio>
                                      ))}
                                  </Radio.Group>
                                  <hr />
                                  <div className="text-center">
                                    <strong className="text-danger" style={{ cursor: "pointer" }} onClick={hide}>Close</strong>
                                  </div>
                                </div>
                              }
                              title="Chọn ngày khác"
                              trigger="click"
                              visible={state.visible3}
                              onVisibleChange={handleVisibleChange}
                            >
                              <span className="text-primary" style={{ cursor: "pointer" }}>Đổi ngày</span>
                            </Popover>
                          </td>
                        </tr>
                        <tr>
                          <td><span>Thời gian:</span></td>
                          <td><span>{ok.thoigian} ngày</span></td>
                        </tr>
                        <tr>
                          <td><span>Nơi khởi hành:</span></td>
                          <td><span>Vinh</span></td>
                        </tr>
                      </table>
                    </div>
                    <Button className="float-right position-absolute btn-dt" onClick={showModal} variant="contained" color="secondary">
                      Đặt tour
                  </Button>
                    <div className="price position-absolute">
                      <span><strong className="text-danger">{(checkKhuyenmai()).toLocaleString()}</strong> vnd</span>
                      <br />
                      <span>Số chỗ còn lại: {songuoiconlai(ok.songuoi)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Detail id={id} />
            </div>
          </div>

        ))}
      <Footer />
      <Modal
        title="Đặt tour"
        visible={state.visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h4 className="text-center text-primary">Thông tin liên lạc</h4>
        <div className="form-group">
          <label htmlFor="">Họ tên(*)</label>
          <input type="text"
            className="form-control" name="name" disabled value={name} onChange={onchange} aria-describedby="helpId" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="">Email(*)</label>
          <input type="email"
            className="form-control" name="email" disabled value={email} onChange={onchange} aria-describedby="helpId" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="">Số điện thoại(*)</label>
          <input type="text"
            className="form-control" name="sdt" disabled value={sdt} onChange={onchange} aria-describedby="helpId" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="">Địa chỉ</label>
          <input type="text"
            className="form-control" name="diachi" disabled value={diachi} onChange={onchange} aria-describedby="helpId" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="">Ngày đi</label>
          <input type="text"
            className="form-control" name="diachi" disabled value={state.date === "" ? formatlaidate(checkngaydi()) : state.date} onChange={onchange} aria-describedby="helpId" placeholder="" />
        </div>
        <h4 className="text-center text-primary">Số người</h4>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="">Người lớn</label>
              <input type="number"
                className="form-control" name="nguoilon" min="1" value={nguoilon} onChange={onchange} aria-describedby="helpId" placeholder="" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="">Trẻ em</label>
              <input type="number"
                className="form-control" name="treem" min="0" value={treem} onChange={onchange} aria-describedby="helpId" placeholder="" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="">Em bé</label>
              <input type="number"
                className="form-control" value={embe} name="embe" min="0" onChange={onchange} aria-describedby="helpId" placeholder="" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="">Tổng</label>
              <input type="number" disabled
                className="form-control" name="tong" value={tong} aria-describedby="helpId" placeholder="" />
            </div>
          </div>
        </div>
        <h4 className="text-center text-primary">Thành tiền</h4>
        {tour_ngay.map(ok => (
          <p key={ok.id}>Số tiền cần phải trả: <strong className="text-danger">{thanhtien(ok.giatreem, ok.giaembe).toLocaleString()}</strong></p>
        ))}
      </Modal>
      <Modal
        title="Đặt tour"
        visible={state.visible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <h4 className="text-center text-primary">Hình thức thanh toán</h4>
        <Hinhthucthanhtoan callback={callbackfunction} />
        <h4 className="text-center text-primary">Điều khoản</h4>
        <div className="dieukhoan">
          <Dieukhoan />
        </div>
        <input type="checkbox" onChange={onchange} className="mt-3" name="dieukhoan" id="dk" />
        <label htmlFor="dk" className="ml-3"><strong>Tôi đồng ý với điều khoản ở trên</strong></label>
      </Modal>
    </div>

  )
}

export default Tour