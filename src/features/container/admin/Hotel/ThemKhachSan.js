import React, { useEffect, useState } from 'react'
import { Button, IconButton } from '@material-ui/core'
import { Image, message, Upload, Modal, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import JoditEditor from "jodit-react";
import { useHistory, useParams } from 'react-router-dom'
import { storage } from "../../../../firebase"
import { PlusOutlined } from '@ant-design/icons'
import { addhotel, hotelData, updatehotel } from './hotelSlice'
import anhApi from '../../../../api/media/anhApi'
import { Option } from 'antd/lib/mentions';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function ThemKhachSan() {
    const [state, setState] = useState({
        load: false,
        linkImg: '',
        tenanh: '',
        img: '',
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        name: '',
        diachi: '',
        sdt: '',
        email: '',
        giaphong: 0,
        avatar: '',
        vitri: 1,
        bando: '',
        thoigian: 0,
        status: 1
    })

    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const hotels = useSelector(state => state.hotels.hotel.data);
    const { load, linkImg, tenanh, img, name, diachi, sdt, email, giaphong, vitri, bando, thoigian, avatar, status, previewVisible, previewImage, previewTitle, fileList } = state;

    const [chitiethotel, setChitiethotel] = useState('')
    const [luuy, setLuuy] = useState('')

    useEffect(() => {
        if (id && hotels) {
            const hotel = hotels.find(x => x.id === +id);
            if (hotel) {
                setState({
                    ...state,
                    name: hotel.name,
                    diachi: hotel.diachi,
                    sdt: hotel.sdt,
                    email: hotel.email,
                    giaphong: hotel.giaphong,
                    vitri: hotel.vitri,
                    bando: hotel.bando,
                    thoigian: hotel.thoigian,
                    avatar: hotel.avatar,
                    status: hotel.status,
                    tenanh: hotel.tenanh,
                    fileList: hotel.Anhs ? hotel.Anhs.map(anh => ({
                        uid: anh.id,
                        name: anh.tenanh,
                        status: 'done',
                        url: anh.link,
                    })) : [],
                });
                setChitiethotel(hotel.chitiethotel || '');
                setLuuy(hotel.luuy || '');
            }
        }
    }, [id, hotels])

    const onSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === "" || diachi.trim() === "" || sdt.trim() === "" || 
            email.trim() === "" || giaphong === "" || chitiethotel.trim() === "") {
            message.warning("Xin hãy nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        setState({ ...state, load: true })
        try {
            if (id) {
                // Cập nhật khách sạn
                if (fileList.length > 0) {
                    await anhApi.deleteanh('hotel', id);
                    var data = [];
                    for (let i = 0; i < fileList.length; i++) {
                        await storage.ref(`imageshotel/${fileList[i].originFileObj.name}`).put(fileList[i].originFileObj)
                        const banner = await storage.ref("imageshotel").child(fileList[i].originFileObj.name).getDownloadURL();
                        data.push({ 
                            hotelId: id, 
                            tenanh: fileList[i].originFileObj.name, 
                            link: banner, 
                            banner: 0, 
                            status: 1 
                        })
                    }
                    await anhApi.postanh(data)
                }

                var avatar = "";
                if (img !== "") {
                    await storage.ref(`imageshotel/${img.name}`).put(img)
                    avatar = await storage.ref("imageshotel").child(img.name).getDownloadURL();
                }

                if (avatar === "") {
                    await dispatch(updatehotel({ 
                        idsua: id,
                        name,
                        diachi,
                        sdt,
                        email,
                        giaphong,
                        vitri,
                        bando,
                        thoigian,
                        chitiethotel,
                        luuy,
                        status 
                    }));
                } else {
                    await dispatch(updatehotel({ 
                        idsua: id,
                        name,
                        diachi,
                        sdt,
                        email,
                        giaphong,
                        vitri,
                        bando,
                        thoigian,
                        chitiethotel,
                        luuy,
                        status,
                        tenanh,
                        avatar 
                    }));
                }
            } else {
                // Thêm khách sạn mới
                if (!img) {
                    message.error("Vui lòng chọn ảnh đại diện!");
                    return;
                }
                await storage.ref(`imageshotel/${img.name}`).put(img)
                const avatar = await storage.ref("imageshotel").child(img.name).getDownloadURL();
                
                var Anhs = [];
                for (let i = 0; i < fileList.length; i++) {
                    await storage.ref(`imageshotel/${fileList[i].originFileObj.name}`).put(fileList[i].originFileObj)
                    const banner = await storage.ref("imageshotel").child(fileList[i].originFileObj.name).getDownloadURL();
                    Anhs.push({ 
                        tenanh: fileList[i].originFileObj.name, 
                        link: banner, 
                        banner: 0, 
                        status: 1
                    })
                }

                await dispatch(addhotel({ 
                    name,
                    diachi,
                    sdt,
                    email,
                    giaphong,
                    vitri,
                    bando,
                    thoigian,
                    chitiethotel,
                    luuy,
                    status,
                    tenanh,
                    avatar,
                    Anhs 
                }));
            }
            message.success(`${id ? "Sửa" : "Thêm"} khách sạn thành công!`);
            history.push("/admin/hotel");
        } catch (error) {
            message.error(`${id ? "Sửa" : "Thêm"} khách sạn thất bại!`);
        } finally {
            setState({ ...state, load: false });
        }
    }

    const hangdelimage = (e) => {
        setState({
            ...state,
            linkImg: URL.createObjectURL(e.target.files[0]),
            tenanh: e.target.files[0].name,
            img: e.target.files[0],
        });
    }

    const handleCancel = () => setState({ ...state, previewVisible: false });

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setState({
            ...state,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    const handleChange = ({ fileList }) => setState({ ...state, fileList });

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const hangdlevitri = e => {
        setState({
            ...state,
            vitri: e
        })
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>{id ? "Sửa khách sạn" : "Thêm khách sạn"}</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <form action="" method="post" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="">Tên khách sạn <span className="text-danger">*</span></label>
                        <input type="text" name="name" value={name} onChange={onChange} className="form-control w-50" placeholder="Nhập tên khách sạn" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Địa chỉ <span className="text-danger">*</span></label>
                        <input type="text" name="diachi" value={diachi} onChange={onChange} className="form-control w-50" placeholder="Nhập địa chỉ" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Số điện thoại <span className="text-danger">*</span></label>
                        <input type="text" name="sdt" value={sdt} onChange={onChange} className="form-control w-50" placeholder="Nhập số điện thoại" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Email <span className="text-danger">*</span></label>
                        <input type="email" name="email" value={email} onChange={onChange} className="form-control w-50" placeholder="Nhập email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Giá phòng <span className="text-danger">*</span></label>
                        <input type="number" min="0" name="giaphong" value={giaphong} onChange={onChange} className="form-control w-50" placeholder="Nhập giá phòng" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Ảnh đại diện <span className="text-danger">*</span></label>
                        <div>
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
                                <span className="text-secondary">Click để chọn ảnh</span>
                            </label>
                            {linkImg || avatar ? (
                                <div className="preview-image mt-3">
                                    <Image 
                                        src={linkImg || avatar} 
                                        className="ml-5" 
                                        height="200px" 
                                        width="300px" 
                                        alt="Ảnh đại diện"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Ảnh chi tiết khách sạn</label>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            multiple={true}
                            accept="image/*"
                            beforeUpload={() => false}
                        >
                            {fileList.length >= 8 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                </div>
                            )}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                            width={800}
                        >
                            <img 
                                alt="Ảnh xem trước" 
                                style={{ width: '100%', height: 'auto' }} 
                                src={previewImage} 
                            />
                        </Modal>
                        <div className="text-secondary mt-2">
                            <small>
                                * Có thể chọn tối đa 8 ảnh<br/>
                                * Kích thước tối đa: 2MB/ảnh<br/>
                                * Định dạng: JPG, PNG
                            </small>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Vị trí</label><br />
                        <Select className="w-50" value={vitri} onChange={hangdlevitri}>
                            <Option value={1}>Trong nước</Option>
                            <Option value={2}>Nước ngoài</Option>
                        </Select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Thời gian</label>
                        <input type="number" min="0" name="thoigian" value={thoigian} onChange={onChange} className="form-control w-50" placeholder="Nhập thời gian" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Bản đồ</label>
                        <input type="text" name="bando" value={bando} onChange={onChange} className="form-control w-50" placeholder="Nhập link bản đồ" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Chi tiết khách sạn <span className="text-danger">*</span></label>
                        <JoditEditor
                            value={chitiethotel}
                            tabIndex={1}
                            onChange={e => setChitiethotel(e)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Lưu ý</label>
                        <JoditEditor
                            value={luuy}
                            tabIndex={1}
                            onChange={e => setLuuy(e)}
                        />
                    </div>

                    <div className="text-center mtb">
                        {load ? <div className="spinner-border text-success" role="status"><span className="sr-only">Loading...</span></div> : ''}
                        <Button type="submit" variant="contained" color="primary">{id ? "Sửa khách sạn" : "Thêm khách sạn"}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ThemKhachSan
