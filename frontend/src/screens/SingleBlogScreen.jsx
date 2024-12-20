import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Button, Form } from 'react-bootstrap';
import { IoEyeOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
  useGetBlogDetailsQuery,
  useCreateReviewBlogMutation,
} from '../slices/blogsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Container from '../components/Container';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IoArrowBack } from 'react-icons/io5';
import Meta from '../components/Meta';
import BreadCrumb from "../components/BreadCrumb";

const SingleBlogScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id: blogId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: blog,
    isLoading,
    refetch,
    error,
  } = useGetBlogDetailsQuery(blogId);

  const formattedDate =
    blog && blog.createdAt
      ? format(new Date(blog.createdAt), 'do MMMM yyyy, HH:mm:ss', {
          locale: vi,
        })
      : 'Không có ngày tạo';

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingBlogReview }] =
    useCreateReviewBlogMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        blogId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Đã đánh giá thành công');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Meta title={'Chi Tiết Bài Viết'} />
      <BreadCrumb title={blog?.title} />
      <Link to='/blog'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Container class1='description-wrapper py-4'>
            <div className='row'>
              <div className='col-12'>
                <div className='description-inner-wrapper bg-white p-3'>
                  <h4 className='title text-black'>{blog.title}</h4>
                  <h6 className='title'>
                    <i>
                      Bài viết được tạo lúc {formattedDate}{' '}
                    </i>
                  </h6>

                  <p>
                    <IoEyeOutline /> Lượt xem {blog.numViews}
                  </p>
                  <h6 className='title2'>{blog.category}</h6>

                  <div className='text-center'>
                    <img
                      src={blog.image}
                      className='img-fluid w-50 my-4'
                      alt='blog'
                    />
                  </div>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: blog.description,
                    }}
                  ></p>
                </div>
              </div>
            </div>
          </Container>
          <Container class1='reviews-wrapper'>
            <div className='row'>
              <div className='col-12'>
                <h4 className='text-black'>Đánh giá</h4>
                {blog.reviews.length === 0 && (
                  <Message>Không có đánh giá</Message>
                )}
                <ListGroup variant='flush'>
                  {blog.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <div className='my-2'>
                        <Rating value={review.rating} />
                      </div>
                      <p className='my-2'>
                        <span>
                          {format(
                            new Date(review.createdAt),
                            'HH:mm:ss, do MMMM yyyy',
                            { locale: vi }
                          )}
                        </span>
                      </p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h5>Viết một đánh giá</h5>

                    {loadingBlogReview && <Loader />}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='rating'>
                          <Form.Label>Chất lượng</Form.Label>
                          <Form.Control
                            as='select'
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value=''>Chọn...</option>
                            <option value='1'>1 - Rất tệ</option>
                            <option value='2'>2 - Tệ</option>
                            <option value='3'>3 - Tốt</option>
                            <option value='4'>4 - Rất tốt</option>
                            <option value='5'>5 - Tuyệt vời</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className='my-2' controlId='comment'>
                          <Form.Label>Lời đánh giá bài viết</Form.Label>
                          <Form.Control
                            as='textarea'
                            row='3'
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <div className='text-end'>
                          <Button
                            disabled={loadingBlogReview}
                            type='submit'
                            variant='primary'
                            className='button my-3'
                          >
                            Gửi đánh giá
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <Message>
                        Vui lòng <Link to='/login'>đăng nhập</Link> để viết đánh
                        giá
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default SingleBlogScreen;
