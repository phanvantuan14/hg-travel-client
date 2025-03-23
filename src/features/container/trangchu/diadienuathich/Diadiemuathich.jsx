import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { useSelector } from 'react-redux';
import './diadiemuathich.css';
import defaultDestination from '../../../images/bg.jpg';
import { Link } from 'react-router-dom';

function Diadiemuathich() {
    const [favoriteDestinations, setFavoriteDestinations] = useState([]);
    const diadiemData = useSelector(state => state.diadiems.diadiem.data);
    const tourData = useSelector(state => state.tours.tour.data);

    useEffect(() => {
        if (!diadiemData || !tourData) return;

        const processedDestinations = diadiemData
            .map(diadiem => {
                const relatedTour = tourData.find(tour =>
                    tour.Diadiems && tour.Diadiems.some(d => d.id === diadiem.id)
                );

                console.log(relatedTour)

                return {
                    id: diadiem.id,
                    location: relatedTour ? relatedTour.name : '',
                    image: relatedTour ? relatedTour.avatar : defaultDestination,
                    tourId: relatedTour ? relatedTour.id : null
                };
            })
            .filter(dest => {
                const relatedTour = tourData.find(tour =>
                    tour.Diadiems && tour.Diadiems.some(d => d.id === dest.id)
                );
                return relatedTour && relatedTour.avatar;
            })
            .slice(0, 12);

        setFavoriteDestinations(processedDestinations);
    }, [diadiemData, tourData]);

    const chunks = [];
    for (let i = 0; i < favoriteDestinations.length; i += 4) {
        chunks.push(favoriteDestinations.slice(i, i + 4));
    }

    return (
        <div className="favorite-destinations mt-3" id="diemdenuathich">
            <div className="heading text-center">
                <span>Điểm đến yêu thích</span>
                <div className="hr"></div>
            </div>
            <div className="container mt-4">
                <Carousel
                    autoplay
                    effect="fade"
                    delay={2000}
                    dots={false}
                    slidesToShow={1}
                    slidesToScroll={1}
                    className="destination-carousel"
                >
                    {chunks.map((chunk, index) => (
                        <div key={index}>
                            <div className="row">
                                {chunk.map(destination => (
                                    <div key={destination.id} className="col-md-3">
                                        <Link to={`/tour/${destination.tourId}`}>
                                            <div className="destination-card">
                                                <div className="card-image">
                                                    <img
                                                        src={destination.image}
                                                        alt={destination.location}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = defaultDestination;
                                                        }}
                                                    />
                                                </div>
                                                <div className="card-content">
                                                    <p>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                        {destination.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Diadiemuathich;