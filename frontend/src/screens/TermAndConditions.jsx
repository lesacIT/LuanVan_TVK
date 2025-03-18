import React, { useEffect } from "react";
import { IoArrowBack } from 'react-icons/io5';
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import Meta from "../components/Meta";

const TermAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Meta title={"Điều Khoản & Điều Kiện"} />
      <BreadCrumb title="Điều Khoản & Điều Kiện" />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1="policy-wrapper py-4">
        <div className="row">
          <div className="col-12">
            <div className="policy">
              <h5 className="title text-uppercase text-center text-black">
                Điều khoản và điều kiện
              </h5>
              <div className="py-3">
                <p>
                  <strong>1. Chấp Nhận Điều Khoản</strong>
                </p>
                <p>
                  1.1. Bằng cách sử dụng trang web của chúng tôi, bạn đồng ý
                  tuân thủ các điều khoản và điều kiện sau đây. Nếu bạn không
                  đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng trang
                  web ngay lập tức.
                </p>

                <p>
                  <strong>2. Quyền Lực và Trách Nhiệm</strong>
                </p>
                <p>
                  2.1. Chúng tôi giữ quyền lực cuối cùng quyết định về việc cung
                  cấp, từ chối cung cấp hoặc chấm dứt bất kỳ dịch vụ nào.
                </p>

                <p>
                  <strong>3. Bảo Mật Thông Tin</strong>
                </p>
                <p>
                  3.1. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo
                  các biện pháp an ninh hợp lý.
                </p>

                <p>
                  <strong>4. Thay Đổi Điều Khoản</strong>
                </p>
                <p>
                  4.1. Chúng tôi có quyền thay đổi điều khoản và điều kiện này
                  mà không cần thông báo trước. Việc sử dụng tiếp tục của bạn
                  sau các thay đổi này đồng nghĩa với sự chấp nhận của bạn đối
                  với các thay đổi đó.
                </p>

                <p>
                  <strong>5. Liên Hệ</strong>
                </p>
                <p>
                  5.1. Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về điều khoản
                  và điều kiện của chúng tôi, vui lòng liên hệ với chúng tôi qua
                  địa chỉ email:{" "}
                  <a href="mailto:your@email.com">Babyboo@email.com</a> hoặc
                  số hotline: <a href="tel:+123456789">+ 84 12345678</a>.
                </p>

                <p>
                  Cảm ơn bạn đã đọc và hiểu các điều khoản và điều kiện của
                  chúng tôi!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TermAndConditions;
