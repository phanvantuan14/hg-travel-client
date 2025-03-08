import { Avatar, Rate } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import "./ykien.css";
import Fade from 'react-reveal/Fade';
import tk from "../../../images/tk.png"

function Ykienkhachhang(props) {
  const binhluans = useSelector(state => state.binhluans.binhluan.data);
  var binhluan = [];
  if (binhluans) {
    for (let i = 0; i < binhluans.length; i++) {
      if (binhluans[i].status === 1 && binhluans[i].loadhome === 1) {
        binhluan.push(binhluans[i])
      }
    }
  }
  return (
    <div id="ykien">
      <div className="fixed-background ">
        <div className="dark">
          <div className="mt-5 tour" >
            <div className="heading text-center pt-5">
              <span className="text-white"  >ý kiến khách hàng</span>
              <div className="hr"></div>
              <p className="mb-4">
                Những đánh giá của khách hàng sau khi trải nghiệm đặt tour trên
                website.
      </p>
            </div>
            <div className="container">
              <Fade bottom>
                <div className="row justify-content-center pb-5">
                  {!binhluans ? '' :
                    binhluan.map(ok => (
                      <div className="col-md-4" key={ok.id}>
                        <div className="content-yk text-center rounded ">
                          <p>
                            <i className="fa fa-quote-left mr-3"></i>
                            {ok.binhluan}
                            <i className="fa fa-quote-right ml-3"></i>
                          </p>
                        </div>
                        <div className="avatar-yk text-center">
                          <Avatar
                            src={ok.User.avatar ? ok.User.avatar : tk}
                            className="mt-3 mb-2"
                          />
                          <br />
                          <strong>{ok.User.name}</strong><br />
                          <Rate value={ok.star} disabled />
                        </div>
                      </div>

                    ))}
                </div>

              </Fade>
            </div>
            <div className="fixed-wrap">
              <div className="fixed"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

Ykienkhachhang.propTypes = {

}

export default Ykienkhachhang