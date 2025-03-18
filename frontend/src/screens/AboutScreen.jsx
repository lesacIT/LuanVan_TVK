import React, { useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import Container from '../components/Container';
import Meta from '../components/Meta';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Meta title={'Giới Thiệu - Tiệm Len Babyboo'} />
      <BreadCrumb title={'Giới Thiệu'} />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1='policy-wrapper py-4'>
        <div className='container-xxl'>
          <div className='container pb-4'>
            <div className='row g-5 align-items-end'>
              <div className='col-lg-3 col-md-5 wow fadeInUp'>
                <img
                  className='img-fluid rounded'
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVqH127_09LZJEu2uhaEWbWisvuPUL6MSnqg&s'
                  alt='Tiệm Len Babyboo'
                />
              </div>
              <div
                className='col-lg-6 col-md-7 wow fadeInUp'
                data-wow-delay='0.3s'
              >

                <p className='color mb-4 '>
                  Chuyên cung cấp len và sản phẩm thủ công chất lượng cao
                </p>

                <h1 className='display-5 mb-4 text-black'>
                  TIỆM LEN BABYBOO - ĐAM MÊ LEN SỢI
                </h1>
                <p className='mb-4'>
                  Chúng tôi cam kết cung cấp len an toàn, màu sắc đa dạng, phù hợp với mọi nhu cầu từ đan áo, làm thú bông, đến các dự án handmade độc đáo.
                </p>
                <Link to='/store'>
                  <button className='button'>Khám phá ngay</button>
                </Link>
              </div>
              <div
                className='col-lg-3 col-md-12 wow fadeInUp'
                data-wow-delay='0.5s'
              >
                <div className='row g-5'>
                  <div className='col-12 col-sm-6 col-lg-12'>
                    <div className='border-start ps-4'>
                      <i className='fa fa-check-circle fa-3x mb-3 color'></i>
                      <h4 className='mb-3 text-black'>Chất Lượng Cao</h4>
                      <span className='text-muted'>
                        Len nhập khẩu và nội địa cao cấp, bền đẹp, không xù lông.
                      </span>
                    </div>
                  </div>
                  <div className='col-12 col-sm-6 col-lg-12'>
                    <div className='border-start ps-4'>
                      <i className='fa fa-hand-holding-heart fa-3x mb-3 color'></i>
                      <h4 className='mb-3 text-black'>Hỗ Trợ Nhiệt Tình</h4>
                      <span className='text-muted'>
                        Tư vấn chọn len phù hợp cho từng dự án, hướng dẫn đan móc chi tiết.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default About;