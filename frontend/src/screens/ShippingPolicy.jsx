import React, { useEffect } from "react";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { IoArrowBack } from 'react-icons/io5';
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Meta title={"Chính Sách Vận Chuyển"} />
      <BreadCrumb title="Chính Sách Vận Chuyển" />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1="policy-wrapper py-4">
        <div className="row">
          <div className="col-12">
            <div className="policy">
              <h5 className="title text-uppercase text-center text-black">
                Chính sách vận chuyển của chúng tôi
              </h5>
              <div className="py-3">
                <p>
                  <strong>1. Phí Vận Chuyển</strong>
                </p>
                <p>
                  1.1. Phí vận chuyển sẽ được tính toán dựa trên địa chỉ giao
                  hàng của bạn. Xin vui lòng kiểm tra phí vận chuyển tại trang
                  thanh toán.
                </p>

                <p>
                  <strong>2. Thời Gian Giao Hàng</strong>
                </p>
                <p>
                  2.1. Chúng tôi cam kết giao hàng trong vòng 3-5 ngày làm việc
                  kể từ khi xác nhận đơn đặt hàng của bạn.
                </p>

                <p>
                  <strong>3. Vùng Giao Hàng</strong>
                </p>
                <p>
                  3.1. Chúng tôi cung cấp dịch vụ giao hàng đến các địa chỉ trên
                  toàn quốc.
                </p>

                <p>
                  <strong>4. Trạng Thái Đơn Hàng</strong>
                </p>
                <p>
                  4.1. Bạn có thể theo dõi trạng thái đơn hàng của mình bằng
                  cách đăng nhập vào tài khoản của mình trên trang web hoặc vui
                  lòng liên hệ với chúng tôi qua địa chỉ email:{" "}
                  <a href="mailto:your@email.com">tlipstick@email.com</a> hoặc
                  số hotline: <a href="tel:+123456789">+84 946053795</a>.
                </p>

                <p>
                  <strong>5. Liên Hệ</strong>
                </p>
                <p>
                  Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về chính sách vận
                  chuyển của chúng tôi, vui lòng liên hệ với chúng tôi qua địa
                  chỉ email:{" "}
                  <a href="mailto:your@email.com">tlipstick@email.com</a> hoặc
                  số hotline: <a href="tel:+123456789">+84 946053795</a>.
                </p>

                <p>Cảm ơn bạn đã chọn chúng tôi!</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ShippingPolicy;
