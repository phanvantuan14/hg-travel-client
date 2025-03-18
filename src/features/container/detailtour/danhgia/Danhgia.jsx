import { message, Progress, Rate, Spin } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import renderHTML from 'react-render-html';
import React, { useState } from 'react'
import './danhgia.css'
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addbinhluan, binhluanData, updatebinhluan } from '../../admin/Binhluan/binhluanSlice';
function Danhgia(props) {
    const [text, setText] = useState(renderHTML("<span className='text-success'>Cực kỳ hài lòng</span>"))
    const [state, setState] = useState({ binhluan: '', star: 5, status: 1, diem: '' })
    const binhluans = useSelector(state => state.binhluans.binhluan.data);
    const infor = useSelector(state => state.infor.infor.data);
    var binhluanload = [];
    if (binhluans) {
        for (let i = 0; i < binhluans.length; i++) {
            if (binhluans[i].tourId === +props.id && binhluans[i].status === +1) {
                binhluanload.push(binhluans[i]);
            }
        }
    }
    const taikhoans = useSelector(state => state.taikhoan.user.data);
    const load = useSelector(state => state.binhluans.loading);
    const { binhluan, star, status } = state
    const dispatch = useDispatch();
    const danhgiatext = e => {
        setState({
            ...state,
            star: e
        })
        switch (e) {
            case 5:
                setText(renderHTML("<span className='text-success'>Cực kỳ hài lòng</span>"))
                break;
            case 4:
                setText(renderHTML("<span className='text-success'>Hài lòng</span>"))
                break;
            case 3:
                setText(renderHTML("<span className='text-warning'>Bình thường</span>"))
                break;
            case 2:
                setText(renderHTML("<span className='text-danger'>Không hài lòng</span>"))
                break;
            case 1:
                setText(renderHTML("<span className='text-danger'>Cực kỳ không hài lòng</span>"))
                break;
        }
    }
    const actionbinhluan = async () => { await dispatch(binhluanData()) }
    const onChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const checklogin = useSelector(state => state.infor.infor.data);
    const onSubmit = e => {
        e.preventDefault();
        var tourId = props.id;
        var userId = infor.id;
        if (binhluan.length === 0 || binhluan.length > 10) {
            if (binhluans.find(x => x.tourId === +tourId && x.userId === +userId)) {
                var binhluanid = binhluans.find(x => x.tourId === +tourId && x.userId === +userId);
                var idsua = binhluanid.id
                dispatch(updatebinhluan({ idsua, tourId, binhluan, userId, star, status }))
                setTimeout(() => {
                    actionbinhluan();
                }, 500);
            } else {
                dispatch(addbinhluan({ tourId, binhluan, userId, star, status }))
                setTimeout(() => {
                    actionbinhluan();
                }, 500);
            }
        } else {
            message.warning("Bạn quá ngắn, tối thiểu là 10 ký tự!");
        }
        setState({
            ...state,
            binhluan: '',
        })
    }
    const checkstar = (e) => {
        switch (e) {
            case 5:
                return renderHTML("<b className='text-success'>Cực kỳ hài lòng</b>")
                break;
            case 4:
                return renderHTML("<b className='text-success'>Hài lòng</b>")
                break;
            case 3:
                return renderHTML("<b className='text-warning'>Bình thường</b>")
                break;
            case 2:
                return renderHTML("<b className='text-danger'>Không hài lòng</b>")
                break;
            case 1:
                return renderHTML("<b className='text-danger'>Cực kỳ không hài lòng</b>")
                break;
        }
    }
    const tinhdiem = () => {
        var tong = new Number()
        if (binhluans) {
            for (let i = 0; i < binhluanload.length; i++) {
                tong += binhluanload[i].star
            }
        }
        var diem = Math.round((tong / +binhluanload.length) * 10) / 10;
        if (isNaN(diem)) {
            diem = 0
        }
        return diem
    }
    const songuoidanhgia = () => {
        return binhluanload.length
    }
    const sao = (e) => {
        var ok = []
        for (let i = 0; i < binhluanload.length; i++) {
            if (binhluanload[i].star === +e) {
                ok.push(binhluanload[i])
            }
        }
        return ok.length
    }
    const progress_sao = (e) => {
        return (+e / +binhluanload.length) * 100
    }
    const formatdate = e => {
        if (e) {
            var ngay = e.substr(8, 2)
            var thang = e.substr(5, 2)
            var nam = e.substr(0, 4)
            return ngay + ' tháng ' + thang + ', ' + nam;
        }
    }
    return (
        <div id="nx">
            <div className="heading-nx">
                <h3>Đánh giá</h3>
            </div>
            <div>
                <div className="row">
                    <div className="col-md-2 text-center">
                        <p className="scores">{tinhdiem()}</p>
                        <Rate className="rate" value={tinhdiem()} disabled />
                        <p>{songuoidanhgia()} nhận xét</p>
                    </div>
                    <div className="col-md-10">
                        <div>
                            <Rate className="rate " value="5" disabled />
                            <Progress percent={progress_sao(sao(5))} showInfo={false} />
                            <span>{sao(5)}</span>
                        </div>
                        <div>
                            <Rate className="rate" value="4" disabled />
                            <Progress percent={progress_sao(sao(4))} showInfo={false} />
                            <span>{sao(4)}</span>
                        </div>
                        <div>
                            <Rate className="rate" value="3" disabled />
                            <Progress percent={progress_sao(sao(3))} showInfo={false} />
                            <span>{sao(3)}</span>
                        </div>
                        <div>
                            <Rate className="rate" value="2" disabled />
                            <Progress percent={progress_sao(sao(2))} showInfo={false} />
                            <span>{sao(2)}</span>
                        </div>
                        <div>
                            <Rate className="rate" value="1" disabled />
                            <Progress percent={progress_sao(sao(1))} showInfo={false} />
                            <span>{sao(1)}</span>
                        </div>
                    </div>
                </div>
                <div className="container"><hr /></div>
                {checklogin === undefined ? '' :
                    <div className="container">
                        <h3>Đánh giá tour</h3>
                        <div className="container mb-5">
                            <div>
                                <strong className="dg-diem">Cho điểm: </strong><Rate className="rate-dg ml-4" defaultValue="5" onChange={danhgiatext} /><span className="ml-4 text-dg"><b>{text}</b></span>
                            </div>
                            <div className="bg-red">
                                <form action="" method="post" onSubmit={onSubmit}>
                                    <div class="form-group">
                                        <label for=""></label>
                                        <textarea name="binhluan" value={binhluan} onChange={onChange} id="" cols="30" rows="7" placeholder="Đánh giá của bạn" className="form-control"></textarea>
                                    </div>
                                    <div className="position-relative"><Button htmlType="submit" type="primary" className="btn-dg">Đánh giá</Button></div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
                <div>
                    {load ? <div className="spin"><Spin className="mt-5" /></div> :
                        binhluanload.map(ok => (
                            <div className="mb-5" key={ok.id}>
                                <div className="avatar float-left">
                                    <Avatar className="mr-2" src={ok.User.Avatar} />
                                </div>
                                <div className="tt-user">
                                    <strong>{ok.User.name}</strong>
                                    <i className="fas fa-check"></i><span className="text-success font-weight-bolder"> Khách hàng đã trải nghiệm tour</span><br />
                                    <span className="text-primary">Nhận xét vào {formatdate(ok.createdAt)}</span>
                                </div>
                                <div className="clear nx">
                                    <Rate className="rate" value={ok.star} disabled /><br />
                                    {checkstar(ok.star)}<br />
                                    <p className="content-nx text-justify">{ok.binhluan}</p>
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        </div>

    )
}

Danhgia.propTypes = {

}

export default Danhgia