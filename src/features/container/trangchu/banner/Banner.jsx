import React, { useEffect, useState } from "react";
import "./banner.css";
import { Carousel, Spin } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import anhApi from "../../../../api/media/anhApi";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await anhApi.getAll();
        const data = Array.isArray(response) ? response : response.data || [];
        const filteredBanners = data.filter(item => item.status === 1);

        setBanners(filteredBanners);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);


  if (loading) {
    return <div className="text-center"><Spin /></div>;
  }

  if (error) {
    return null;
  }

  return (
    <div id="banner">
      <Carousel autoplay effect="fade">
        {banners.length > 0 ? (
          banners.map(ok => (
            <div className="fit" key={ok.id}>
              <img
                src={ok.link}
                alt="Banner"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-banner.jpg'
                }}
              />
              <div className="banner-content">
                <h1 className="banner-title">Khám Phá Việt Nam</h1>
                <p className="banner-subtitle">Trải nghiệm những chuyến đi tuyệt vời</p>
                <Link to="/list-tour" className="banner-button">
                  Đặt Ngay
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="fit">
            <img src="/default-banner.jpg" alt="Default banner" />
            <div className="banner-content">
              <h1 className="banner-title">Khám Phá Việt Nam</h1>
              <p className="banner-subtitle">Trải nghiệm những chuyến đi tuyệt vời</p>
              <Link to="/list-tour" className="banner-button">
                Đặt Ngay
              </Link>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}

export default Banner;
