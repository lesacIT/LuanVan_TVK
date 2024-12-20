import React from "react";
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import { Link } from "react-router-dom";
import newsletter from "../images/newsletter.png";

const Footer = () => {
  return (
    <>
      <footer className="py-5">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src={newsletter} alt="newsletter" />
                <h4 className="text-white mb-0 text-uppercase">
                  Đăng Ký Để Nhận Tin Tức Mới
                </h4>
              </div>
            </div>
            <div className="col-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-1"
                  placeholder="Nhập Email Của Bạn"
                  aria-label="Nhập Email Của Bạn"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2" id="basic-addon2">
                  Đăng ký
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto">
              <h5 className="text-uppercase fw-bold text-white">GO MART</h5>
              <hr />
              <p className="text-white">
                Mang đến cho bạn những thỏi son xinh đẹp, chất lượng với giá
                thành tốt nhất là tiêu chí hàng đầu của chúng tôi.
              </p>
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h5 className="text-white mb-4 text-uppercase">Tài Khoản</h5>
              <div className="footer-link d-flex flex-column">
                <Link to="/about" className="text-white py-2 mb-1">
                  Về chúng tôi
                </Link>
                <Link to="/contact" className="text-white py-2 mb-1">
                  Liên hệ
                </Link>
                <Link to="/blog" className="text-white py-2 mb-1">
                  Bài viết
                </Link>
              </div>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h5 className="text-white mb-4 text-uppercase">Thông Tin</h5>
              <div className="footer-link d-flex flex-column">
                <Link to="/privacy-policy" className="text-white py-2 mb-1">
                  Chính sách bảo mật
                </Link>
                <Link to="/refund-policy" className="text-white py-2 mb-1">
                  Chính sách hoàn trả
                </Link>
                <Link to="/shipping-policy" className="text-white py-2 mb-1">
                  Chính sách vận chuyển
                </Link>
                <Link to="/termandconditions" className="text-white py-2 mb-1">
                  Điều khoản & điều kiện
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto">
              <h5 className="text-white mb-4 text-uppercase">
                Liên Hệ Chúng Tôi
              </h5>
              <div>
                <address className="text-white fs-6 py-3">
                  Địa chỉ: Đường 3/2, Phường Xuân Khánh, <br /> Quận Ninh Kiều,
                  Thành Phố Cần Thơ
                </address>
                <a
                  href="tel:+84 946053795"
                  className="mt-3 d-block mb-1 text-white"
                >
                  +84 12345678
                </a>
                <a
                  href="mailto:ttech@gmail.com"
                  className="mt-2 d-block mb-0 text-white"
                >
                  gomart@gmail.com
                </a>
                <div className="social_icons d-flex align-items-center gap-30 mt-4">
                  <a className="text-white" href="/">
                    <BsInstagram className="fs-4" />
                  </a>
                  <a className="text-white" href="/">
                    <BsFacebook className="fs-4" />
                  </a>
                  <a className="text-white" href="/">
                    <BsTwitter className="fs-4" />
                  </a>
                  <a className="text-white" href="/">
                    <BsYoutube className="fs-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="pt-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12 mb-0 text-white">
              <p className="text-center">&copy; {new Date().getFullYear()}.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
