import React, { useEffect, lazy, Suspense } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import { useDispatch } from "react-redux";

// Components cần thiết cho trang chủ - import trực tiếp
import Menu from "../container/trangchu/menu/Menu";
import Trangchu from "./Trangchu";
import Loading from "./Loading";

// Import các actions cần thiết cho trang chủ
import { anhData } from "../container/admin/Anh/anhSlice";
import { tourData } from "../container/admin/Tour/tourSlice";
import { hotelData } from "../container/admin/Hotel/hotelSlice";
import { loaitourData } from "../container/admin/Loaitour/loaitourSlice";
import { diadiemData } from "../container/admin/DiaDiem/diadiemSlice";

// Lazy load các components
const Login = lazy(() => import("../container/login/Login"));
const Admin = lazy(() => import("./Admin"));
const Dangky = lazy(() => import("../container/dangky/Dangky"));
const Tour = lazy(() => import("../container/detailtour/tour/Tour"));
const Tintucdetail = lazy(() => import("../container/tintuc/tintucdetail/Tintucdetail"));
const Listtour = lazy(() => import("../container/Listtour/Listtour"));
const Dattour = lazy(() => import("../container/detailtour/dattour/Dattour"));
const Listtintuc = lazy(() => import("../container/tintuc/listtintuc/Listtintuc"));
const Hotel = lazy(() => import("../container/hotels/Hotel"));
const DetailHotel = lazy(() => import("../container/hotels/detail/DetailHotel"));
const Contact = lazy(() => import("../container/hotels/info/Contact"));
const Error = lazy(() => import("./Error"));
const Thongtin = lazy(() => import("../container/trangchu/thongtin/Thongtin"));
const Stripe = lazy(() => import("../teststripe/Stripe"));
const GioiThieuCongTy = lazy(() => import("../container/gioithieucongty/GioiThieuCongTy"));

// Lazy load các actions khác
const loadSecondaryData = () => {
    return Promise.all([
        import("../container/admin/Quocgia/quocgiaSlice").then(module => module.quocgiaData),
        import("../container/admin/tintuc/tintucSlice").then(module => module.tintucData),
        import("../container/admin/mxh/mangxahoiSlice").then(module => module.mangxahoiData),
        import("../container/admin/Binhluan/binhluanSlice").then(module => module.binhluanData),
        import("../container/admin/Tag/tagSlice").then(module => module.tagData),
        import("../container/admin/Dichvu/dichvuSlice").then(module => module.dichvuData),
        import("../container/admin/Hoadon/hoadonSlice").then(module => module.hoadonData),
        import("../container/admin/Role/roleSlice").then(module => module.roleData),
        import("../container/admin/Lienhe/lienheSlice").then(module => module.lienheData),
        import("../container/admin/Ngaydi/ngaydiSlice").then(module => module.ngaydiData),
        import("../container/admin/Camnangdulich/camnangdulichSlice").then(module => module.camnangdulichData),
        import("../container/login/inforSlice").then(module => module.inforData),
        import("../container/admin/Chiphi/chiphiSlice").then(module => module.chiphiData)
    ]);
};

export default function MainApp() {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadPrimaryData = async () => {
            try {
                await Promise.all([
                    dispatch(anhData()),
                    dispatch(tourData()),
                    dispatch(loaitourData()),
                    dispatch(diadiemData()),
                    dispatch(hotelData())
                ]);
            } catch (error) {
                console.error("Error loading primary data:", error);
            }
        };

        loadPrimaryData();

        const loadOtherData = async () => {
            try {
                const actions = await loadSecondaryData();
                actions.forEach(action => dispatch(action()));
            } catch (error) {
                console.error("Error loading secondary data:", error);
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(loadOtherData);
        } else {
            setTimeout(loadOtherData, 2000);
        }
    }, [dispatch]);

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/dangnhap" />
                    <Route path="/dangky" />
                    <Route path="/admin" />
                    <Route path="/">
                        <Menu isHome={window.location.pathname === "/"} />
                    </Route>
                </Switch>
                
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <Route exact path="/">
                            <Trangchu />
                        </Route>
                        <Route path="/admin">
                            <Ladmin />
                        </Route>
                        <Route path="/thongtin/:id">
                            <Thongtin />
                        </Route>
                        <Route path="/dangnhap">
                            <Ldangnhap />
                        </Route>
                        <Route path="/dangky">
                            <Dangky />
                        </Route>
                        <Route path="/listtintuc">
                            <Listtintuc />
                        </Route>
                        <Route path="/tour/:id">
                            <Tour />
                        </Route>
                        <Route path="/detail-new/:id">
                            <Tintucdetail />
                        </Route>
                        <Route path="/list-tour/:id">
                            <Listtour />
                        </Route>
                        <Route path="/list-tour">
                            <Listtour />
                        </Route>
                        <Route path="/dat-tour">
                            <Dattour />
                        </Route>
                        <Route path="/stripe">
                            <Stripe />
                        </Route>
                        <Route path="/hotels">
                            <Hotel />
                        </Route>
                        <Route path="/detailhotel/:id">
                            <DetailHotel />
                        </Route>
                        <Route path="/lienhe_khachsan">
                            <Contact />
                        </Route>
                        <Route path="/gioithieucongty">
                            <GioiThieuCongTy />
                        </Route>
                    </Switch>
                </Suspense>
            </div>
        </Router>
    );
}

function Ldangnhap() {
    let { url } = useRouteMatch();
    return <Login url={url} />;
}

function Ladmin() {
    let { path, url } = useRouteMatch();
    if (localStorage.getItem("token")) {
        return <Admin path={path} url={url} />;
    } else {
        return <Error />;
    }
}
