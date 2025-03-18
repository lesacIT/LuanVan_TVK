import React, { useEffect } from "react";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { IoArrowBack } from 'react-icons/io5';
import BreadCrumb from "../components/BreadCrumb";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Meta title={"Chính Sách Bảo Mật"} />
      <BreadCrumb title="Chính Sách Bảo Mật" />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1="policy-wrapper py-4">
        <div className="row">
          <div className="col-12">
            <div className="policy">
              <h5 className="title text-uppercase text-center text-black">
                Chính sách bảo mật của chúng tôi
              </h5>
              <div className="py-3">
                <p>
                  <strong>1. Thu thập thông tin cá nhân</strong>
                </p>
                <p>
                  1.1. Chúng tôi thu thập thông tin cá nhân từ bạn khi bạn đăng
                  ký tài khoản, thực hiện giao dịch mua sắm, hoặc gửi thông tin
                  qua các biểu mẫu trên trang web của chúng tôi.
                </p>
                <p>
                  1.2. Thông tin cá nhân mà chúng tôi có thể thu thập bao gồm
                  tên, địa chỉ email, địa chỉ giao hàng, số điện thoại và thông
                  tin thanh toán.
                </p>

                <p>
                  <strong>2. Sử dụng thông tin cá nhân</strong>
                </p>
                <p>
                  2.1. Chúng tôi sử dụng thông tin cá nhân của bạn để xác nhận
                  và xử lý đơn đặt hàng, gửi thông báo liên quan đến giao dịch,
                  và cung cấp hỗ trợ khách hàng.
                </p>
                <p>
                  2.2. Chúng tôi có thể sử dụng thông tin cá nhân để gửi thông
                  báo tiếp thị và quảng cáo về sản phẩm và dịch vụ của chúng
                  tôi, nhưng chúng tôi sẽ tuân thủ theo các yêu cầu về quảng cáo
                  và thông báo tiếp thị.
                </p>

                <p>
                  <strong>3. Bảo mật thông tin cá nhân</strong>
                </p>
                <p>
                  3.1. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và
                  thực hiện các biện pháp an ninh để ngăn chặn truy cập trái
                  phép, sử dụng, tiết lộ, thay đổi hoặc hủy hoại thông tin.
                </p>
                <p>
                  3.2. Chúng tôi sử dụng kỹ thuật mã hóa để bảo vệ dữ liệu cá
                  nhân khi truyền qua Internet và lưu trữ trên hệ thống của
                  chúng tôi.
                </p>

                <p>
                  <strong>4. Chia sẻ thông tin cá nhân</strong>
                </p>
                <p>
                  4.1. Chúng tôi không chia sẻ thông tin cá nhân của bạn với bất
                  kỳ bên thứ ba nào ngoại trừ những trường hợp cần thiết để xử
                  lý đơn đặt hàng và giao hàng.
                </p>
                <p>
                  4.2. Chúng tôi có thể chia sẻ thông tin cá nhân với các đối
                  tác công nghiệp để cung cấp dịch vụ hỗ trợ, như xử lý thanh
                  toán hoặc vận chuyển.
                </p>

                <p>
                  <strong>5. Quyền lợi của bạn</strong>
                </p>
                <p>
                  5.1. Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân
                  của mình bất kỳ lúc nào.
                </p>
                <p>
                  5.2. Nếu bạn không muốn nhận thông báo tiếp thị từ chúng tôi,
                  bạn có thể từ chối bằng cách thay đổi cài đặt tài khoản hoặc
                  theo các hướng dẫn trong thông báo.
                </p>

                <p>
                  <strong>6. Thay đổi chính sách</strong>
                </p>
                <p>
                  6.1. Chúng tôi có quyền cập nhật và thay đổi chính sách bảo
                  mật này. Bất kỳ thay đổi nào sẽ được thông báo trên trang web
                  của chúng tôi.
                </p>

                <p>
                  <strong>Liên hệ</strong>
                </p>
                <p>
                  Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về chính sách bảo
                  mật của chúng tôi, vui lòng liên hệ với chúng tôi qua địa chỉ
                  email: <a href="mailto:your@email.com">babyboo@email.com</a>{" "}
                  hoặc số hotline: <a href="tel:+123456789">+84 12345678</a>.
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

export default PrivacyPolicy;
