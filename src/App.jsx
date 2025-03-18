import React, { useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import './App.css';

// Components cần thiết cho trang chủ - import trực tiếp
import Menu from "./features/container/trangchu/menu/Menu";
import Trangchu from "./features/components/Trangchu";
import Loading from "./features/components/Loading";

// Import các actions cần thiết cho trang chủ
import { anhData } from "./features/container/admin/Anh/anhSlice";
import { tourData } from "./features/container/admin/Tour/tourSlice";
import { hotelData } from "./features/container/admin/Hotel/hotelSlice";
import { loaitourData } from "./features/container/admin/Loaitour/loaitourSlice";
import { diadiemData } from "./features/container/admin/DiaDiem/diadiemSlice";
import { lienhekhachsanData } from "./features/container/admin/Lienhekhachsan/lienhekhachsanSlice";

// Lazy load các components
const Login = lazy(() => import("./features/container/login/Login"));
const Admin = lazy(() => import("./features/components/Admin"));
const Dangky = lazy(() => import("./features/container/dangky/Dangky"));
const Tour = lazy(() => import("./features/container/detailtour/tour/Tour"));
const Tintucdetail = lazy(() => import("./features/container/tintuc/tintucdetail/Tintucdetail"));
const Listtour = lazy(() => import("./features/container/Listtour/Listtour"));
const Dattour = lazy(() => import("./features/container/detailtour/dattour/Dattour"));
const Listtintuc = lazy(() => import("./features/container/tintuc/listtintuc/Listtintuc"));
const Hotel = lazy(() => import("./features/container/hotels/Hotel"));
const DetailHotel = lazy(() => import("./features/container/hotels/detail/DetailHotel"));
const Contact = lazy(() => import("./features/container/hotels/info/Contact"));
const Error = lazy(() => import("./features/components/Error"));
const Thongtin = lazy(() => import("./features/container/trangchu/thongtin/Thongtin"));
const GioiThieuCongTy = lazy(() => import("./features/container/gioithieucongty/GioiThieuCongTy"));
const ForgotPassword = lazy(() => import("./features/container/login/ForgotPassword"));
const ResetPassword = lazy(() => import("./features/container/login/ResetPassword"));

// Lazy load các actions khác
const loadSecondaryData = () => {
  return Promise.all([
    import("./features/container/admin/Quocgia/quocgiaSlice").then(module => module.quocgiaData),
    import("./features/container/admin/tintuc/tintucSlice").then(module => module.tintucData),
    import("./features/container/admin/mxh/mangxahoiSlice").then(module => module.mangxahoiData),
    import("./features/container/admin/Binhluan/binhluanSlice").then(module => module.binhluanData),
    import("./features/container/admin/Tag/tagSlice").then(module => module.tagData),
    import("./features/container/admin/Dichvu/dichvuSlice").then(module => module.dichvuData),
    import("./features/container/admin/Hoadon/hoadonSlice").then(module => module.hoadonData),
    import("./features/container/admin/Role/roleSlice").then(module => module.roleData),
    import("./features/container/admin/Lienhe/lienheSlice").then(module => module.lienheData),
    import("./features/container/admin/Ngaydi/ngaydiSlice").then(module => module.ngaydiData),
    import("./features/container/admin/Camnangdulich/camnangdulichSlice").then(module => module.camnangdulichData),
    import("./features/container/login/inforSlice").then(module => module.inforData),
    import("./features/container/admin/Chiphi/chiphiSlice").then(module => module.chiphiData),
    import("./features/container/admin/Lienhekhachsan/lienhekhachsanSlice").then(module => module.lienhekhachsanData)
  ]);
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPrimaryData = async () => {
      try {
        await Promise.all([
          dispatch(anhData()),
          dispatch(tourData()),
          dispatch(loaitourData()),
          dispatch(diadiemData()),
          dispatch(hotelData()),
          dispatch(lienhekhachsanData())
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
    <div className="app">
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
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route path="/reset-password/:token">
                <ResetPassword />
              </Route>
            </Switch>
          </Suspense>
        </div>
      </Router>
    </div>
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

export default App;
